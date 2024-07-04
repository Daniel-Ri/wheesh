package com.daniel.wheesh.schedule;

import com.daniel.wheesh.carriage.Carriage;
import com.daniel.wheesh.carriage.ResponseDataCarriage;
import com.daniel.wheesh.global.CustomException;
import com.daniel.wheesh.order.Order;
import com.daniel.wheesh.scheduleprice.ResponseDataSchedulePrice;
import com.daniel.wheesh.seat.ResponseDataSeat;
import com.daniel.wheesh.seat.Seat;
import com.daniel.wheesh.station.ResponseDataStation;
import com.daniel.wheesh.station.Station;
import com.daniel.wheesh.station.StationRepository;
import com.daniel.wheesh.train.Train;
import com.daniel.wheesh.train.TrainDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final StationRepository stationRepository;
    private final ZoneId jakartaZone = ZoneId.of("Asia/Jakarta");

    public LatestDateResponse getLatestDate() {
        return LatestDateResponse.builder()
            .latestDate(scheduleRepository.findLatestSchedule()
                .map(Schedule::getDepartureTime)
                .orElseThrow(() -> new CustomException("There are any schedules", HttpStatus.BAD_REQUEST)))
            .build();
    }

    public SchedulesResponse getSchedules(Long departureStationId, Long arrivalStationId, LocalDate date) {
        LocalDateTime startLimit, endLimit;

        // Get the current date-time in Asia/Jakarta time zone
        ZonedDateTime todayJakarta = ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0);
        ZonedDateTime inputDateJakarta = date.atStartOfDay(jakartaZone);

        if (inputDateJakarta.isBefore(todayJakarta) && !inputDateJakarta.toLocalDate().equals(todayJakarta.toLocalDate())) {
            throw new CustomException("Cannot get schedules before today's date", HttpStatus.BAD_REQUEST);
        } else if (inputDateJakarta.toLocalDate().equals(todayJakarta.toLocalDate())) {
            startLimit = LocalDateTime.now().plusMinutes(30);
            endLimit = todayJakarta.plusDays(1).toLocalDateTime();
        } else {
            startLimit = inputDateJakarta.toLocalDateTime();
            endLimit = startLimit.plusDays(1);
        }

        Station departureStation = stationRepository.findById(departureStationId)
            .orElseThrow(() -> new CustomException("Departure Station Not Found", HttpStatus.NOT_FOUND));
        Station arrivalStation = stationRepository.findById(arrivalStationId)
            .orElseThrow(() -> new CustomException("Arrival Station Not Found", HttpStatus.NOT_FOUND));

        List<Schedule> schedules =
            scheduleRepository.findByDepartureStationIdAndArrivalStationIdAndDepartureTimeBetween(
                departureStationId, arrivalStationId, startLimit, endLimit);

        return SchedulesResponse.builder()
            .schedules(
                schedules.stream().map(schedule -> createResponseDataSchedule(schedule, departureStation,
                    arrivalStation)
                ).toList()
            )
            .build();
    }

    private ResponseDataSchedule createResponseDataSchedule(Schedule schedule, Station departureStation,
                                                            Station arrivalStation) {
        List<Order> orderList = schedule.getOrders();
        Train train = schedule.getTrain();

        Map<SeatClass, Long> totalSeats = countSeats(train.getCarriages());
        Map<SeatClass, Long> bookedSeats = countBookedSeats(train.getCarriages(), orderList);

        return ResponseDataSchedule.builder()
            .id(schedule.getId())
            .train(new TrainDTO(train.getId(), train.getName()))
            .departureStation(new ResponseDataStation(departureStation.getId(), departureStation.getName()))
            .arrivalStation(new ResponseDataStation(arrivalStation.getId(), arrivalStation.getName()))
            .departureTime(schedule.getDepartureTime())
            .arrivalTime(schedule.getArrivalTime())
            .firstSeatAvailable(isSeatAvailable(bookedSeats.getOrDefault(SeatClass.first, 0L),
                totalSeats.getOrDefault(SeatClass.first, 0L)))
            .businessSeatAvailable(isSeatAvailable(bookedSeats.getOrDefault(SeatClass.business, 0L),
                totalSeats.getOrDefault(SeatClass.business, 0L)))
            .economySeatAvailable(isSeatAvailable(bookedSeats.getOrDefault(SeatClass.economy, 0L),
                totalSeats.getOrDefault(SeatClass.economy, 0L)))
            .prices(schedule.getSchedulePrices().stream()
                .map(price -> new ResponseDataSchedulePrice(price.getId(), price.getSeatClass(), price.getPrice()))
                .toList())
            .build();
    }

    private Map<SeatClass, Long> countSeats(List<Carriage> carriages) {
        return carriages.stream()
            .flatMap(carriage -> carriage.getSeats().stream())
            .collect(Collectors.groupingBy(Seat::getSeatClass, Collectors.counting()));
    }

    private Map<SeatClass, Long> countBookedSeats(List<Carriage> carriages, List<Order> orderList) {
        return carriages.stream()
            .flatMap(carriage -> carriage.getSeats().stream())
            .filter(seat -> seat.getOrderedSeats().stream()
                .anyMatch(orderedSeat -> orderList.contains(orderedSeat.getOrder()))
            )
            .collect(Collectors.groupingBy(Seat::getSeatClass, Collectors.counting()));
    }

    private Availibility isSeatAvailable(long booked, long total) {
        if (booked == total) {
            return Availibility.None;
        } else if ((double) booked / total > 0.75) {
            return Availibility.Few;
        } else {
            return Availibility.Available;
        }
    }

    public OneScheduleResponse getOneSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(() -> new CustomException("Schedule " +
            "Not Found", HttpStatus.NOT_FOUND));
        if (schedule.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new CustomException("Cannot access previous schedule", HttpStatus.BAD_REQUEST);
        }

        List<Order> orderList = schedule.getOrders();
        Train train = schedule.getTrain();

        Map<SeatClass, Long> totalSeats = countSeats(train.getCarriages());
        Map<SeatClass, Long> bookedSeats = countBookedSeats(train.getCarriages(), orderList);

        List<ResponseDataCarriage> responseDataCarriageList = train.getCarriages().stream()
            .map(carriage -> createResponseDataCarriage(carriage, orderList))
            .toList();

        return OneScheduleResponse.builder()
            .schedule(
                ResponseDataScheduleWithMoreDetails.builder()
                    .id(schedule.getId())
                    .train(new TrainDTO(train.getId(), train.getName()))
                    .departureStation(new ResponseDataStation(schedule.getDepartureStation().getId(), schedule.getDepartureStation().getName()))
                    .arrivalStation(new ResponseDataStation(schedule.getArrivalStation().getId(), schedule.getArrivalStation().getName()))
                    .departureTime(schedule.getDepartureTime())
                    .arrivalTime(schedule.getArrivalTime())
                    .firstSeatAvailable(isSeatAvailable(bookedSeats.getOrDefault(SeatClass.first, 0L), totalSeats.getOrDefault(SeatClass.first, 0L)))
                    .businessSeatAvailable(isSeatAvailable(bookedSeats.getOrDefault(SeatClass.business, 0L), totalSeats.getOrDefault(SeatClass.business, 0L)))
                    .economySeatAvailable(isSeatAvailable(bookedSeats.getOrDefault(SeatClass.economy, 0L), totalSeats.getOrDefault(SeatClass.economy, 0L)))
                    .firstSeatRemainder(totalSeats.getOrDefault(SeatClass.first, 0L) - bookedSeats.getOrDefault(SeatClass.first, 0L))
                    .businessSeatRemainder(totalSeats.getOrDefault(SeatClass.business, 0L) - bookedSeats.getOrDefault(SeatClass.business, 0L))
                    .economySeatRemainder(totalSeats.getOrDefault(SeatClass.economy, 0L) - bookedSeats.getOrDefault(SeatClass.economy, 0L))
                    .prices(schedule.getSchedulePrices().stream()
                        .map(price -> new ResponseDataSchedulePrice(price.getId(), price.getSeatClass(), price.getPrice()))
                        .toList())
                    .carriages(responseDataCarriageList)
                    .build()
            )
            .build();
    }

    private ResponseDataCarriage createResponseDataCarriage(Carriage carriage, List<Order> orderList) {
        List<ResponseDataSeat> responseDataSeatList = carriage.getSeats().stream()
            .map(seat -> ResponseDataSeat.builder()
                .id(seat.getId())
                .seatNumber(seat.getSeatNumber())
                .seatClass(seat.getSeatClass())
                .isBooked(seat.getOrderedSeats().stream().anyMatch(orderedSeat -> orderList.contains(orderedSeat.getOrder())))
                .build())
            .toList();

        return new ResponseDataCarriage(carriage.getId(), carriage.getCarriageNumber(), responseDataSeatList);
    }
}
