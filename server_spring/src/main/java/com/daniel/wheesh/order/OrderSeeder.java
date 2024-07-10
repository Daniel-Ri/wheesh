package com.daniel.wheesh.order;

import com.daniel.wheesh.schedule.Schedule;
import com.daniel.wheesh.schedule.ScheduleRepository;
import com.daniel.wheesh.user.User;
import com.daniel.wheesh.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderSeeder {
    private static final Logger logger = LoggerFactory.getLogger(OrderSeeder.class);

    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final OrderRepository orderRepository;

    public void seed() throws Exception {
        if (orderRepository.count() == 0) {
            logger.info("No orders found in the database. Seeding initial data.");

            ZoneId jakartaZoneId = ZoneId.of("Asia/Jakarta");
            LocalDate today = LocalDate.now(jakartaZoneId);
            LocalDate tomorrow = today.plusDays(1);
            LocalDateTime startOfTomorrow = tomorrow.atStartOfDay();
            ZonedDateTime startOfTomorrowInJakarta = startOfTomorrow.atZone(jakartaZoneId);
            LocalDateTime startOfTomorrowInJakartaLocal = startOfTomorrowInJakarta.toLocalDateTime();

            List<Schedule> afterTodaySchedules =
                scheduleRepository.findByDepartureTimeAfterOrderById(startOfTomorrowInJakartaLocal);
            User user2 = userRepository.findById(2L).orElseThrow(() -> new Exception("Something wrong happen"));
            User user3 = userRepository.findById(3L).orElseThrow(() -> new Exception("Something wrong happen"));
            Schedule schedule1 = scheduleRepository.findById(1L).orElseThrow(() -> new Exception("Something wrong " +
                "happen"));
            Schedule schedule2 = scheduleRepository.findById(2L).orElseThrow(() -> new Exception("Something wrong " +
                "happen"));

            Order[] orders = new Order[]{
                Order.builder()
                    .user(user2)
                    .schedule(afterTodaySchedules.get(0))
                    .isNotified(false)
                    .build(),
                Order.builder()
                    .user(user3)
                    .schedule(afterTodaySchedules.get(0))
                    .isNotified(false)
                    .build(),
                Order.builder()
                    .user(user2)
                    .schedule(afterTodaySchedules.get(1))
                    .isNotified(false)
                    .build(),
                Order.builder()
                    .user(user3)
                    .schedule(afterTodaySchedules.get(2))
                    .isNotified(false)
                    .build(),
                Order.builder()
                    .user(user2)
                    .schedule(afterTodaySchedules.get(3))
                    .isNotified(false)
                    .build(),
                Order.builder()
                    .user(user2)
                    .schedule(afterTodaySchedules.get(4))
                    .isNotified(false)
                    .build(),
                Order.builder()
                    .user(user2)
                    .schedule(afterTodaySchedules.get(5))
                    .isNotified(false)
                    .build(),
                Order.builder()
                    .user(user3)
                    .schedule(afterTodaySchedules.get(6))
                    .isNotified(false)
                    .build(),
                Order.builder()
                    .user(user2)
                    .schedule(afterTodaySchedules.get(7))
                    .isNotified(false)
                    .build(),
                Order.builder()
                    .user(user2)
                    .schedule(schedule1)
                    .isNotified(true)
                    .build(),
                Order.builder()
                    .user(user2)
                    .schedule(schedule2)
                    .isNotified(true)
                    .build(),
            };
            orderRepository.saveAll(Arrays.asList(orders));

            logger.info("Seeded initial orders data");
        } else {
            logger.info("Orders already exist in the database. No seeding needed.");
        }
    }

    public void unseed() {
        logger.info("Deleting all orders data.");
        orderRepository.deleteAll();
        logger.info("All orders data deleted.");
    }
}
