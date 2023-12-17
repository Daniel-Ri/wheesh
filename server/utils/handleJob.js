const { Op } = require("sequelize");
const { Schedule, Train, Station, User,
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