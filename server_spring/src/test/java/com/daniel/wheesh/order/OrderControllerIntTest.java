package com.daniel.wheesh.order;

import com.daniel.wheesh.orderedseat.OrderedSeat;
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
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class OrderControllerIntTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

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
    void shouldSuccessGetPaidOrders() throws Exception {
        String responseJson = mvc.perform(
                get("/api/order/paid").header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk()).andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data[0].id").isNumber())
            .andExpect(jsonPath("$.data[0].isNotified").isBoolean())
            .andExpect(jsonPath("$.data[0].createdAt").isString())
            .andExpect(jsonPath("$.data[0].Payment").exists())
            .andExpect(jsonPath("$.data[0].Payment.id").isNumber())
            .andExpect(jsonPath("$.data[0].Payment.amount").isNumber())
            .andExpect(jsonPath("$.data[0].Payment.isPaid").isBoolean())
            .andExpect(jsonPath("$.data[0].Payment.duePayment").isString())
            .andExpect(jsonPath("$.data[0].Schedule").exists())
            .andExpect(jsonPath("$.data[0].Schedule.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.departureTime").isString())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalTime").isString())
            .andExpect(jsonPath("$.data[0].Schedule.departureStation").exists())
            .andExpect(jsonPath("$.data[0].Schedule.departureStation.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.departureStation.name").isString())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalStation").exists())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalStation.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalStation.name").isString())
            .andExpect(jsonPath("$.data[0].Schedule.Train").exists())
            .andExpect(jsonPath("$.data[0].Schedule.Train.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.Train.name").isString())
            .andExpect(jsonPath("$.data[0].OrderedSeats").exists())
            .andExpect(jsonPath("$.data[0].OrderedSeats[0].name").isString())
            .andReturn().getResponse().getContentAsString();

        OrdersResponse ordersResponse = objectMapper.readValue(responseJson, OrdersResponse.class);
        LocalDateTime sixHoursAgo = LocalDateTime.now().minusHours(6);

        assertTrue(ordersResponse.getOrders().stream().allMatch(
            responseDataOrder -> responseDataOrder.getSchedule().getArrivalTime().isAfter(sixHoursAgo) &&
                responseDataOrder.getPayment().getIsPaid()));
        assertTrue(ordersResponse.getOrders().getFirst().getId() > ordersResponse.getOrders().getLast().getId());
    }

    @Test
    void shouldSuccessGetHistoryOrders() throws Exception {
        String responseJson = mvc.perform(
                get("/api/order/history")
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data[0].id").isNumber())
            .andExpect(jsonPath("$.data[0].isNotified").isBoolean())
            .andExpect(jsonPath("$.data[0].createdAt").isString())
            .andExpect(jsonPath("$.data[0].Payment").exists())
            .andExpect(jsonPath("$.data[0].Payment.id").isNumber())
            .andExpect(jsonPath("$.data[0].Payment.amount").isNumber())
            .andExpect(jsonPath("$.data[0].Payment.isPaid").isBoolean())
            .andExpect(jsonPath("$.data[0].Payment.duePayment").isString())
            .andExpect(jsonPath("$.data[0].Schedule").exists())
            .andExpect(jsonPath("$.data[0].Schedule.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.departureTime").isString())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalTime").isString())
            .andExpect(jsonPath("$.data[0].Schedule.departureStation").exists())
            .andExpect(jsonPath("$.data[0].Schedule.departureStation.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.departureStation.name").isString())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalStation").exists())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalStation.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalStation.name").isString())
            .andExpect(jsonPath("$.data[0].Schedule.Train").exists())
            .andExpect(jsonPath("$.data[0].Schedule.Train.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.Train.name").isString())
            .andExpect(jsonPath("$.data[0].OrderedSeats").exists())
            .andExpect(jsonPath("$.data[0].OrderedSeats[0].name").isString())
            .andReturn().getResponse().getContentAsString();

        OrdersResponse ordersResponse = objectMapper.readValue(responseJson, OrdersResponse.class);
        LocalDateTime sixHoursAgo = LocalDateTime.now().minusHours(6);

        assertTrue(ordersResponse.getOrders().stream().allMatch(
            responseDataOrder -> responseDataOrder.getSchedule().getArrivalTime().isBefore(sixHoursAgo) &&
                responseDataOrder.getPayment().getIsPaid()));
        assertTrue(ordersResponse.getOrders().getFirst().getId() > ordersResponse.getOrders().getLast().getId());
    }

    @Transactional
    @DirtiesContext
    @Test
    void shouldSuccessCreateOrderAndFailedCreateOrderWhenSeatIsBooked() throws Exception {
        ZonedDateTime tomorrowZoned =
            ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);
        LocalDateTime tomorrowLocal = tomorrowZoned.toLocalDateTime();

        List<Schedule> tomorrowSchedules = scheduleRepository.findByDepartureTimeAfter(tomorrowLocal);
        Schedule tomorrowSecondSchedule = tomorrowSchedules.get(1);

        List<Seat> seats = tomorrowSecondSchedule.getTrain().getCarriages().getFirst().getSeats().stream()
            .filter(seat -> seat.getSeatClass() == SeatClass.business).toList();

        // Passenger Ids is manually hard coded. They are John Doe's passengers
        ResultActions resultActions = callCreateOrderRequest(
            mvc,
            tomorrowSecondSchedule.getId(),
            seats.get(0),
            seats.get(1),
            2,
            3,
            johnDoeToken
        );
        String responseJson = resultActions
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data").isNumber())
            .andExpect(jsonPath("$.message").value("Successfully booked seats"))
            .andReturn().getResponse()
            .getContentAsString();

        CreateOrderResponse createOrderResponse = objectMapper.readValue(responseJson, CreateOrderResponse.class);

        Order order = orderRepository.findById(createOrderResponse.getId()).orElseThrow();
        assertNotNull(order.getPayment());
        assertNotNull(order.getOrderedSeats());

        // Passenger Ids is manually hard coded. They are Agus' passengers
        failedCreateOrderWhenSeatIsBooked(tomorrowSecondSchedule, seats.get(1), seats.get(2), 5, 6);
    }

    public static ResultActions callCreateOrderRequest(MockMvc mvc, Long scheduleId, Seat firstSeat, Seat secondSeat, long firstPassengerId,
                                                       long secondPassengerId, String userToken) throws Exception {

        return mvc.perform(
            post("/api/order").header("Authorization", "Bearer " + userToken).with(csrf())
                .contentType("application/json").content("""
                    {
                        "scheduleId": %d,
                        "orderedSeats": [
                            {
                                "seatId": %d,
                                "passengerId": %d
                            },
                            {
                                "seatId": %d,
                                "passengerId": %d
                            }
                        ]
                    }
                    """.formatted(scheduleId, firstSeat.getId(), firstPassengerId, secondSeat.getId(),
                    secondPassengerId)));
    }

    void failedCreateOrderWhenSeatIsBooked(Schedule schedule, Seat firstSeat, Seat secondSeat, long firstPassengerId,
                                           long secondPassengerId) throws Exception {

        mvc.perform(post("/api/order").header("Authorization", "Bearer " + agusToken).with(csrf())
                .contentType("application/json").content("""
                    {
                        "scheduleId": %d,
                        "orderedSeats": [
                            {
                                "seatId": %d,
                                "passengerId": %d
                            },
                            {
                                "seatId": %d,
                                "passengerId": %d
                            }
                        ]
                    }
                    """.formatted(schedule.getId(), firstSeat.getId(), firstPassengerId, secondSeat.getId(),
                    secondPassengerId)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value(
                "You cannot book booked seat %02d-%s".formatted(firstSeat.getCarriage().getCarriageNumber(),
                    firstSeat.getSeatNumber())));
    }

    @Test
    @DirtiesContext
    @Transactional
    void shouldSuccessGetUnpaidOrders() throws Exception {
        ZonedDateTime tomorrowZoned =
            ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);
        LocalDateTime tomorrowLocal = tomorrowZoned.toLocalDateTime();

        List<Schedule> tomorrowSchedules = scheduleRepository.findByDepartureTimeAfter(tomorrowLocal);
        Schedule tomorrowSecondSchedule = tomorrowSchedules.get(1);

        List<Seat> seats = tomorrowSecondSchedule.getTrain().getCarriages().getFirst().getSeats().stream()
            .filter(seat -> seat.getSeatClass() == SeatClass.business).toList();

        callCreateOrderRequest(
            mvc,
            tomorrowSecondSchedule.getId(),
            seats.get(0),
            seats.get(1),
            2,
            3,
            johnDoeToken
        );

        mvc.perform(get("/api/order/unpaid")
                .header("Authorization", "Bearer " + johnDoeToken))
            .andExpect(status().isOk()).andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data[0].id").isNumber()).andExpect(jsonPath("$.data[0].isNotified").value(false))
            .andExpect(jsonPath("$.data[0].createdAt").isString()).andExpect(jsonPath("$.data[0].Payment").exists())
            .andExpect(jsonPath("$.data[0].Payment.id").isNumber())
            .andExpect(jsonPath("$.data[0].Payment.amount").isNumber())
            .andExpect(jsonPath("$.data[0].Payment.isPaid").value(false))
            .andExpect(jsonPath("$.data[0].Payment.duePayment").isString())
            .andExpect(jsonPath("$.data[0].Schedule").exists()).andExpect(jsonPath("$.data[0].Schedule.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.departureTime").isString())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalTime").isString())
            .andExpect(jsonPath("$.data[0].Schedule.departureStation").exists())
            .andExpect(jsonPath("$.data[0].Schedule.departureStation.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.departureStation.name").isString())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalStation").exists())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalStation.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.arrivalStation.name").isString())
            .andExpect(jsonPath("$.data[0].Schedule.Train").exists())
            .andExpect(jsonPath("$.data[0].Schedule.Train.id").isNumber())
            .andExpect(jsonPath("$.data[0].Schedule.Train.name").isString())
            .andExpect(jsonPath("$.data[0].OrderedSeats").exists())
            .andExpect(jsonPath("$.data[0].OrderedSeats[0].name").isString())
            .andExpect(jsonPath("$.data[0].OrderedSeats[0].secret").doesNotExist());
    }

    @Transactional
    @Test
    void shouldSuccessGetOrderWhereOrderIsPaid() throws Exception {
        LocalDateTime sixHoursAgo = LocalDateTime.now(jakartaZone).minusHours(6);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, sixHoursAgo);
        Order order = orders.getFirst();

        mvc.perform(
                get("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(order.getId().intValue()))
            .andExpect(jsonPath("$.data.isNotified").isBoolean())
            .andExpect(jsonPath("$.data.createdAt").isString())
            .andExpect(jsonPath("$.data.Payment").exists())
            .andExpect(jsonPath("$.data.Payment.id").value(order.getPayment().getId()))
            .andExpect(jsonPath("$.data.Payment.amount").value(order.getPayment().getAmount()))
            .andExpect(jsonPath("$.data.Payment.isPaid").value(true))
            .andExpect(jsonPath("$.data.Payment.duePayment").isString())
            .andExpect(jsonPath("$.data.Schedule").exists())
            .andExpect(jsonPath("$.data.Schedule.id").value(order.getSchedule().getId().intValue()))
            .andExpect(jsonPath("$.data.Schedule.departureTime").isString())
            .andExpect(jsonPath("$.data.Schedule.arrivalTime").isString())
            .andExpect(jsonPath("$.data.Schedule.departureStation").exists())
            .andExpect(jsonPath("$.data.Schedule.departureStation.id").value(
                order.getSchedule().getDepartureStation().getId().intValue())
            )
            .andExpect(jsonPath("$.data.Schedule.departureStation.name").value(
                order.getSchedule().getDepartureStation().getName()
            ))
            .andExpect(jsonPath("$.data.Schedule.arrivalStation").exists())
            .andExpect(jsonPath("$.data.Schedule.arrivalStation.id").value(
                order.getSchedule().getArrivalStation().getId().intValue()
            ))
            .andExpect(jsonPath("$.data.Schedule.arrivalStation.name").value(
                order.getSchedule().getArrivalStation().getName()
            ))
            .andExpect(jsonPath("$.data.Schedule.Train").exists())
            .andExpect(jsonPath("$.data.Schedule.Train.id").isNumber())
            .andExpect(jsonPath("$.data.Schedule.Train.name").isString())
            .andExpect(jsonPath("$.data.OrderedSeats").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].id").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].price").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].gender").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].dateOfBirth").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].idCard").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].name").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].email").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].secret").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.id").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.seatNumber").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.seatClass").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.Carriage").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.Carriage.id").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.Carriage.carriageNumber").isNumber());
    }

    @Transactional
    @Test
    void shouldSuccessGetOrderWhereOrderIsHistory() throws Exception {
        LocalDateTime sixHoursAgo = LocalDateTime.now(jakartaZone).minusHours(6);
        List<Order> orders = orderRepository.findHistoryOrdersByUserIdAndLocalDateTime(2L, sixHoursAgo);
        Order order = orders.getFirst();

        mvc.perform(
                get("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(order.getId().intValue()))
            .andExpect(jsonPath("$.data.isNotified").isBoolean())
            .andExpect(jsonPath("$.data.createdAt").isString())
            .andExpect(jsonPath("$.data.Payment").exists())
            .andExpect(jsonPath("$.data.Payment.id").value(order.getPayment().getId()))
            .andExpect(jsonPath("$.data.Payment.amount").value(order.getPayment().getAmount()))
            .andExpect(jsonPath("$.data.Payment.isPaid").value(true))
            .andExpect(jsonPath("$.data.Payment.duePayment").isString())
            .andExpect(jsonPath("$.data.Schedule").exists())
            .andExpect(jsonPath("$.data.Schedule.id").value(order.getSchedule().getId().intValue()))
            .andExpect(jsonPath("$.data.Schedule.departureTime").isString())
            .andExpect(jsonPath("$.data.Schedule.arrivalTime").isString())
            .andExpect(jsonPath("$.data.Schedule.departureStation").exists())
            .andExpect(jsonPath("$.data.Schedule.departureStation.id").value(
                order.getSchedule().getDepartureStation().getId().intValue())
            )
            .andExpect(jsonPath("$.data.Schedule.departureStation.name").value(
                order.getSchedule().getDepartureStation().getName()
            ))
            .andExpect(jsonPath("$.data.Schedule.arrivalStation").exists())
            .andExpect(jsonPath("$.data.Schedule.arrivalStation.id").value(
                order.getSchedule().getArrivalStation().getId().intValue()
            ))
            .andExpect(jsonPath("$.data.Schedule.arrivalStation.name").value(
                order.getSchedule().getArrivalStation().getName()
            ))
            .andExpect(jsonPath("$.data.Schedule.Train").exists())
            .andExpect(jsonPath("$.data.Schedule.Train.id").isNumber())
            .andExpect(jsonPath("$.data.Schedule.Train.name").isString())
            .andExpect(jsonPath("$.data.OrderedSeats").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].id").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].price").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].gender").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].dateOfBirth").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].idCard").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].name").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].email").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].secret").doesNotExist())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.id").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.seatNumber").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.seatClass").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.Carriage").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.Carriage.id").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.Carriage.carriageNumber").isNumber());
    }

    @Test
    @Transactional
    @DirtiesContext
    void shouldSuccessGetOrderWhenOrderIsUnpaid() throws Exception {
        ZonedDateTime tomorrowZoned =
            ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);
        LocalDateTime tomorrowLocal = tomorrowZoned.toLocalDateTime();

        List<Schedule> tomorrowSchedules = scheduleRepository.findByDepartureTimeAfter(tomorrowLocal);
        Schedule tomorrowSecondSchedule = tomorrowSchedules.get(1);

        List<Seat> seats = tomorrowSecondSchedule.getTrain().getCarriages().getFirst().getSeats().stream()
            .filter(seat -> seat.getSeatClass() == SeatClass.business).toList();

        callCreateOrderRequest(
            mvc,
            tomorrowSecondSchedule.getId(),
            seats.get(0),
            seats.get(1),
            2,
            3,
            johnDoeToken
        );

        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> unpaidOrders = orderRepository.findUnpaidOrdersByUserIdAndLocalDateTime(2L, now);
        Order order = unpaidOrders.getFirst();

        mvc.perform(
                get("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(order.getId().intValue()))
            .andExpect(jsonPath("$.data.isNotified").isBoolean())
            .andExpect(jsonPath("$.data.createdAt").isString())
            .andExpect(jsonPath("$.data.Payment").exists())
            .andExpect(jsonPath("$.data.Payment.id").value(order.getPayment().getId()))
            .andExpect(jsonPath("$.data.Payment.amount").value(order.getPayment().getAmount()))
            .andExpect(jsonPath("$.data.Payment.isPaid").value(false))
            .andExpect(jsonPath("$.data.Payment.duePayment").isString())
            .andExpect(jsonPath("$.data.Schedule").exists())
            .andExpect(jsonPath("$.data.Schedule.id").value(order.getSchedule().getId().intValue()))
            .andExpect(jsonPath("$.data.Schedule.departureTime").isString())
            .andExpect(jsonPath("$.data.Schedule.arrivalTime").isString())
            .andExpect(jsonPath("$.data.Schedule.departureStation").exists())
            .andExpect(jsonPath("$.data.Schedule.departureStation.id").value(
                order.getSchedule().getDepartureStation().getId().intValue())
            )
            .andExpect(jsonPath("$.data.Schedule.departureStation.name").value(
                order.getSchedule().getDepartureStation().getName()
            ))
            .andExpect(jsonPath("$.data.Schedule.arrivalStation").exists())
            .andExpect(jsonPath("$.data.Schedule.arrivalStation.id").value(
                order.getSchedule().getArrivalStation().getId().intValue()
            ))
            .andExpect(jsonPath("$.data.Schedule.arrivalStation.name").value(
                order.getSchedule().getArrivalStation().getName()
            ))
            .andExpect(jsonPath("$.data.Schedule.Train").exists())
            .andExpect(jsonPath("$.data.Schedule.Train.id").isNumber())
            .andExpect(jsonPath("$.data.Schedule.Train.name").isString())
            .andExpect(jsonPath("$.data.OrderedSeats").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].id").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].price").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].gender").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].dateOfBirth").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].idCard").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].name").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].email").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].secret").doesNotExist())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.id").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.seatNumber").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.seatClass").isString())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.Carriage").exists())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.Carriage.id").isNumber())
            .andExpect(jsonPath("$.data.OrderedSeats[0].Seat.Carriage.carriageNumber").isNumber());
    }

    @Test
    @DirtiesContext
    @Transactional
    void shouldSuccessPayOrder() throws Exception {
        ZonedDateTime tomorrowZoned =
            ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);
        LocalDateTime tomorrowLocal = tomorrowZoned.toLocalDateTime();

        List<Schedule> tomorrowSchedules = scheduleRepository.findByDepartureTimeAfter(tomorrowLocal);
        Schedule tomorrowSecondSchedule = tomorrowSchedules.get(1);

        List<Seat> seats = tomorrowSecondSchedule.getTrain().getCarriages().getFirst().getSeats().stream()
            .filter(seat -> seat.getSeatClass() == SeatClass.business).toList();

        callCreateOrderRequest(
            mvc,
            tomorrowSecondSchedule.getId(),
            seats.get(0),
            seats.get(1),
            2,
            3,
            johnDoeToken
        );

        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> unpaidOrders = orderRepository.findUnpaidOrdersByUserIdAndLocalDateTime(2L, now);
        Order order = unpaidOrders.getFirst();

        mvc.perform(
                put("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Successfully paid the order"));

        mvc.perform(
                get("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.Payment.isPaid").value(true))
            .andExpect(jsonPath("$.data.OrderedSeats[0].secret").isString());
    }

    @Test
    @DirtiesContext
    @Transactional
    void shouldSuccessCancelOrder() throws Exception {
        ZonedDateTime tomorrowZoned =
            ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);
        LocalDateTime tomorrowLocal = tomorrowZoned.toLocalDateTime();

        List<Schedule> tomorrowSchedules = scheduleRepository.findByDepartureTimeAfter(tomorrowLocal);
        Schedule tomorrowSecondSchedule = tomorrowSchedules.get(1);

        List<Seat> seats = tomorrowSecondSchedule.getTrain().getCarriages().getFirst().getSeats().stream()
            .filter(seat -> seat.getSeatClass() == SeatClass.business).toList();

        callCreateOrderRequest(
            mvc,
            tomorrowSecondSchedule.getId(),
            seats.get(0),
            seats.get(1),
            2,
            3,
            johnDoeToken
        );

        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> unpaidOrders = orderRepository.findUnpaidOrdersByUserIdAndLocalDateTime(2L, now);
        Order order = unpaidOrders.getFirst();

        mvc.perform(
                delete("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Successfully cancel the order"));

        mvc.perform(
                get("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isNotFound());
    }

    @Test
    @DirtiesContext
    @Transactional
    void shouldFailedCancelOrderWhenOrderIsNotFound() throws Exception {
        ZonedDateTime tomorrowZoned =
            ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);
        LocalDateTime tomorrowLocal = tomorrowZoned.toLocalDateTime();

        List<Schedule> tomorrowSchedules = scheduleRepository.findByDepartureTimeAfter(tomorrowLocal);
        Schedule tomorrowSecondSchedule = tomorrowSchedules.get(1);

        List<Seat> seats = tomorrowSecondSchedule.getTrain().getCarriages().getFirst().getSeats().stream()
            .filter(seat -> seat.getSeatClass() == SeatClass.business).toList();

        callCreateOrderRequest(
            mvc,
            tomorrowSecondSchedule.getId(),
            seats.get(0),
            seats.get(1),
            2,
            3,
            johnDoeToken
        );

        mvc.perform(
                delete("/api/order/1000")
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Order Not Found"));
    }

    @Test
    @DirtiesContext
    @Transactional
    void shouldFailedCancelOrderWhenUserIsNotAuthorized() throws Exception {
        ZonedDateTime tomorrowZoned =
            ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0).plusDays(1);
        LocalDateTime tomorrowLocal = tomorrowZoned.toLocalDateTime();

        List<Schedule> tomorrowSchedules = scheduleRepository.findByDepartureTimeAfter(tomorrowLocal);
        Schedule tomorrowSecondSchedule = tomorrowSchedules.get(1);

        List<Seat> seats = tomorrowSecondSchedule.getTrain().getCarriages().getFirst().getSeats().stream()
            .filter(seat -> seat.getSeatClass() == SeatClass.business).toList();

        callCreateOrderRequest(
            mvc,
            tomorrowSecondSchedule.getId(),
            seats.get(0),
            seats.get(1),
            2,
            3,
            johnDoeToken
        );

        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> unpaidOrders = orderRepository.findUnpaidOrdersByUserIdAndLocalDateTime(2L, now);
        Order order = unpaidOrders.getFirst();

        mvc.perform(
                delete("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + agusToken)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Not Authorized"));

        mvc.perform(
                get("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk());
    }

    @Test
    @Transactional
    void shouldFailedCancelOrderWhenOrderWasPaid() throws Exception {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> paidOrders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, now);
        Order order = paidOrders.getFirst();

        mvc.perform(
                delete("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Cannot cancel paid order"));

        mvc.perform(
                get("/api/order/%d".formatted(order.getId()))
                    .header("Authorization", "Bearer " + johnDoeToken)
            )
            .andExpect(status().isOk());
    }

    @Test
    @Transactional
    @DirtiesContext
    void shouldSuccessValidateDepartureTicket() throws Exception {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, now);

        Order order = orders.getFirst();

        // Update the schedule, so it will be success to validate ticket
        order.getSchedule().setDepartureTime(now.plusMinutes(30L));
        orderRepository.save(order);

        OrderedSeat orderedSeat = order.getOrderedSeats().getFirst();

        mvc.perform(
                post("/api/order/validateDepart")
                    .header("Authorization", "Bearer " + johnDoeToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                            {
                                "departureStationId": %d,
                                    "orderedSeatId": %d,
                                    "secret": "%s"
                            }
                            """.formatted(
                            order.getSchedule().getDepartureStation().getId(),
                            orderedSeat.getId(),
                            orderedSeat.getSecret()
                        )
                    )
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(orderedSeat.getId().intValue()))
            .andExpect(jsonPath("$.data.price").value(orderedSeat.getPrice().intValue()))
            .andExpect(jsonPath("$.data.gender").value(orderedSeat.getGender().toString()))
            .andExpect(jsonPath("$.data.dateOfBirth").isString())
            .andExpect(jsonPath("$.data.idCard").value(orderedSeat.getIdCard()))
            .andExpect(jsonPath("$.data.name").value(orderedSeat.getName()))
            .andExpect(jsonPath("$.data.email").exists())
            .andExpect(jsonPath("$.data.Order").exists())
            .andExpect(jsonPath("$.data.Order.id").value(order.getId().intValue()))
            .andExpect(jsonPath("$.data.Order.isNotified").isBoolean())
            .andExpect(jsonPath("$.data.Order.Schedule").exists())
            .andExpect(jsonPath("$.data.Order.Schedule.id").value(order.getSchedule().getId().intValue()))
            .andExpect(jsonPath("$.data.Order.Schedule.departureTime").isString())
            .andExpect(jsonPath("$.data.Order.Schedule.arrivalTime").isString())
            .andExpect(jsonPath("$.data.Order.Schedule.departureStation").exists())
            .andExpect(jsonPath("$.data.Order.Schedule.departureStation.id").value(
                order.getSchedule().getDepartureStation().getId().intValue()
            ))
            .andExpect(jsonPath("$.data.Order.Schedule.departureStation.name").value(
                order.getSchedule().getDepartureStation().getName()
            ))
            .andExpect(jsonPath("$.data.Order.Schedule.arrivalStation").exists())
            .andExpect(jsonPath("$.data.Order.Schedule.arrivalStation.id").value(
                order.getSchedule().getArrivalStation().getId().intValue()
            ))
            .andExpect(jsonPath("$.data.Order.Schedule.arrivalStation.name").value(
                order.getSchedule().getArrivalStation().getName()
            ));
    }

    @Test
    @Transactional
    @DirtiesContext
    void shouldFailedValidateDepartureTicketWhenSecretIsNotInBody() throws Exception {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, now);

        Order order = orders.getFirst();

        // Update the schedule, so it will be success to validate ticket
        order.getSchedule().setDepartureTime(now.plusMinutes(30L));
        orderRepository.save(order);

        OrderedSeat orderedSeat = order.getOrderedSeats().getFirst();
        mvc.perform(
                post("/api/order/validateDepart")
                    .header("Authorization", "Bearer " + johnDoeToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                            {
                                "departureStationId": %d,
                                    "orderedSeatId": %d
                            }
                            """.formatted(
                            order.getSchedule().getDepartureStation().getId(),
                            orderedSeat.getId()
                        )
                    )
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Secret should not be empty"));
    }

    @Test
    @Transactional
    @DirtiesContext
    void shouldFailedValidateDepartureTicketWhenDepartingAtWrongStation() throws Exception {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, now);

        Order order = orders.getFirst();

        // Update the schedule, so it will be success to validate ticket
        order.getSchedule().setDepartureTime(now.plusMinutes(30L));
        orderRepository.save(order);

        OrderedSeat orderedSeat = order.getOrderedSeats().getFirst();
        mvc.perform(
                post("/api/order/validateDepart")
                    .header("Authorization", "Bearer " + johnDoeToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                            {
                                "departureStationId": %d,
                                    "orderedSeatId": %d,
                                    "secret": "%s"
                            }
                            """.formatted(
                            order.getSchedule().getDepartureStation().getId() + 1,
                            orderedSeat.getId(),
                            orderedSeat.getSecret()
                        )
                    )
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("You depart at wrong station"));
    }

    @Test
    @Transactional
    @DirtiesContext
    void shouldFailedValidateDepartureTicketWhenCheckingIsTooEarly() throws Exception {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, now);

        Order order = orders.getFirst();

        // Update the schedule, so it will be success to validate ticket
        order.getSchedule().setDepartureTime(now.plusMinutes(70L));
        orderRepository.save(order);

        OrderedSeat orderedSeat = order.getOrderedSeats().getFirst();
        mvc.perform(
                post("/api/order/validateDepart")
                    .header("Authorization", "Bearer " + johnDoeToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                            {
                                "departureStationId": %d,
                                    "orderedSeatId": %d,
                                    "secret": "%s"
                            }
                            """.formatted(
                            order.getSchedule().getDepartureStation().getId(),
                            orderedSeat.getId(),
                            orderedSeat.getSecret()
                        )
                    )
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Need to wait until one hour before departure"));
    }

    @Test
    @Transactional
    @DirtiesContext
    void shouldFailedValidateDepartureTicketWhenTrainHasGone() throws Exception {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, now);

        Order order = orders.getFirst();

        // Update the schedule, so it will be success to validate ticket
        order.getSchedule().setDepartureTime(now.minusMinutes(10L));
        orderRepository.save(order);

        OrderedSeat orderedSeat = order.getOrderedSeats().getFirst();
        mvc.perform(
                post("/api/order/validateDepart")
                    .header("Authorization", "Bearer " + johnDoeToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                            {
                                "departureStationId": %d,
                                    "orderedSeatId": %d,
                                    "secret": "%s"
                            }
                            """.formatted(
                            order.getSchedule().getDepartureStation().getId(),
                            orderedSeat.getId(),
                            orderedSeat.getSecret()
                        )
                    )
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("The train has gone"));
    }

    @Test
    @Transactional
    void shouldSuccessValidateArrivalTicket() throws Exception {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, now);

        Order order = orders.getFirst();
        OrderedSeat orderedSeat = order.getOrderedSeats().getFirst();

        mvc.perform(
                post("/api/order/validateArrive")
                    .header("Authorization", "Bearer " + johnDoeToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                            {
                                "arrivalStationId": %d,
                                    "orderedSeatId": %d,
                                    "secret": "%s"
                            }
                            """.formatted(
                            order.getSchedule().getArrivalStation().getId(),
                            orderedSeat.getId(),
                            orderedSeat.getSecret()
                        )
                    )
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(orderedSeat.getId().intValue()))
            .andExpect(jsonPath("$.data.price").value(orderedSeat.getPrice().intValue()))
            .andExpect(jsonPath("$.data.gender").value(orderedSeat.getGender().toString()))
            .andExpect(jsonPath("$.data.dateOfBirth").isString())
            .andExpect(jsonPath("$.data.idCard").value(orderedSeat.getIdCard()))
            .andExpect(jsonPath("$.data.name").value(orderedSeat.getName()))
            .andExpect(jsonPath("$.data.email").exists())
            .andExpect(jsonPath("$.data.Order").exists())
            .andExpect(jsonPath("$.data.Order.id").value(order.getId().intValue()))
            .andExpect(jsonPath("$.data.Order.isNotified").isBoolean())
            .andExpect(jsonPath("$.data.Order.Schedule").exists())
            .andExpect(jsonPath("$.data.Order.Schedule.id").value(order.getSchedule().getId().intValue()))
            .andExpect(jsonPath("$.data.Order.Schedule.departureTime").isString())
            .andExpect(jsonPath("$.data.Order.Schedule.arrivalTime").isString())
            .andExpect(jsonPath("$.data.Order.Schedule.departureStation").exists())
            .andExpect(jsonPath("$.data.Order.Schedule.departureStation.id").value(
                order.getSchedule().getDepartureStation().getId().intValue()
            ))
            .andExpect(jsonPath("$.data.Order.Schedule.departureStation.name").value(
                order.getSchedule().getDepartureStation().getName()
            ))
            .andExpect(jsonPath("$.data.Order.Schedule.arrivalStation").exists())
            .andExpect(jsonPath("$.data.Order.Schedule.arrivalStation.id").value(
                order.getSchedule().getArrivalStation().getId().intValue()
            ))
            .andExpect(jsonPath("$.data.Order.Schedule.arrivalStation.name").value(
                order.getSchedule().getArrivalStation().getName()
            ));
    }

    @Test
    @Transactional
    void shouldFailedValidateArrivalTicketWhenSecretIsNotInBody() throws Exception {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, now);

        Order order = orders.getFirst();
        OrderedSeat orderedSeat = order.getOrderedSeats().getFirst();

        mvc.perform(
                post("/api/order/validateArrive")
                    .header("Authorization", "Bearer " + johnDoeToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                            {
                                "arrivalStationId": %d,
                                    "orderedSeatId": %d
                            }
                            """.formatted(
                            order.getSchedule().getArrivalStation().getId(),
                            orderedSeat.getId()
                        )
                    )
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Secret should not be empty"));
    }

    @Test
    @Transactional
    void shouldFailedValidateArrivalTicketWhenArriveAtWrongStation() throws Exception {
        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(2L, now);

        Order order = orders.getFirst();
        OrderedSeat orderedSeat = order.getOrderedSeats().getFirst();

        mvc.perform(
                post("/api/order/validateArrive")
                    .header("Authorization", "Bearer " + johnDoeToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                            {
                                "arrivalStationId": %d,
                                    "orderedSeatId": %d,
                                    "secret": "%s"
                            }
                            """.formatted(
                            order.getSchedule().getArrivalStation().getId() + 1,
                            orderedSeat.getId(),
                            orderedSeat.getSecret()
                        )
                    )
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("You arrive at wrong station"));
    }
}