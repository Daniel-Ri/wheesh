const request = require('supertest');
const Redis = require("ioredis-mock");
const { Op } = require("sequelize");
const app = require('../../index');

const { Schedule, SchedulePrice, Order, OrderedSeat, Train, Carriage, Seat, Payment, sequelize } = require('../../models/index');
const { up: upUser, down: downUser } = require('../../seeders/20231205021723-user');
const { up: upPassenger, down: downPassenger } = require('../../seeders/20231205023546-passenger');
const { up: upStation, down: downStation } = require('../../seeders/20231208023152-station');
const { up: upScheduleDay, down: downScheduleDay } = require('../../seeders/20231208040653-scheduleDay');
const { up: upTrain, down: downTrain } = require('../../seeders/20231208041837-train');
const { up: upSchedule, down: downSchedule } = require('../../seeders/20231208043910-schedule');
const { up: upSchedulePrice, down: downSchedulePrice } = require('../../seeders/20231208070828-schedulePrice');
const { up: upCarriage, down: downCarriage } = require('../../seeders/20231211040055-carriage');
const { up: upSeat, down: downSeat } = require('../../seeders/20231211041822-seat');
const { up: upOrder, down: downOrder } = require('../../seeders/20231211054219-order');
const { up: upOrderedSeat, down: downOrderedSeat } = require('../../seeders/20231211063308-orderedSeat');
const { up: upPayment, down: downPayment } = require('../../seeders/20231213090332-payment');
const { deleteNotPaidOrderPassedDueTime, remindUserBeforeOneHourOfDeparture } = require('../../utils/handleJob');
const { encrypt } = require('../../utils/handleCrypto');
const { queryInterface } = sequelize;

const mockRedisClient = new Redis();
jest.mock("ioredis", () => require("ioredis-mock"));

// Mock node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

// Mock the entire handleMail module
jest.mock("../../utils/handleMail", () => ({
  transporter: {
    sendMail: jest.fn(),
  },
  generateMailOptionsForNewEmail: jest.fn(),
  generateMailOptionsForUpdateEmail: jest.fn(),
  generateMailOptionsForRemindSchedule: jest.fn(),
}));

let firstToken;
let secondToken;

const firstDummyUser = {
  usernameOrEmail: 'johndoe',
  password: '123456',
};
const secondDummyUser = {
  usernameOrEmail: 'agus',
  password: '123456',
};

beforeAll(async () => {
  await upUser(queryInterface, sequelize);
  await upPassenger(queryInterface, sequelize);
  await upStation(queryInterface, sequelize);
  await upScheduleDay(queryInterface, sequelize);
  await upTrain(queryInterface, sequelize);
  await upSchedule(queryInterface, sequelize);
  await upSchedulePrice(queryInterface, sequelize);
  await upCarriage(queryInterface, sequelize);
  await upSeat(queryInterface, sequelize);
  await upOrder(queryInterface, sequelize);
  await upOrderedSeat(queryInterface, sequelize);
  await upPayment(queryInterface, sequelize);

  const firstLoginResponse = 
    await request(app).post('/api/user/login').send(firstDummyUser);
  const secondLoginResponse = 
    await request(app).post('/api/user/login').send(secondDummyUser);
  firstToken = firstLoginResponse.body.token;
  secondToken = secondLoginResponse.body.token;
}, 15000);

afterAll(async () => {
  await downUser(queryInterface, sequelize);
  await downPassenger(queryInterface, sequelize);
  await downStation(queryInterface, sequelize);
  await downScheduleDay(queryInterface, sequelize);
  await downTrain(queryInterface, sequelize);
  await downSchedule(queryInterface, sequelize);
  await downSchedulePrice(queryInterface, sequelize);
  await downCarriage(queryInterface, sequelize);
  await downSeat(queryInterface, sequelize);
  await downOrder(queryInterface, sequelize);
  await downOrderedSeat(queryInterface, sequelize);
  await downPayment(queryInterface, sequelize);
});

const getTomorrowSchedules = async () => {
  const tomorrow = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000);
  const tomorrowSchedules = await Schedule.findAll({
    where: {
      departureTime: {[Op.gte]: tomorrow},
    },
    order: [
      ['departureTime', 'ASC']
    ],
    include: [
      {
        model: Train,
        attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
        include: [
          {
            model: Carriage,
            attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
            include: [
              {
                model: Seat,
                attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
              }
            ]
          }
        ]
      },
    ],
  });

  return tomorrowSchedules;
};

const getTwoSeats = (schedule, seatClass="business") => {
  let seatIds;
  if (seatClass === 'business') {
    //  First and last carriage contain first and business class seats
    seatIds = 
      schedule
        .Train
        .Carriages[0]
        .Seats.filter((seat) => seat.seatClass === seatClass).map((seat) => seat.id);

  } else if (seatClass === 'economy') {
    seatIds = 
      schedule
        .Train
        .Carriages[1]
        .Seats.filter((seat) => seat.seatClass === seatClass).map((seat) => seat.id);
  }

  const choosenSeats = [];
  choosenSeats.push(seatIds[0]);
  choosenSeats.push(seatIds[1]);

  return choosenSeats;
};

