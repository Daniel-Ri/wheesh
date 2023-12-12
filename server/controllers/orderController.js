const Joi = require("joi");
const { Op } = require("sequelize");
const crypto = require('crypto');

const { Schedule, Train, Carriage, Seat, OrderedSeat, Order, Passenger, sequelize } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");

exports.createOrder = async (req, res) => {
  try {
    const { scheduleId, orderedSeats } = req.body;
    const scheme = Joi.object({
      scheduleId: Joi.number().integer().required(),
      orderedSeats: Joi.array().items(
        Joi.object(
          {
            seatId: Joi.number().integer().required(),
            passengerId: Joi.number().integer().required(),
          }
        )
      ).unique((a, b) => a.seatId === b.seatId).required(),
    });
    const { error } = scheme.validate(req.body);
    if (error) 
      return res.status(400).json({ status: 'Validation Failed', message: error.details[0].message })

    await sequelize.transaction(async (t) => {
      const foundSchedule = await Schedule.findByPk(
        scheduleId,
        {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
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
                      include: [
                        {
                          model: OrderedSeat,
                          attributes: { exclude: [ 'createdAt', 'updatedAt' ] },
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              model: Order,
            },
          ],
          transaction: t
        }
      );
      if (!foundSchedule)
        return handleClientError(res, 404, 'Schedule Not Found');

      const passengerIds = orderedSeats.map((orderedSeat) => orderedSeat.passengerId);
      const foundPassengers = await Passenger.findAll({
        where: {id: passengerIds, userId: req.user.id},
        transaction: t
      });

      if (foundPassengers.length !== passengerIds.length)
        return handleClientError(res, 400, 'You cannot not include other user\'s passengers');

      const seatIds = orderedSeats.map((orderedSeats) => orderedSeats.seatId);

      const foundScheduleJSON = foundSchedule.toJSON();
      const orderIds = foundScheduleJSON.Orders.map((order) => order.id);
      for (const carriage of foundScheduleJSON.Train.Carriages) {
        for (const seat of carriage.Seats) {
          if (seatIds.includes(seat.id)) {
            const isBooked = seat.OrderedSeats.some((orderedSeat) => orderIds.includes(orderedSeat.orderId));
            if (isBooked)
              return handleClientError(
                res, 
                409, 
                `You cannot book booked seat ${String(carriage.carriageNumber).padStart(2, '0')}-${seat.seatNumber}`
              )
          }
        }
      }
      
      const newOrder = await Order.create(
        {
          userId: req.user.id,
          scheduleId
        },
        { transaction: t }
      );

      for (let i = 0; i < orderedSeats.length; i++) {
        await OrderedSeat.create(
          {
            orderId: newOrder.id,
            seatId: seatIds[i],
            gender: foundPassengers[i].gender,
            dateOfBirth: foundPassengers[i].dateOfBirth,
            idCard: foundPassengers[i].idCard,
            name: foundPassengers[i].name,
            email: foundPassengers[i].email,
            secret: crypto.randomBytes(32).toString('hex'),
          },  
          { transaction: t }
        )
      }

      return res.status(201).json({ message: 'Successfully booked seats', status: 'success' });
    })

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}