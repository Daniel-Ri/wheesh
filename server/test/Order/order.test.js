const request = require('supertest');
const Redis = require("ioredis-mock");
const { Op } = require("sequelize");
const app = require('../../index');
const { Schedule, User, Passenger, Order, OrderedSeat, Train, Carriage, Seat, Payment, sequelize } = require('../../models/index');
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
const { encrypt, decrypt } = require('../../utils/handleCrypto');
const { queryInterface } = sequelize;

const mockRedisClient = new Redis();
jest.mock("ioredis", () => require("ioredis-mock"));

// Mock node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

let defaultToken;
let defaultDecryptedUser;

const defaultUserId = 2;
const defaultDummyUser = {
  usernameOrEmail: 'johndoe',
  password: '123456',
};
const defaultEncryptedObj = encrypt(JSON.stringify(defaultDummyUser));

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

  const defaultLoginResponse = 
    await request(app).post('/api/user/login').send({ encryptedObj: defaultEncryptedObj });
  defaultToken = defaultLoginResponse.body.token;
  defaultDecryptedUser = JSON.parse(decrypt(defaultLoginResponse.body.user));
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

const getTwoBusinessSeats = (schedule) => {
  const businessSeatIdsOfFirstCarriage = 
    schedule
      .Train
      .Carriages[0]
      .Seats.filter((seat) => seat.seatClass === 'business').map((seat) => seat.id);
  const choosenSeats = [];
  choosenSeats.push(businessSeatIdsOfFirstCarriage[0]);
  choosenSeats.push(businessSeatIdsOfFirstCarriage[1]);

  return choosenSeats;
}

