package com.daniel.wheesh.scheduler;

import com.daniel.wheesh.carriage.Carriage;
import com.daniel.wheesh.config.DataSeedingCompletedEvent;
import com.daniel.wheesh.config.EmailService;
import com.daniel.wheesh.order.Order;
import com.daniel.wheesh.order.OrderRepository;
import com.daniel.wheesh.orderedseat.OrderedSeat;
import com.daniel.wheesh.orderedseat.OrderedSeatRepository;
import com.daniel.wheesh.passenger.Passenger;
import com.daniel.wheesh.schedule.Schedule;
import com.daniel.wheesh.schedule.ScheduleRepository;
import com.daniel.wheesh.schedule.SeatClass;
import com.daniel.wheesh.scheduleday.ScheduleDay;
import com.daniel.wheesh.scheduleday.ScheduleDayRepository;
import com.daniel.wheesh.scheduleprice.SchedulePrice;
import com.daniel.wheesh.scheduleprice.SchedulePriceRepository;
import com.daniel.wheesh.scheduleprice.SchedulePriceSeeder;
import com.daniel.wheesh.seat.Seat;
import com.daniel.wheesh.train.Train;
import com.daniel.wheesh.train.TrainRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Component
public class ScheduledTasks {
    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    private static final int BATCH_SIZE = 100;

    private final OrderRepository orderRepository;

    private final OrderedSeatRepository orderedSeatRepository;

    private final ScheduleDayRepository scheduleDayRepository;

    private final TrainRepository trainRepository;

    private final ScheduleRepository scheduleRepository;

    private final SchedulePriceRepository schedulePriceRepository;

    private final EmailService emailService;

    private final ZoneId jakartaZone = ZoneId.of("Asia/Jakarta");

    private boolean tasksEnabled = false;

    @EventListener
    public void onApplicationEvent(DataSeedingCompletedEvent event) {
        tasksEnabled = true;
    }

    @Scheduled(cron = "0 * * * * *")
    public void everyMinute() {
        if (tasksEnabled) {
            logger.info("Job running every minute.");
            deleteUnpaidOrderPassedDueTime();
            remindUserBeforeOneHourOfDeparture();
        }
    }

    @Scheduled(cron = "1 0 0 * * *", zone = "Asia/Jakarta")
    public void everyMidnight() {
        if (tasksEnabled) {
            logger.info("Job running every midnight.");
            addDailyData();
        }
    }

    @Transactional
    public void deleteUnpaidOrderPassedDueTime() {
        List<Order> unpaidOrdersPassedDueTime = orderRepository.findAllUnpaidOrdersPassedDueTime(
            LocalDateTime.now(jakartaZone)
        );

        List<Long> orderIds = unpaidOrdersPassedDueTime.stream()
            .map(Order::getId)
            .toList();
        orderedSeatRepository.cancelBookSeatByManyOrderIds(orderIds);
        orderRepository.deleteAll(unpaidOrdersPassedDueTime);
    }

    @Transactional
    public void remindUserBeforeOneHourOfDeparture() {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        LocalDateTime oneHourAway = now.plusHours(1L);
        List<Order> orders = orderRepository.findAllNotNotifiedPaidOrdersBeforeOneHourAway(now, oneHourAway);

        orders.forEach(order -> {
            try {
                Passenger passenger = order.getUser().getPassengers().getFirst();
                Schedule schedule = order.getSchedule();

                emailService.sendEmailForRemindSchedule(
                    passenger.getGender(),
                    passenger.getName(),
                    passenger.getEmail(),
                    schedule.getDepartureStation().getName(),
                    schedule.getArrivalStation().getName(),
                    schedule.getDepartureTime(),
                    schedule.getArrivalTime()
                );
                order.setIsNotified(true);

                orderRepository.save(order);
            } catch (MessagingException e) {
                logger.warn("Failed to send email to userId: %d on scheduleId: %d".formatted(
                    order.getUser().getId(),
                    order.getSchedule().getId())
                );
            }
        });
    }

    @Transactional
    public void addDailyData() {
        LocalDateTime afterMidnightNow = LocalDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime afterMidnightSevenDaysAway = afterMidnightNow.plusDays(7L);

        List<ScheduleDay> scheduleDays = scheduleDayRepository.findAll();
        List<Train> trains = trainRepository.findAllByOrderById();

        List<Schedule> scheduleList = new ArrayList<>();
        for (int i = 0; i < scheduleDays.size(); i++) {
            Schedule schedule = Schedule.builder()
                .train(trains.get(i))
                .departureStation(scheduleDays.get(i).getDepartureStation())
                .arrivalStation(scheduleDays.get(i).getArrivalStation())
                .departureTime(
                    afterMidnightSevenDaysAway
                        .withHour(scheduleDays.get(i).getDepartureTime().toLocalTime().getHour())
                        .withMinute(scheduleDays.get(i).getDepartureTime().toLocalTime().getMinute())
                )
                .arrivalTime(
                    afterMidnightSevenDaysAway
                        .withHour(scheduleDays.get(i).getArrivalTime().toLocalTime().getHour())
                        .withMinute(scheduleDays.get(i).getArrivalTime().toLocalTime().getMinute())
                )
                .build();
            scheduleList.add(schedule);
        }

        scheduleRepository.saveAll(scheduleList);

        List<SchedulePrice> schedulePriceList = new ArrayList<>();
        List<OrderedSeat> orderedSeatList = new ArrayList<>();

        for (Schedule schedule: scheduleList) {
            for (SeatClass seatClass: SeatClass.values()) {
                SchedulePrice schedulePrice = SchedulePrice.builder()
                    .schedule(schedule)
                    .seatClass(seatClass)
                    .price(SchedulePriceSeeder.calculatePrice(seatClass, schedule.getDepartureTime()))
                    .build();
                schedulePriceList.add(schedulePrice);
            }

            for (Carriage carriage : schedule.getTrain().getCarriages()) {
                for (Seat seat : carriage.getSeats()) {
                    orderedSeatList.add(
                        OrderedSeat.builder()
                            .schedule(schedule)
                            .carriage(carriage)
                            .seat(seat)
                            .build()
                    );
                }
            }
        }

        schedulePriceRepository.saveAll(schedulePriceList);

        for (int i = 0; i < orderedSeatList.size(); i += BATCH_SIZE) {
            List<OrderedSeat> batchList = orderedSeatList.subList(i, Math.min(i + BATCH_SIZE, orderedSeatList.size()));
            orderedSeatRepository.saveAll(batchList);
        }
    }
}