describe('Delete Not Paid Order Passed Due Time', () => {
  beforeEach(() => {
    mockRedisClient.flushall();
  });

  test('Success delete', async () => {
    let orders;
    const whichOrderTomorrow = 2; // the second schedule tomorrow only have first class full booked
    const firstPassengerIds = [2, 3];
    const secondPassengerIds = [5, 6];

    try {
      const tomorrowSchedules = await getTomorrowSchedules();
      const schedule = tomorrowSchedules[whichOrderTomorrow - 1];
      const firstChoosenSeats = getTwoSeats(schedule, 'business');
      const secondChoosenSeats = getTwoSeats(schedule, 'economy');

      const firstInputs = {
        scheduleId: schedule.id,
        orderedSeats: 
          firstPassengerIds
            .map((passengerId, idx) => ({seatId: firstChoosenSeats[idx], passengerId})),
      };

      const secondInputs = {
        scheduleId: schedule.id,
        orderedSeats: 
          secondPassengerIds
            .map((passengerId, idx) => ({seatId: secondChoosenSeats[idx], passengerId})),
      };

      await request(app)
        .post('/api/order').set('authorization', `Bearer ${firstToken}`).send(firstInputs);

      await request(app)
        .post('/api/order').set('authorization', `Bearer ${secondToken}`).send(secondInputs);

      const notPaidOrders = await Order.findAll({
        include: [
          {
            model: Payment,
            where: {
              isPaid: false,
            }
          }
        ],
        limit: 2,
        order: [
          [
            "id", 'DESC'
          ]
        ]
      });

      const notPaidOrderIds = notPaidOrders.map((order) => order.id);

      // Iterate over not paid orders and update duePayment to be one minute ago
      for (const order of notPaidOrders) {
        const oneMinuteAgo = new Date(new Date() - 60 * 1000);
        
        // Update duePayment attribute
        order.Payment.duePayment = oneMinuteAgo;

        // Save the changes to the database
        await order.Payment.save();
      }

      await deleteNotPaidOrderPassedDueTime();

      orders = await Order.findAll({
        where: {
          id: notPaidOrderIds
        },
      });

    } catch (err) {
      console.error(err);
    }

    expect(orders.length).toEqual(0);
  }, 15000);
});

describe('Remind User Before One Hour of Departure', () => {
  test('Success remind', async () => {
    let ordersBeforeNotified;
    let ordersAfterNotified;
    const departureStationId = 1;  // Halim
    const arrivalStationId = 3;    // Padalarang
    const departureTime = new Date(new Date().getTime() + 50 * 60 * 1000);
    const arrivalTime = new Date(new Date().getTime() + 100 * 60 * 1000);
    const firstSeatPrice = 600000;
    const businessSeatPrice = 450000;
    const economySeatPrice = 200000;

    const firstPassengerIds = [2, 3];
    const secondPassengerIds = [5, 6];

    try {
      const lastTrain = await Train.findOne({
        order: [
          ['id', 'DESC'],
        ]
      });

      await Schedule.create({
        trainId: lastTrain.id,
        departureStationId,
        arrivalStationId,
        departureTime,
        arrivalTime,
      });

      const createdSchedule = await Schedule.findOne({
        include: [
          {
            model: Train,
            include: [
              {
                model: Carriage,
                include: [
                  {
                    model: Seat,
                  }
                ]
              }
            ]
          },
        ],
        order: [
          ['id', 'DESC']
        ]
      });

      await SchedulePrice.create({
        scheduleId: createdSchedule.id,
        seatClass: 'first',
        price: firstSeatPrice,
      });

      await SchedulePrice.create({
        scheduleId: createdSchedule.id,
        seatClass: 'business',
        price: businessSeatPrice,
      });

      await SchedulePrice.create({
        scheduleId: createdSchedule.id,
        seatClass: 'economy',
        price: economySeatPrice,
      });

      const firstChoosenSeats = getTwoSeats(createdSchedule, 'business');
      const secondChoosenSeats = getTwoSeats(createdSchedule, 'economy');

      const firstInputs = {
        scheduleId: createdSchedule.id,
        orderedSeats: 
          firstPassengerIds
            .map((passengerId, idx) => ({seatId: firstChoosenSeats[idx], passengerId})),
      };

      const secondInputs = {
        scheduleId: createdSchedule.id,
        orderedSeats: 
          secondPassengerIds
            .map((passengerId, idx) => ({seatId: secondChoosenSeats[idx], passengerId})),
      };

      await request(app)
        .post('/api/order').set('authorization', `Bearer ${firstToken}`).send(firstInputs);

      await request(app)
        .post('/api/order').set('authorization', `Bearer ${secondToken}`).send(secondInputs);

      const ordersToBePaid = await Order.findAll({
        include: [
          {
            model: Payment,
            where: {
              isPaid: false,
            }
          }
        ],
        limit: 2,
        order: [
          [
            "id", 'DESC'
          ]
        ]
      });

      const orderToBePaidIds = ordersToBePaid.map((order) => order.id);

      await request(app)
        .put(`/api/order/${orderToBePaidIds[1]}`)
        .set('authorization', `Bearer ${firstToken}`);

      await request(app)
        .put(`/api/order/${orderToBePaidIds[0]}`)
        .set('authorization', `Bearer ${secondToken}`);

      ordersBeforeNotified = await Order.findAll({
        where: { id: orderToBePaidIds }
      });

      await remindUserBeforeOneHourOfDeparture();

      ordersAfterNotified = await Order.findAll({
        where: { id: orderToBePaidIds }
      });

    } catch (err) {
      console.error(err);
    }

    expect(ordersBeforeNotified.length).toEqual(2);
    ordersBeforeNotified.forEach((obj) => {
      expect(obj.isNotified).toBe(false);
    })
    expect(ordersAfterNotified.length).toEqual(2);
    ordersAfterNotified.forEach((obj) => {
      expect(obj.isNotified).toBe(true);
    })

  }, 10000);
})