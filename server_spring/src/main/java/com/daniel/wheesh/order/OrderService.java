package com.daniel.wheesh.order;

import com.daniel.wheesh.carriage.ResponseDataCarriage;
import com.daniel.wheesh.global.CustomException;
import com.daniel.wheesh.global.Utility;
import com.daniel.wheesh.orderedseat.*;
import com.daniel.wheesh.passenger.Passenger;
import com.daniel.wheesh.passenger.PassengerRepository;
import com.daniel.wheesh.payment.Payment;
import com.daniel.wheesh.payment.ResponseDataPayment;
import com.daniel.wheesh.schedule.*;
import com.daniel.wheesh.scheduleprice.SchedulePrice;
import com.daniel.wheesh.seat.ResponseDataSeatWithCarriage;
import com.daniel.wheesh.seat.Seat;
import com.daniel.wheesh.seat.SeatRepository;
import com.daniel.wheesh.station.ResponseDataStation;
import com.daniel.wheesh.station.Station;
import com.daniel.wheesh.station.StationRepository;
import com.daniel.wheesh.train.Train;
import com.daniel.wheesh.train.TrainDTO;
import com.daniel.wheesh.user.User;
import com.daniel.wheesh.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final ScheduleRepository scheduleRepository;
    private final PassengerRepository passengerRepository;
    private final SeatRepository seatRepository;
    private final OrderedSeatRepository orderedSeatRepository;
    private final StationRepository stationRepository;

    private final UserRepository userRepository;
    private final ZoneId jakartaZone = ZoneId.of("Asia/Jakarta");

    private User getCurrentUser() throws Exception {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        return userRepository.findByUsername(username).orElseThrow(
            () -> new Exception("User not found")
        );
    }

    public OrdersResponse getPaidOrders() throws Exception {
        User currentUser = getCurrentUser();

        LocalDateTime sixHoursAgo = LocalDateTime.now(jakartaZone).minusHours(6);
        List<Order> orders = orderRepository.findPaidOrdersByUserIdAndLocalDateTime(currentUser.getId(), sixHoursAgo);

        List<ResponseDataOrder> filteredOrders = orders.stream()
            .map(this::mapToResponseDataOrder)
            .toList();

        return OrdersResponse.builder()
            .orders(filteredOrders)
            .build();
    }

    private ResponseDataOrder mapToResponseDataOrder(Order order) {
        return ResponseDataOrder.builder()
            .id(order.getId())
            .userId(order.getUser().getId())
            .scheduleId(order.getSchedule().getId())
            .isNotified(order.getIsNotified())
            .createdAt(order.getCreatedAt())
            .payment(ResponseDataPayment.builder()
                .id(order.getPayment().getId())
                .amount(order.getPayment().getAmount())
                .isPaid(order.getPayment().getIsPaid())
                .duePayment(order.getPayment().getDuePayment())
                .build())
            .schedule(ResponseDataScheduleWithoutAvailability.builder()
                .id(order.getSchedule().getId())
                .departureTime(order.getSchedule().getDepartureTime())
                .arrivalTime(order.getSchedule().getArrivalTime())
                .departureStation(ResponseDataStation.builder()
                    .id(order.getSchedule().getDepartureStation().getId())
                    .name(order.getSchedule().getDepartureStation().getName())
                    .build())
                .arrivalStation(ResponseDataStation.builder()
                    .id(order.getSchedule().getArrivalStation().getId())
                    .name(order.getSchedule().getArrivalStation().getName())
                    .build())
                .train(TrainDTO.builder()
                    .id(order.getSchedule().getTrain().getId())
                    .name(order.getSchedule().getTrain().getName())
                    .build())
                .build())
            .orderedSeats(order.getOrderedSeats().stream()
                .map(orderedSeat -> ResponseDataOrderedSeatOnlyWithName.builder()
                    .name(orderedSeat.getName())
                    .build())
                .toList())
            .build();
    }

    public OrdersResponse getHistoryOrders() throws Exception {
        User currentUser = getCurrentUser();

        LocalDateTime sixHoursAgo = LocalDateTime.now(jakartaZone).minusHours(6);
        List<Order> orders = orderRepository.findHistoryOrdersByUserIdAndLocalDateTime(currentUser.getId(), sixHoursAgo);

        List<ResponseDataOrder> filteredOrders = orders.stream()
            .map(this::mapToResponseDataOrder)
            .toList();

        return OrdersResponse.builder()
            .orders(filteredOrders)
            .build();
    }

    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest request) throws Exception {
        User currentUser = getCurrentUser();

        Schedule schedule =
            scheduleRepository.findById(request.getScheduleId()).orElseThrow(() -> new CustomException("Schedule Not " +
                "Found", HttpStatus.BAD_REQUEST));

        if (schedule.getDepartureTime().isBefore(LocalDateTime.now(jakartaZone).minusMinutes(30))) {
            throw new CustomException("The train will depart soon", HttpStatus.FORBIDDEN);
        }

        List<Long> passengerIds = request.getOrderedSeats().stream()
            .map(CreateOrderedSeatRequest::getPassengerId)
            .toList();

        List<Passenger> passengers = passengerRepository.findByIdInAndUserId(passengerIds, currentUser.getId());
        if (passengers.size() != passengerIds.size()) {
            throw new CustomException("You cannot include other user's passengers", HttpStatus.BAD_REQUEST);
        }

        List<Long> seatIds = request.getOrderedSeats().stream()
            .map(CreateOrderedSeatRequest::getSeatId)
            .toList();

        // Lock ordered seats for the given seatIds and scheduleId using row-level locking
        logger.info("Locking seats {} for schedule {}", seatIds, request.getScheduleId());
        List<OrderedSeat> lockedOrderedSeats =
            orderedSeatRepository.findLockedOrderedSeatsBySeatIdsAndScheduleId(seatIds, request.getScheduleId());

        // Check if any of the seats are already booked
        for (OrderedSeat orderedSeat : lockedOrderedSeats) {
            if (orderedSeat.getOrder() != null) {
                throw new CustomException(
                    "You cannot book booked seat %02d-%s".formatted(orderedSeat.getCarriage().getCarriageNumber(),
                        orderedSeat.getSeat().getSeatNumber()),
                    HttpStatus.CONFLICT
                );
            }
        }

        List<SchedulePrice> prices = schedule.getSchedulePrices();
        Map<SeatClass, Long> seatClassToPriceMap = prices.stream()
            .collect(Collectors.toMap(SchedulePrice::getSeatClass, SchedulePrice::getPrice));

        Long totalAmount = 0L;
        List<OrderedSeat> orderedSeats = new ArrayList<>();
        Order newOrder = Order.builder()
            .user(currentUser)
            .schedule(schedule)
            .isNotified(false)
            .build();
        newOrder = orderRepository.save(newOrder);

        for (CreateOrderedSeatRequest orderedSeatRequest : request.getOrderedSeats()) {
            Passenger passenger = passengers.stream()
                .filter(p -> p.getId().equals(orderedSeatRequest.getPassengerId()))
                .findFirst()
                .orElseThrow(() -> new CustomException("Passenger Not Found", HttpStatus.NOT_FOUND));

            OrderedSeat updateOrderedSeat = lockedOrderedSeats.stream()
                .filter(orderedSeat -> Objects.equals(orderedSeat.getSeat().getId(), orderedSeatRequest.getSeatId()))
                .findFirst()
                .orElseThrow(() -> new CustomException("Seat Not Found", HttpStatus.NOT_FOUND));

            Long price = seatClassToPriceMap.get(updateOrderedSeat.getSeat().getSeatClass());
            totalAmount += price;

            updateOrderedSeat.setOrder(newOrder);
            updateOrderedSeat.setPrice(price);
            updateOrderedSeat.setGender(passenger.getGender());
            updateOrderedSeat.setDateOfBirth(passenger.getDateOfBirth());
            updateOrderedSeat.setIdCard(passenger.getIdCard());
            updateOrderedSeat.setName(passenger.getName());
            updateOrderedSeat.setEmail(passenger.getEmail());
            updateOrderedSeat.setSecret(Utility.generateRandomSecret());

            orderedSeats.add(updateOrderedSeat);
        }

        newOrder.setOrderedSeats(orderedSeats);
        orderRepository.save(newOrder);

        LocalDateTime duePayment;
        if (schedule.getDepartureTime().isAfter(LocalDateTime.now(jakartaZone).plusMinutes(70))) {
            duePayment = LocalDateTime.now(jakartaZone).plusMinutes(60);
        } else {
            duePayment = schedule.getDepartureTime().minusMinutes(10);
        }

        Payment payment = Payment.builder()
            .order(newOrder)
            .amount(totalAmount)
            .isPaid(false)
            .duePayment(duePayment)
            .build();
        newOrder.setPayment(payment);
        orderRepository.save(newOrder);

        return CreateOrderResponse.builder()
            .id(newOrder.getId())
            .build();
    }

    public OrdersResponse getUnpaidOrders() throws Exception {
        User currentUser = getCurrentUser();

        LocalDateTime now = LocalDateTime.now(jakartaZone);
        List<Order> orders = orderRepository.findUnpaidOrdersByUserIdAndLocalDateTime(currentUser.getId(), now);

        List<ResponseDataOrder> filteredOrders = orders.stream()
            .map(this::mapToResponseDataOrder)
            .toList();

        return OrdersResponse.builder()
            .orders(filteredOrders)
            .build();
    }

    public OneOrderResponse getOneOrder(Long orderId) throws Exception {
        User currentUser = getCurrentUser();

        Order order = orderRepository.findById(orderId).orElseThrow(
            () -> new CustomException("Order Not Found", HttpStatus.NOT_FOUND)
        );
        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Not Authorized", HttpStatus.BAD_REQUEST);
        }

        // Determine if secret should be shown
        boolean isShowSecret = shouldShowSecret(order);

        return mapToOneOrderResponse(order, isShowSecret);
    }

    private boolean shouldShowSecret(Order order) {
        LocalDateTime sixHoursAgo = LocalDateTime.now(jakartaZone).minusHours(6);
        return order.getPayment().getIsPaid() &&
            order.getSchedule().getArrivalTime().isAfter(sixHoursAgo);
    }

    private OneOrderResponse mapToOneOrderResponse(Order order, boolean isShowSecret) {
        return OneOrderResponse.builder()
            .order(ResponseDataOrderWithOrderedSeatDetails.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .scheduleId(order.getSchedule().getId())
                .isNotified(order.getIsNotified())
                .createdAt(order.getCreatedAt())
                .payment(mapToPaymentResponse(order.getPayment()))
                .schedule(mapToScheduleWithoutAvailabilityResponse(order.getSchedule()))
                .orderedSeats(mapToOrderedSeatsResponse(order.getOrderedSeats(), isShowSecret))
                .build()
            )
            .build();
    }

    private ResponseDataPayment mapToPaymentResponse(Payment payment) {
        return ResponseDataPayment.builder()
            .id(payment.getId())
            .amount(payment.getAmount())
            .isPaid(payment.getIsPaid())
            .duePayment(payment.getDuePayment())
            .build();
    }

    private ResponseDataScheduleWithoutAvailability mapToScheduleWithoutAvailabilityResponse(Schedule schedule) {
        return ResponseDataScheduleWithoutAvailability.builder()
            .id(schedule.getId())
            .departureTime(schedule.getDepartureTime())
            .arrivalTime(schedule.getArrivalTime())
            .departureStation(mapToStationResponse(schedule.getDepartureStation()))
            .arrivalStation(mapToStationResponse(schedule.getArrivalStation()))
            .train(mapToTrainDTO(schedule.getTrain()))
            .build();
    }

    private ResponseDataStation mapToStationResponse(Station station) {
        return ResponseDataStation.builder()
            .id(station.getId())
            .name(station.getName())
            .build();
    }

    private TrainDTO mapToTrainDTO(Train train) {
        return TrainDTO.builder()
            .id(train.getId())
            .name(train.getName())
            .build();
    }

    private List<ResponseDataOrderedSeat> mapToOrderedSeatsResponse(List<OrderedSeat> orderedSeats, boolean isShowSecret) {
        return orderedSeats.stream()
            .map(orderedSeat -> ResponseDataOrderedSeat.builder()
                .id(orderedSeat.getId())
                .price(orderedSeat.getPrice())
                .gender(orderedSeat.getGender())
                .dateOfBirth(orderedSeat.getDateOfBirth())
                .idCard(orderedSeat.getIdCard())
                .name(orderedSeat.getName())
                .email(orderedSeat.getEmail())
                .secret(isShowSecret ? orderedSeat.getSecret() : null)
                .seat(mapToSeatWithCarriageResponse(orderedSeat.getSeat()))
                .build()
            )
            .toList();
    }

    private ResponseDataSeatWithCarriage mapToSeatWithCarriageResponse(Seat seat) {
        return ResponseDataSeatWithCarriage.builder()
            .id(seat.getId())
            .seatNumber(seat.getSeatNumber())
            .seatClass(seat.getSeatClass())
            .carriage(new ResponseDataCarriage(seat.getCarriage().getId(), seat.getCarriage().getCarriageNumber()))
            .build();
    }

    public UpdateOrderResponse payOrder(Long orderId) throws Exception {
        User currentUser = getCurrentUser();

        Order order = orderRepository.findById(orderId).orElseThrow(
            () -> new CustomException("Order Not Found", HttpStatus.NOT_FOUND)
        );
        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Not Authorized", HttpStatus.BAD_REQUEST);
        }

        if (order.getPayment().getIsPaid()) {
            throw new CustomException("The order was paid", HttpStatus.BAD_REQUEST);
        }

        if (order.getPayment().getDuePayment().isBefore(LocalDateTime.now(jakartaZone))) {
            throw new CustomException("The order has passed payment due time", HttpStatus.BAD_REQUEST);
        }

        order.getPayment().setIsPaid(true);
        orderRepository.save(order);

        return new UpdateOrderResponse();
    }

    @Transactional
    public DeleteOrderResponse cancelOrder(Long orderId) throws Exception {
        User currentUser = getCurrentUser();

        Order order = orderRepository.findById(orderId).orElseThrow(
            () -> new CustomException("Order Not Found", HttpStatus.NOT_FOUND)
        );
        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException("Not Authorized", HttpStatus.BAD_REQUEST);
        }

        if (order.getPayment().getIsPaid()) {
            throw new CustomException("Cannot cancel paid order", HttpStatus.BAD_REQUEST);
        }

        orderedSeatRepository.cancelBookSeatByOrderId(orderId);
        orderRepository.delete(order);
        return new DeleteOrderResponse();
    }

    public ValidateTicketResponse validateDepartureTicket(ValidateDepartureTicketRequest request) {
        stationRepository.findById(request.getDepartureStationId()).orElseThrow(
            () -> new CustomException("Station Not Found", HttpStatus.NOT_FOUND)
        );
        OrderedSeat orderedSeat = orderedSeatRepository.findByIdAndSecret(
            request.getOrderedSeatId(), request.getSecret()
        ).orElseThrow(() -> new CustomException("Invalid QR ticket", HttpStatus.BAD_REQUEST));

        if (!orderedSeat.getOrder().getPayment().getIsPaid()) {
            throw new CustomException("Hacker!!!", HttpStatus.BAD_REQUEST);
        }

        if (!orderedSeat.getOrder().getSchedule().getDepartureStation().getId().equals(request.getDepartureStationId())) {
            throw new CustomException("You depart at wrong station", HttpStatus.BAD_REQUEST);
        }

        LocalDateTime now = LocalDateTime.now(jakartaZone);
        if (now.isBefore(orderedSeat.getOrder().getSchedule().getDepartureTime().minusHours(1L))) {
            throw new CustomException("Need to wait until one hour before departure", HttpStatus.BAD_REQUEST);
        } else if (orderedSeat.getOrder().getSchedule().getDepartureTime().isBefore(now)) {
            throw new CustomException("The train has gone", HttpStatus.BAD_REQUEST);
        }

        return mapToValidateTicketResponse(orderedSeat);
    }

    private ValidateTicketResponse mapToValidateTicketResponse(OrderedSeat orderedSeat) {
        return ValidateTicketResponse.builder()
            .orderedSeat(
                ResponseDataOrderedSeatWithOrder.builder()
                    .id(orderedSeat.getId())
                    .price(orderedSeat.getPrice())
                    .gender(orderedSeat.getGender())
                    .dateOfBirth(orderedSeat.getDateOfBirth())
                    .idCard(orderedSeat.getIdCard())
                    .name(orderedSeat.getName())
                    .email(orderedSeat.getEmail())
                    .order(mapToOrderWithScheduleOnly(orderedSeat.getOrder()))
                    .build()
            )
            .build();
    }

    private ResponseDataOrderWithScheduleOnly mapToOrderWithScheduleOnly(Order order) {
        return ResponseDataOrderWithScheduleOnly.builder()
            .id(order.getId())
            .isNotified(order.getIsNotified())
            .schedule(mapToScheduleWithStationsOnly(order.getSchedule()))
            .build();
    }

    private ResponseDataScheduleWithStationsOnly mapToScheduleWithStationsOnly(Schedule schedule) {
        return ResponseDataScheduleWithStationsOnly.builder()
            .id(schedule.getId())
            .departureTime(schedule.getDepartureTime())
            .arrivalTime(schedule.getArrivalTime())
            .departureStation(mapToStationResponse(schedule.getDepartureStation()))
            .arrivalStation(mapToStationResponse(schedule.getArrivalStation()))
            .build();
    }

    public ValidateTicketResponse validateArrivalTicket(ValidateArrivalTicketRequest request) {
        stationRepository.findById(request.getArrivalStationId()).orElseThrow(
            () -> new CustomException("Station Not Found", HttpStatus.NOT_FOUND)
        );

        OrderedSeat orderedSeat = orderedSeatRepository.findByIdAndSecret(
            request.getOrderedSeatId(), request.getSecret()
        ).orElseThrow(() -> new CustomException("Invalid QR ticket", HttpStatus.BAD_REQUEST));

        if (!orderedSeat.getOrder().getPayment().getIsPaid()) {
            throw new CustomException("Hacker!!!", HttpStatus.BAD_REQUEST);
        }

        if (!orderedSeat.getOrder().getSchedule().getArrivalStation().getId().equals(request.getArrivalStationId())) {
            throw new CustomException("You arrive at wrong station", HttpStatus.BAD_REQUEST);
        }

        return mapToValidateTicketResponse(orderedSeat);
    }
}