describe('Create Order', () => {
  beforeEach(() => {
    mockRedisClient.flushall();
  });

  test('Success create order with status 201', async () => {
    let response;
    let order;
    const whichOrderTomorrow = 2; // second order
    const passengerIds = [2, 3] // passenger ids of default user

    try {
      const tomorrowSchedules = await getTomorrowSchedules();
      const schedule = tomorrowSchedules[whichOrderTomorrow - 1];
      const choosenSeats = getTwoBusinessSeats(schedule);

      const inputs = {
        scheduleId: schedule.id,
        orderedSeats: 
          passengerIds.map((passengerId, idx) => ({seatId: choosenSeats[idx], passengerId})),
      };

      response =
        await request(app)
          .post('/api/order')
          .set('authorization', `Bearer ${defaultToken}`)
          .send(inputs);

      order = await Order.findOne({
        where: {
          userId: defaultDecryptedUser.id,
          scheduleId: schedule.id,
        },
      });

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(201);
    expect(order).not.toBeNull();
  }, 15000);

  test('Success create second order with status 201', async () => {
    let response;
    let order;
    const departureStationId = 3;
    const whichOrderTomorrowGoBack = 5;
    const passengerIds = [2, 3] // passenger ids of default user

    try {
      const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const tomorrowSchedules = await Schedule.findAll({
        where: {
          departureTime: {[Op.gte]: tomorrow},
          departureStationId,
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
      
      const schedule = tomorrowSchedules[whichOrderTomorrowGoBack - 1];
      const choosenSeats = getTwoBusinessSeats(schedule);

      const inputs = {
        scheduleId: schedule.id,
        orderedSeats: 
          passengerIds.map((passengerId, idx) => ({seatId: choosenSeats[idx], passengerId})),
      };

      response =
        await request(app)
          .post('/api/order')
          .set('authorization', `Bearer ${defaultToken}`)
          .send(inputs);

      order = await Order.findOne({
        where: {
          userId: defaultDecryptedUser.id,
          scheduleId: schedule.id,
        },
      });

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(201);
    expect(order).not.toBeNull();
  }, 15000);

  test('Success create third order by other user with status 201', async () => {
    let response;
    let order;
    const whichOrderTomorrow = 3; // third order
    const dummyUser = {
      usernameOrEmail: 'agus',
      password: '123456',
    };
    const passengerIds = [5, 6] // passenger ids of this user

    try {
      const tomorrowSchedules = await getTomorrowSchedules();
      const encryptedObj = encrypt(JSON.stringify(dummyUser));
      const loginResponse = await request(app).post('/api/user/login').send({ encryptedObj });
      
      const schedule = tomorrowSchedules[whichOrderTomorrow - 1];
      const choosenSeats = getTwoBusinessSeats(schedule);

      const inputs = {
        scheduleId: schedule.id,
        orderedSeats: 
          passengerIds.map((passengerId, idx) => ({seatId: choosenSeats[idx], passengerId})),
      };

      response =
        await request(app)
          .post('/api/order')
          .set('authorization', `Bearer ${loginResponse.body.token}`)
          .send(inputs);

      const decryptedUser = JSON.parse(decrypt(loginResponse.body.user));

      order = await Order.findOne({
        where: {
          userId: decryptedUser.id,
          scheduleId: schedule.id,
        },
      });

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(201);
    expect(order).not.toBeNull();
  }, 15000);

  test('Failed create order: cannot book booked seat with status 409', async () => {
    let response;
    let order;
    const whichOrderTomorrow = 2; // second order
    const dummyUser = {
      usernameOrEmail: 'agus',
      password: '123456',
    };
    const passengerIds = [5, 6] // passenger ids of this user

    try {
      const tomorrowSchedules = await getTomorrowSchedules();
      const encryptedObj = encrypt(JSON.stringify(dummyUser));
      const loginResponse = await request(app).post('/api/user/login').send({ encryptedObj });
      
      const schedule = tomorrowSchedules[whichOrderTomorrow - 1];
      const choosenSeats = getTwoBusinessSeats(schedule);

      const inputs = {
        scheduleId: schedule.id,
        orderedSeats: 
          passengerIds.map((passengerId, idx) => ({seatId: choosenSeats[idx], passengerId})),
      };

      response =
        await request(app)
          .post('/api/order')
          .set('authorization', `Bearer ${loginResponse.body.token}`)
          .send(inputs);

      const decryptedUser = JSON.parse(decrypt(loginResponse.body.user));

      order = await Order.findOne({
        where: {
          userId: decryptedUser.id,
          scheduleId: schedule.id,
        },
      });

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(409);
    expect(order).toBeNull();
  }, 15000);
});

describe('Get Unpaid Orders', () => {
  test('Success get unpaid orders with status 200', async () => {
    let response;

    try {
      response =
        await request(app)
          .get('/api/order/unpaid')
          .set('authorization', `Bearer ${defaultToken}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    data.forEach((obj) => {
      expect(obj).toHaveProperty("id");
      expect(obj.userId).toEqual(defaultUserId);
      expect(obj).toHaveProperty("isNotified");
      expect(obj).toHaveProperty("createdAt");
      expect(obj).toHaveProperty("Payment");
      expect(obj).toHaveProperty("Schedule");
      expect(obj).toHaveProperty("OrderedSeats");
    });
  });
});

describe('Get Paid Orders', () => {
  test('Success get paid orders with status 200', async () => {
    let response;

    try {
      response =
        await request(app)
          .get('/api/order/paid')
          .set('authorization', `Bearer ${defaultToken}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    data.forEach((obj) => {
      expect(obj).toHaveProperty("id");
      expect(obj.userId).toEqual(defaultUserId);
      expect(obj).toHaveProperty("isNotified");
      expect(obj).toHaveProperty("createdAt");
      expect(obj).toHaveProperty("Payment");
      expect(obj).toHaveProperty("Schedule");
      expect(obj).toHaveProperty("OrderedSeats");
    });
  });
});

describe('Get History Orders', () => {
  test('Success get history orders with status 200', async () => {
    let response;

    try {
      response =
        await request(app)
          .get('/api/order/history')
          .set('authorization', `Bearer ${defaultToken}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    data.forEach((obj) => {
      expect(obj).toHaveProperty("id");
      expect(obj.userId).toEqual(defaultUserId);
      expect(obj).toHaveProperty("isNotified");
      expect(obj).toHaveProperty("createdAt");
      expect(obj).toHaveProperty("Payment");
      expect(obj).toHaveProperty("Schedule");
      expect(obj).toHaveProperty("OrderedSeats");
    });
  });
});

describe('Get Order', () => {
  test('Success get paid order data with status 200', async () => {
    let response;

    try {
      const order = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          }
        ]
      });

      response =
        await request(app)
          .get(`/api/order/${order.id}`)
          .set('authorization', `Bearer ${defaultToken}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    expect(data).toHaveProperty("id");
    expect(data.userId).toEqual(defaultUserId);
    expect(data).toHaveProperty("isNotified");
    expect(data).toHaveProperty("createdAt");
    expect(data).toHaveProperty("Payment");
    expect(data).toHaveProperty("Schedule");
    expect(data).toHaveProperty("OrderedSeats");
    data.OrderedSeats.forEach((obj) => {
      expect(obj).toHaveProperty("secret");
    })
  });

  test('Success get unpaid order data with status 200', async () => {
    let response;

    try {
      const order = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: false,
            }
          }
        ]
      });

      response =
        await request(app)
          .get(`/api/order/${order.id}`)
          .set('authorization', `Bearer ${defaultToken}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    expect(data).toHaveProperty("id");
    expect(data.userId).toEqual(defaultUserId);
    expect(data).toHaveProperty("isNotified");
    expect(data).toHaveProperty("createdAt");
    expect(data).toHaveProperty("Payment");
    expect(data).toHaveProperty("Schedule");
    expect(data).toHaveProperty("OrderedSeats");
    data.OrderedSeats.forEach((obj) => {
      expect(obj).not.toHaveProperty("secret");
    })
  });

  test('Failed get order: Order not found with status 404', async () => {
    let response;
    const orderId = 1000;

    try {
      response =
        await request(app)
          .get(`/api/order/${orderId}`)
          .set('authorization', `Bearer ${defaultToken}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(404);
  })
});

describe('Pay Order', () => {
  test('Success pay order with status 200', async () => {
    let response;
    let order;

    try {
      const orderToBePaid = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: false,
            }
          }
        ],
        order: [
          ['id', 'ASC']
        ],
      });

      response =
        await request(app)
          .put(`/api/order/${orderToBePaid.id}`)
          .set('authorization', `Bearer ${defaultToken}`);

      order = await Order.findByPk(orderToBePaid.id, {
        include: [
          {
            model: Payment,
          }
        ],
      })

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(order.Payment.isPaid).toBe(true);
  });
});

describe('Cancel Order', () => {
  test('Success cancel order with status 200', async () => {
    // Cancel second created order
    let response;
    let order;

    try {
      const orderToBePaid = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: false,
            }
          }
        ],
        order: [
          ['id', 'ASC']
        ],
      });

      response =
        await request(app)
          .delete(`/api/order/${orderToBePaid.id}`)
          .set('authorization', `Bearer ${defaultToken}`);

      order = await Order.findByPk(orderToBePaid.id);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    expect(order).toBeNull();
  });

  test('Failed cancel order: Order not found with status 404', async () => {
    let response;
    const orderId = 1000;

    try {
      response =
        await request(app)
          .delete(`/api/order/${orderId}`)
          .set('authorization', `Bearer ${defaultToken}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(404);
  });

  test('Failed cancel order: Not authorized with status 400', async () => {
    let response;
    let order;
    const otherUserId = 4;

    try {
      const orderToBePaid = await Order.findOne({ 
        where: { userId: otherUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: false,
            }
          }
        ],
        order: [
          ['id', 'ASC']
        ],
      });

      response =
        await request(app)
          .delete(`/api/order/${orderToBePaid.id}`)
          .set('authorization', `Bearer ${defaultToken}`);

      order = await Order.findByPk(orderToBePaid.id);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    const { message } = response.body;
    const messageLowerCase = message.toLowerCase();
    expect(messageLowerCase).toContain('not');
    expect(messageLowerCase).toContain('authorized');

    expect(order).not.toBeNull();
  });

  test('Failed cancel order: Cannot cancel paid order with status 400', async () => {
    let response;
    let order;

    try {
      const orderToBePaid = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          }
        ],
        order: [
          ['id', 'ASC']
        ],
      });

      response =
        await request(app)
          .delete(`/api/order/${orderToBePaid.id}`)
          .set('authorization', `Bearer ${defaultToken}`);

      order = await Order.findByPk(orderToBePaid.id);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    const { message } = response.body;
    const messageLowerCase = message.toLowerCase();
    expect(messageLowerCase).toContain('cannot');
    expect(messageLowerCase).toContain('cancel');

    expect(order).not.toBeNull();
  });
});

describe('Validate Ticket On Departure', () => {
  test('Failed validate ticket: Validation error with status 400', async () => {
    let response;
    const departureStationId = 1; // Halim

    try {
      const paidOrder = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          }
        ]
      });

      const orderedSeat = await OrderedSeat.findOne({
        where: {
          orderId: paidOrder.id
        }
      });

      response = 
        await request(app)
          .post('/api/order/validateDepart')
          .set('authorization', `Bearer ${defaultToken}`)
          .send({
            departureStationId,
            orderedSeatId: orderedSeat.id,
          })

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    const { status } = response.body;
    const statusLowerCase = status.toLowerCase();
    expect(statusLowerCase).toContain('validation');
  })

  test('Failed validate ticket: Depart at wrong station with status 400', async () => {
    let response;
    const departureStationId = 3; // Padalarang

    try {
      const paidOrder = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          }
        ]
      });

      const orderedSeat = await OrderedSeat.findOne({
        where: {
          orderId: paidOrder.id
        }
      });

      response = 
        await request(app)
          .post('/api/order/validateDepart')
          .set('authorization', `Bearer ${defaultToken}`)
          .send({
            departureStationId,
            orderedSeatId: orderedSeat.id,
            secret: orderedSeat.secret
          })

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    const { message } = response.body;
    const messageLowerCase = message.toLowerCase();
    expect(messageLowerCase).toContain('wrong');
    expect(messageLowerCase).toContain('station');
  });

  test('Failed validate ticket: Need to wait one hour before departure with status 400', async () => {
    let response;
    const departureStationId = 1; // Halim

    try {
      const paidOrder = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          }
        ],
        order: [[
          "id", "ASC"
        ]]
      });

      const orderedSeat = await OrderedSeat.findOne({
        where: {
          orderId: paidOrder.id
        }
      });

      response = 
        await request(app)
          .post('/api/order/validateDepart')
          .set('authorization', `Bearer ${defaultToken}`)
          .send({
            departureStationId,
            orderedSeatId: orderedSeat.id,
            secret: orderedSeat.secret
          })

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    const { message } = response.body;
    const messageLowerCase = message.toLowerCase();
    expect(messageLowerCase).toContain('wait');
    expect(messageLowerCase).toContain('one');
    expect(messageLowerCase).toContain('hour');
    expect(messageLowerCase).toContain('before');
    expect(messageLowerCase).toContain('departure');
  })

  test('Failed validate ticket: Train has gone with status 400', async () => {
    let response;
    const departureStationId = 1; // Halim

    try {
      const paidOrder = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          },
          {
            model: Schedule,
            where: {
              departureTime: {[Op.lt]: new Date()}
            }
          }
        ]
      });

      const orderedSeat = await OrderedSeat.findOne({
        where: {
          orderId: paidOrder.id
        }
      });

      response = 
        await request(app)
          .post('/api/order/validateDepart')
          .set('authorization', `Bearer ${defaultToken}`)
          .send({
            departureStationId,
            orderedSeatId: orderedSeat.id,
            secret: orderedSeat.secret
          })

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    const { message } = response.body;
    const messageLowerCase = message.toLowerCase();
    expect(messageLowerCase).toContain('train');
    expect(messageLowerCase).toContain('gone');
  });
});

describe('Validate Ticket On Arrival', () => {
  test('Success validate ticket with status 200', async () => {
    let response;
    const arrivalStationId = 3; // Padalarang

    try {
      const paidOrder = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          },
          {
            model: Schedule,
            where: {
              arrivalTime: {[Op.lt]: new Date()}
            }
          }
        ]
      });

      const orderedSeat = await OrderedSeat.findOne({
        where: {
          orderId: paidOrder.id
        }
      });

      response = 
        await request(app)
          .post('/api/order/validateArrive')
          .set('authorization', `Bearer ${defaultToken}`)
          .send({
            arrivalStationId,
            orderedSeatId: orderedSeat.id,
            secret: orderedSeat.secret
          })

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('Order');
    expect(data.Order).toHaveProperty('Schedule');
    expect(data.Order.Schedule).toHaveProperty('departureStation');
    expect(data.Order.Schedule.departureStation).toHaveProperty('name');
    expect(data.Order.Schedule).toHaveProperty('arrivalStation');
    expect(data.Order.Schedule.arrivalStation).toHaveProperty('name');
  });

  test('Failed validation ticket: Validation Error with status 400', async () => {
    let response;
    const arrivalStationId = 3; // Padalarang

    try {
      const paidOrder = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          },
          {
            model: Schedule,
            where: {
              arrivalTime: {[Op.lt]: new Date()}
            }
          }
        ]
      });

      const orderedSeat = await OrderedSeat.findOne({
        where: {
          orderId: paidOrder.id
        }
      });

      response = 
        await request(app)
          .post('/api/order/validateArrive')
          .set('authorization', `Bearer ${defaultToken}`)
          .send({
            arrivalStationId,
            orderedSeatId: orderedSeat.id,
          })

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    const { status } = response.body;
    const statusLowerCase = status.toLowerCase();
    expect(statusLowerCase).toContain('validation');
  })

  test('Failed validation ticket: Arrive at wrong station with status 400', async () => {
    let response;
    const arrivalStationId = 1; // Halim

    try {
      const paidOrder = await Order.findOne({ 
        where: { userId: defaultUserId },
        include: [
          {
            model: Payment,
            where: {
              isPaid: true,
            }
          },
          {
            model: Schedule,
            where: {
              arrivalTime: {[Op.lt]: new Date()}
            }
          }
        ]
      });

      const orderedSeat = await OrderedSeat.findOne({
        where: {
          orderId: paidOrder.id
        }
      });

      response = 
        await request(app)
          .post('/api/order/validateArrive')
          .set('authorization', `Bearer ${defaultToken}`)
          .send({
            arrivalStationId,
            orderedSeatId: orderedSeat.id,
            secret: orderedSeat.secret
          })

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(400);
    const { message } = response.body;
    const messageLowerCase = message.toLowerCase();
    expect(messageLowerCase).toContain('wrong');
    expect(messageLowerCase).toContain('station');
  });
});
