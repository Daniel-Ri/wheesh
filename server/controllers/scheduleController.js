const Joi = require("joi");
const { Op } = require("sequelize");

const { Schedule, 
        SchedulePrice, 
        Station, 
        Train, 
        Carriage, 
        Seat, 
        OrderedSeat, 
        Order, 
        sequelize } = require("../models");
const { handleServerError, handleClientError } = require("../utils/handleError");

exports.getLatestDateSchedule = async(req, res) => {
  try {
    const latestSchedule = await Schedule.findOne({
      order: [['departureTime', 'DESC']]
    });

    const latestDateSchedule = latestSchedule.departureTime;

    return res.status(200).json({data: latestDateSchedule, status: 'Success'});
  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}

const findStationById = async (res, stationId, errorMessage) => {
  const foundStation = await Station.findByPk(stationId);
  if (!foundStation) {
    handleClientError(res, 400, errorMessage);
  }
  return foundStation;
}

const countSeats = async (carriages, seatClass) => {
  return carriages.reduce((accumulator, carriage) =>
    accumulator + carriage.Seats.reduce((subAccumulator, seat) =>
      seat.seatClass === seatClass ? ++subAccumulator : subAccumulator, 0), 0);
}

const countBookedSeats = async (carriages, seatClass, orderIds) => {
  return carriages.reduce((accumulator, carriage) =>
    accumulator + carriage.Seats.reduce((subAccumulator, seat) =>
      seat.seatClass === seatClass && seat.OrderedSeats.some((orderedSeat) =>
        orderIds.includes(orderedSeat.orderId)) ? ++subAccumulator : subAccumulator, 0), 0);
}

exports.getSchedules = async(req, res) => {
  try {
    const { departureStationId, arrivalStationId, date } = req.params;
    let startLimit, endLimit;
    if (new Date(date).toDateString() === new Date().toDateString()) {
      startLimit = new Date(new Date().getTime() + 30 * 60 * 1000);
      endLimit = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000);
    } else {
      startLimit = new Date(new Date(date).setHours(0, 0, 0, 0));
      endLimit = new Date(startLimit.getTime() + 24 * 60 * 60 * 1000);
    }

    const foundDepartureStation = await findStationById(res, departureStationId, 'Departure Station Not Found');
    const foundArrivalStation = await findStationById(res, arrivalStationId, 'Arrival Station Not Found');

    const schedules = await Schedule.findAll({
      where: {
        departureStationId,
        arrivalStationId,
        [Op.and]: [
          {departureTime: {[Op.gte]: startLimit}},
          {departureTime: {[Op.lt]: endLimit}}
        ],
      },
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
        {
          model: Station,
          as: 'departureStation',
          attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
        },
        {
          model: Station,
          as: 'arrivalStation',
          attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
        },
        {
          model: SchedulePrice,
          as: 'prices',
          attributes: { exclude: [ 'createdAt', 'updatedAt' ] }
        },
      ]
    });

    const formattedSchedules = await Promise.all(
      schedules.map(async(schedule) => {
        const orderIds = schedule.Orders.map((order) => order.id);
        const countSeatsByClass = async (seatClass) => countSeats(schedule.Train.Carriages, seatClass);
        const countBookedSeatsByClass = async (seatClass) => 
          countBookedSeats(schedule.Train.Carriages, seatClass, orderIds);

        const [firstSeatNumbers, bookedFirstSeatNumbers] = await Promise.all([
          countSeatsByClass('first'),
          countBookedSeatsByClass('first'),
        ]);

        const [businessSeatNumbers, bookedBusinessSeatNumbers] = await Promise.all([
          countSeatsByClass('business'),
          countBookedSeatsByClass('business'),
        ]);

        const [economySeatNumbers, bookedEconomySeatNumbers] = await Promise.all([
          countSeatsByClass('economy'),
          countBookedSeatsByClass('economy'),
        ]);

        const isSeatAvailable = (booked, total) => 
          (booked === total) ? 'None' : (booked / total > 0.75) ? 'Few' : 'Available';

        return {
          id: schedule.id,
          Train: { id: schedule.Train.id, name: schedule.Train.name },
          departureStation: { id: schedule.departureStation.id, name: schedule.departureStation.name },
          arrivalStation: { id: schedule.arrivalStation.id, name: schedule.arrivalStation.name },
          departureTime: schedule.departureTime,
          arrivalTime: schedule.arrivalTime,
          firstSeatAvailable: isSeatAvailable(bookedFirstSeatNumbers, firstSeatNumbers),
          businessSeatAvailable: isSeatAvailable(bookedBusinessSeatNumbers, businessSeatNumbers),
          economySeatAvailable: isSeatAvailable(bookedEconomySeatNumbers, economySeatNumbers),
          prices: schedule.prices,
        };
      })
    );

    return res.status(200).json({data: formattedSchedules, status: 'Success'});

  } catch (error) {
    console.error(error);
    handleServerError(res);
  }
}