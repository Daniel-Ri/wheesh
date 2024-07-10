const { Op } = require("sequelize");
const { Schedule, Train, Station, User, ScheduleDay, SchedulePrice,
        OrderedSeat, Order, Passenger, Payment, sequelize } = require("../models");
const { generateMailOptionsForRemindSchedule, transporter } = require("./handleMail");
const redisClient = require("./handleCache");

exports.deleteNotPaidOrderPassedDueTime = async () => {
  try {
    const payments = await Payment.findAll({
      where: {
        isPaid: false,
        duePayment: {[Op.lt]: new Date()}
      },
      include: [
        {
          model: Order,
        }
      ]
    });

    const orderIds = payments.map((payment) => payment.orderId);
    await Order.destroy({where: {id: orderIds}});

    const scheduleIds = payments.map((payment) => payment.Order.scheduleId);
    for (const scheduleId of scheduleIds) {
      await redisClient.del(`schedule:${scheduleId}`);
    }

    if (orderIds.length > 0) console.log(`Delete orders: ${orderIds}`);

  } catch (error) {
    console.error(error);
  }
}

exports.remindUserBeforeOneHourOfDeparture = async () => {
  try {
    const schedules = await Schedule.findAll({
      where: {
        [Op.and]: [
          {departureTime: {[Op.gt]: new Date()}},
          {departureTime: {[Op.lte]: new Date(new Date().getTime() + 60 * 60 * 1000)}},
        ]
      }
    });
    const scheduleIds = schedules.map((schedule) => schedule.id);

    const orders = await Order.findAll({
      where: {
        scheduleId: scheduleIds,
        isNotified: false,
      },
      include: [
        {
          model: Schedule,
          include: [
            {
              model: Station,
              as: 'departureStation'
            },
            {
              model: Station,
              as: 'arrivalStation'
            },
            {
              model: Train
            }
          ]
        },
        {
          model: Payment
        }
      ]
    });

    for (const order of orders) {
      // If the user haven't paid, then don't notify him / her
      if (!order.Payment.isPaid) continue;

      await sequelize.transaction(async (t) => {
        // const orderedSeats = await OrderedSeat.findAll({
        //   where: {
        //     orderId: order.id
        //   },
        //   transaction: t
        // });

        // for (const orderedSeat of orderedSeats) {
        //   if (orderedSeat.email) {
        //     // Send email
        //   }
        // }

        const user = await User.findByPk(order.userId, {
          include: [
            {
              model: Passenger,
              where: {
                isUser: true,
              }
            }
          ],
          transaction: t
        });

        const mailOptions = generateMailOptionsForRemindSchedule(user, order);
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            throw error;
          }
          console.log('Email sent: ' + info.response);
        });

        order.isNotified = true;
        await order.save({transaction: t});
      });
    }

  } catch (error) {
    console.error(error);
  }
}

exports.addDailyData = async () => {
  const today = new Date();
  const sevenDaysAfter = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const tempDate = new Date(sevenDaysAfter);

  // Add schedule Data
  const newSchedules = [];
  const scheduleDays = await ScheduleDay.findAll();

  for (let i = 0; i < scheduleDays.length; i++) {
    const departureTime = new Date(
      tempDate.setHours(
        scheduleDays[i].departureTime.slice(0, 2), scheduleDays[i].departureTime.slice(3, 5)
      )
    );
    const arrivalTime = new Date(
      tempDate.setHours(
        scheduleDays[i].arrivalTime.slice(0, 2), scheduleDays[i].arrivalTime.slice(3, 5)
      )
    );

    newSchedules.push({
      trainId: i + 1,
      departureStationId: scheduleDays[i].departureStationId,
      arrivalStationId: scheduleDays[i].arrivalStationId,
      departureTime,
      arrivalTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await Schedule.bulkCreate(newSchedules);

  // Add schedule prices data
  let startLimit = new Date(sevenDaysAfter.setHours(0, 0, 0));
  let endLimit = new Date(sevenDaysAfter.setHours(23, 59, 59));
  let schedules = await Schedule.findAll({
    where: {
      [Op.and]: [
        {departureTime: {[Op.gte]: startLimit}},
        {departureTime: {[Op.lte]: endLimit}}
      ],
    }
  });

  const newSchedulePrices = [];
  const economyPrice = (date) => {
    const day = date.getDay();
    if (day === 0 || day === 6) { // Sunday or Saturday
      return 250000;
    }

    return 200000;
  }
  const businessPrice = 450000;
  const firstPrice = 600000;

  for (const schedule of schedules) {
    for (const seatClass of ['economy', 'business', 'first']) {
      const item = {
        scheduleId: schedule.id,
        seatClass,
        price: 
          seatClass === 'first' ? 
            firstPrice : seatClass === 'business' ? 
              businessPrice : economyPrice(schedule.departureTime),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      newSchedulePrices.push(item);
    }
  }  

  await SchedulePrice.bulkCreate(newSchedulePrices);

  // Add order
  // startLimit = new Date(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).setHours(0, 0, 0));
  // endLimit = new Date(startLimit).setHours(23, 59, 59);
  // schedules = await Schedule.findAll({
  //   where: {
  //     [Op.and]: [
  //       {departureTime: {[Op.gte]: startLimit}},
  //       {departureTime: {[Op.lte]: endLimit}}
  //     ],
  //   },
  //   limit: 2,
  // });

  // const newOrders = [];
  // for (const schedule of schedules) {
  //   const item = {
  //     userId: 2,
  //     scheduleId: schedule.id,
  //     isNotified: false,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   }
  //   newOrders.push(item);
  // }

  // await Order.bulkCreate(newOrders);

  // Add orderedSeat

  // Add payment
}