package com.daniel.wheesh.scheduler;

import com.daniel.wheesh.TestEmailConfig;
import com.daniel.wheesh.config.EmailService;
import com.daniel.wheesh.order.Order;
import com.daniel.wheesh.order.OrderControllerIntTest;
import com.daniel.wheesh.order.OrderRepository;
import com.daniel.wheesh.schedule.Schedule;
import com.daniel.wheesh.schedule.ScheduleRepository;
import com.daniel.wheesh.schedule.SeatClass;
import com.daniel.wheesh.seat.Seat;
import com.daniel.wheesh.user.LoginResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@ContextConfiguration(classes = {TestEmailConfig.class})
@ActiveProfiles("test")
@AutoConfigureMockMvc
class ScheduledTasksTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ScheduledTasks scheduledTasks;

    @SpyBean
    private EmailService emailService;

    private final ZoneId jakartaZone = ZoneId.of("Asia/Jakarta");

    private static String johnDoeToken;

    private static String agusToken;

    @BeforeAll
    static void beforeAll(@Autowired MockMvc mvc, @Autowired ObjectMapper objectMapper) throws Exception {
        String responseJson =
            mvc.perform(post("/api/user/login").with(csrf()).contentType("application/json").content("""
                {
                    "usernameOrEmail": "johndoe",
                    "password": "123456"
                }
                """)).andReturn().getResponse().getContentAsString();

        LoginResponse userLoginResponse = objectMapper.readValue(responseJson, LoginResponse.class);
        johnDoeToken = userLoginResponse.getToken();

        responseJson = mvc.perform(post("/api/user/login").with(csrf()).contentType("application/json").content("""
            {
                "usernameOrEmail": "agus",
                "password": "123456"
            }
            """)).andReturn().getResponse().getContentAsString();

        userLoginResponse = objectMapper.readValue(responseJson, LoginResponse.class);
        agusToken = userLoginResponse.getToken();
    }

    @Test
    @Transactional
    @DirtiesContext
    void shouldSuccessDeleteUnpaidOrderPassedDueTime() throws Exception {
        createTwoOrders();

        LocalDateTime oneMinuteAgo = LocalDateTime.now(jakartaZone).minusMinutes(1L);
        List<Order> unpaidOrders = orderRepository.findAllUnpaidOrders();
        unpaidOrders.forEach(order -> order.getPayment().setDuePayment(oneMinuteAgo));
        orderRepository.saveAll(unpaidOrders);

        scheduledTasks.deleteUnpaidOrderPassedDueTime();
        assertTrue(orderRepository.findAllUnpaidOrders().isEmpty());
    }

    void createTwoOrders() throws Exception {
        ZonedDateTime tomorrowZoned =
            ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);
        LocalDateTime tomorrowLocal = tomorrowZoned.toLocalDateTime();

        List<Schedule> tomorrowSchedules = scheduleRepository.findByDepartureTimeAfterOrderById(tomorrowLocal);
        Schedule tomorrowSecondSchedule = tomorrowSchedules.get(1);

        List<Seat> businessSeats = tomorrowSecondSchedule.getTrain().getCarriages().getFirst().getSeats().stream()
            .filter(seat -> seat.getSeatClass() == SeatClass.business).toList();

        // Passenger Ids is manually hard coded. They are John Doe's passengers
        OrderControllerIntTest.callCreateOrderRequest(
            mvc,
            tomorrowSecondSchedule.getId(),
            businessSeats.get(0),
            businessSeats.get(1),
            2,
            3,
            johnDoeToken
        );

        List<Seat> economySeats = tomorrowSecondSchedule.getTrain().getCarriages().get(1).getSeats().stream()
            .filter(seat -> seat.getSeatClass() == SeatClass.economy).toList();

        OrderControllerIntTest.callCreateOrderRequest(
            mvc,
            tomorrowSecondSchedule.getId(),
            economySeats.get(0),
            economySeats.get(1),
            5,
            6,
            agusToken
        );
    }

    @Test
    @DirtiesContext
    @Transactional
    void shouldSuccessRemindUserBeforeOneHourOfDeparture() throws Exception {
        createTwoOrders();

        List<Order> unpaidOrders = orderRepository.findAllUnpaidOrders();
        unpaidOrders.forEach(order -> order.getPayment().setIsPaid(true));
        List<Order> justPaidOrders = orderRepository.saveAll(unpaidOrders);

        Schedule schedule = unpaidOrders.getFirst().getSchedule();

        LocalDateTime beforeOneHourAway = LocalDateTime.now(jakartaZone).plusHours(1L).minusSeconds(1L);
        schedule.setDepartureTime(beforeOneHourAway);
        scheduleRepository.save(schedule);

        scheduledTasks.remindUserBeforeOneHourOfDeparture();

        // The first will be invoked two times because the dummy has booked on the same schedule with johnDoe user
        verify(emailService, times(2))
            .sendEmailForRemindSchedule(
                justPaidOrders.getFirst().getUser().getPassengers().getFirst().getGender(),
                justPaidOrders.getFirst().getUser().getPassengers().getFirst().getName(),
                justPaidOrders.getFirst().getUser().getEmail(),
                justPaidOrders.getFirst().getSchedule().getDepartureStation().getName(),
                justPaidOrders.getFirst().getSchedule().getArrivalStation().getName(),
                justPaidOrders.getFirst().getSchedule().getDepartureTime(),
                justPaidOrders.getFirst().getSchedule().getArrivalTime()
            );
        verify(emailService)
            .sendEmailForRemindSchedule(
                justPaidOrders.get(1).getUser().getPassengers().getFirst().getGender(),
                justPaidOrders.get(1).getUser().getPassengers().getFirst().getName(),
                justPaidOrders.get(1).getUser().getEmail(),
                justPaidOrders.get(1).getSchedule().getDepartureStation().getName(),
                justPaidOrders.get(1).getSchedule().getArrivalStation().getName(),
                justPaidOrders.get(1).getSchedule().getDepartureTime(),
                justPaidOrders.get(1).getSchedule().getArrivalTime()
            );

        List<Order> shouldBeNotifiedOrders = orderRepository.findAllById(
            justPaidOrders.stream()
                .map(Order::getId)
                .toList()
        );
        assertTrue(shouldBeNotifiedOrders.getFirst().getIsNotified());
        assertTrue(shouldBeNotifiedOrders.get(1).getIsNotified());
    }

    @Test
    @Transactional
    @DirtiesContext
    void shouldSuccessAddDailyData() {
        LocalDateTime afterMidnightSevenDaysAway = LocalDateTime.now(jakartaZone).plusDays(7)
            .withHour(0).withMinute(0).withSecond(0).withNano(0);

        scheduleRepository.deleteAfterTimeLimit(afterMidnightSevenDaysAway);
        assertTrue(scheduleRepository.findAfterLocalDateTime(afterMidnightSevenDaysAway).isEmpty());

        scheduledTasks.addDailyData();
        assertFalse(scheduleRepository.findAfterLocalDateTime(afterMidnightSevenDaysAway).isEmpty());
    }
}