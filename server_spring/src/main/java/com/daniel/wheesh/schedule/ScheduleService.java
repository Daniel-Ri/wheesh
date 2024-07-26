package com.daniel.wheesh.schedule;

import com.daniel.wheesh.carriage.Carriage;
import com.daniel.wheesh.carriage.ResponseDataCarriageWithSeats;
import com.daniel.wheesh.global.CustomException;
import com.daniel.wheesh.orderedseat.OrderedSeat;
import com.daniel.wheesh.scheduleprice.ResponseDataSchedulePrice;
import com.daniel.wheesh.seat.ResponseDataSeat;
import com.daniel.wheesh.station.ResponseDataStation;
import com.daniel.wheesh.station.Station;
import com.daniel.wheesh.station.StationRepository;
import com.daniel.wheesh.train.Train;
import com.daniel.wheesh.train.TrainDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
            scheduleRepository.findByDepartureStationIdAndArrivalStationIdAndDepartureTimeBetweenOrderByDepartureTime(
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
        Train train = schedule.getTrain();
        Map<BookingStatus, Map<SeatClass, Long>> totalBookingStatusSeats = countTotalAndBookedSeats(
            schedule.getOrderedSeats()
        );

        return ResponseDataSchedule.builder()
            .id(schedule.getId())
            .train(new TrainDTO(train.getId(), train.getName()))
            .departureStation(new ResponseDataStation(departureStation.getId(), departureStation.getName()))
            .arrivalStation(new ResponseDataStation(arrivalStation.getId(), arrivalStation.getName()))
            .departureTime(schedule.getDepartureTime())
            .arrivalTime(schedule.getArrivalTime())
            .firstSeatAvailable(isSeatAvailable(totalBookingStatusSeats, SeatClass.first))
            .businessSeatAvailable(isSeatAvailable(totalBookingStatusSeats, SeatClass.business))
            .economySeatAvailable(isSeatAvailable(totalBookingStatusSeats, SeatClass.economy))
            .prices(schedule.getSchedulePrices().stream()
                .map(price -> new ResponseDataSchedulePrice(price.getId(), price.getSeatClass(), price.getPrice()))
                .toList())
            .build();
    }

    @Transactional
    private Map<BookingStatus, Map<SeatClass, Long>> countTotalAndBookedSeats(List<OrderedSeat> orderedSeatList) {
        Map<SeatClass, Long> totalSeats = Stream.of(SeatClass.values())
            .collect(Collectors.toMap(Function.identity(), c -> 0L));
        Map<SeatClass, Long> bookedSeats = new HashMap<>(totalSeats);

        for (OrderedSeat orderedSeat : orderedSeatList) {
            SeatClass seatClass = orderedSeat.getSeat().getSeatClass();
            totalSeats.merge(seatClass, 1L, Long::sum);

            if (orderedSeat.getOrder() != null) {
                bookedSeats.merge(seatClass, 1L, Long::sum);
            }
        }

        return Map.of(
            BookingStatus.TOTAL, totalSeats,
            BookingStatus.BOOKED, bookedSeats
        );
    }

    private Availibility isSeatAvailable(Map<BookingStatus, Map<SeatClass, Long>> totalBookingStatusSeats,
                                         SeatClass seatClass) {
        long booked = totalBookingStatusSeats.get(BookingStatus.BOOKED).get(seatClass);
        long total = totalBookingStatusSeats.get(BookingStatus.TOTAL).get(seatClass);

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

        Train train = schedule.getTrain();

        Map<BookingStatus, Map<SeatClass, Long>> totalBookingStatusSeats =
            countTotalAndBookedSeats(
                schedule.getOrderedSeats()
            );

        List<ResponseDataCarriageWithSeats> responseDataCarriageWithSeatsList = train.getCarriages().stream()
            .map(carriage -> createResponseDataCarriage(carriage, schedule.getOrderedSeats()))
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
                    .firstSeatAvailable(isSeatAvailable(totalBookingStatusSeats, SeatClass.first))
                    .businessSeatAvailable(isSeatAvailable(totalBookingStatusSeats, SeatClass.business))
                    .economySeatAvailable(isSeatAvailable(totalBookingStatusSeats, SeatClass.economy))
                    .firstSeatRemainder(
                        totalBookingStatusSeats.get(BookingStatus.TOTAL).get(SeatClass.first) -
                            totalBookingStatusSeats.get(BookingStatus.BOOKED).get(SeatClass.first)
                    )
                    .businessSeatRemainder(
                        totalBookingStatusSeats.get(BookingStatus.TOTAL).get(SeatClass.business) -
                            totalBookingStatusSeats.get(BookingStatus.BOOKED).get(SeatClass.business)
                    )
                    .economySeatRemainder(
                        totalBookingStatusSeats.get(BookingStatus.TOTAL).get(SeatClass.economy) -
                            totalBookingStatusSeats.get(BookingStatus.BOOKED).get(SeatClass.economy)
                    )
                    .prices(schedule.getSchedulePrices().stream()
                        .map(price -> new ResponseDataSchedulePrice(price.getId(), price.getSeatClass(), price.getPrice()))
                        .toList())
                    .carriages(responseDataCarriageWithSeatsList)
                    .build()
            )
            .build();
    }

    private ResponseDataCarriageWithSeats createResponseDataCarriage(Carriage carriage, List<OrderedSeat> orderedSeats) {
        List<ResponseDataSeat> responseDataSeatList = orderedSeats.stream()
            .filter(orderedSeat -> Objects.equals(orderedSeat.getCarriage().getId(), carriage.getId()))
            .map(orderedSeat -> ResponseDataSeat.builder()
                .id(orderedSeat.getSeat().getId())
                .seatNumber(orderedSeat.getSeat().getSeatNumber())
                .seatClass(orderedSeat.getSeat().getSeatClass())
                .isBooked(orderedSeat.getOrder() != null)
                .build()
            )
            .toList();

        return new ResponseDataCarriageWithSeats(carriage.getId(), carriage.getCarriageNumber(), responseDataSeatList);
    }
}
