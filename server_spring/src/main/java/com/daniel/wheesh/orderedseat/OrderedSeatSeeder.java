package com.daniel.wheesh.orderedseat;

import com.daniel.wheesh.carriage.Carriage;
import com.daniel.wheesh.global.Utility;
import com.daniel.wheesh.order.Order;
import com.daniel.wheesh.order.OrderRepository;
import com.daniel.wheesh.passenger.Gender;
import com.daniel.wheesh.schedule.Schedule;
import com.daniel.wheesh.schedule.SeatClass;
import com.daniel.wheesh.scheduleprice.SchedulePrice;
import com.daniel.wheesh.seat.Seat;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderedSeatSeeder {
    private static final Logger logger = LoggerFactory.getLogger(OrderedSeatSeeder.class);
    private static final int BATCH_SIZE = 100;

    private final OrderRepository orderRepository;
    private final OrderedSeatRepository orderedSeatRepository;

    @Transactional
    public void seed() {
        if (orderedSeatRepository.count() > 0) {
            logger.info("Ordered seats already exist in the database. No seeding needed.");
            return;
        }

        logger.info("No ordered seats found in the database. Seeding initial data.");

        List<Order> orderList = orderRepository.findAll();
        List<OrderedSeat> orderedSeatList = new ArrayList<>();

        /* 1: Order half all seats */
        processOrder(orderList.get(0), orderedSeatList, 4, true);

        /* 2: Order another half seats */
        processOrder(orderList.get(1), orderedSeatList, 4, false);

        /* 3: Order all first seats classes */
        processOrderByClass(orderList.get(2), orderedSeatList, SeatClass.first);

        /* 4: Order all business seats classes */
        processOrderByClass(orderList.get(3), orderedSeatList, SeatClass.business);

        /* 5: Order all economy seats classes */
        processOrderByClass(orderList.get(4), orderedSeatList, SeatClass.economy);

        /* 6: Order 80% of first class seats */
        processRandomSeats(orderList.get(5), orderedSeatList, SeatClass.first, 0.8);

        /* 7: Order 80% of business class seats */
        processRandomSeats(orderList.get(6), orderedSeatList, SeatClass.business, 0.8);

        /* 8: Order 80% of economy class seats */
        processRandomSeats(orderList.get(7), orderedSeatList, SeatClass.economy, 0.8);

        /* 9: Order all seats of economy, business, and 80% of first class seats */
        processMixedOrder(orderList.get(8), orderedSeatList);

        /* 10: Order 3 of economy class seats */
        processRandomSeats(orderList.get(9), orderedSeatList, SeatClass.economy, 3);

        /* 11: Order 3 of business class seats */
        processRandomSeats(orderList.get(10), orderedSeatList, SeatClass.business, 3);

        for (int i = 0; i < orderedSeatList.size(); i += BATCH_SIZE) {
            List<OrderedSeat> batchList = orderedSeatList.subList(i, Math.min(i + BATCH_SIZE, orderedSeatList.size()));
            orderedSeatRepository.saveAll(batchList);
        }

        logger.info("Seeded initial ordered seats data");
    }

    private OrderedSeat generateOrderedSeatItem(Order order, Seat seat, long price) {
        return OrderedSeat.builder()
            .order(order)
            .seat(seat)
            .price(price)
            .gender(Math.random() > 0.5 ? Gender.Male : Gender.Female)
            .dateOfBirth(Utility.getRandomDOB())
            .idCard(Utility.generateRandomId())
            .name(Utility.generateRandomName())
            .email(Utility.generateRandomEmail())
            .secret(Utility.generateRandomSecret())
            .build();
    }

    private void processCarriages(List<Carriage> carriages, Order order, List<OrderedSeat> orderedSeatList,
                                  Map<SeatClass, SchedulePrice> schedulePriceMap, int carriageLimit,
                                  boolean isLessThanOrEqual) {
        carriages.stream()
            .filter(carriage -> isLessThanOrEqual == (carriage.getCarriageNumber() <= carriageLimit))
            .forEach(carriage -> processSeats(carriage.getSeats(), order, orderedSeatList, schedulePriceMap));
    }

    private void processSeats(List<Seat> seats, Order order, List<OrderedSeat> orderedSeatList, Map<SeatClass,
        SchedulePrice> schedulePriceMap) {
        seats.forEach(seat -> {
            SchedulePrice price = schedulePriceMap.get(seat.getSeatClass());
            orderedSeatList.add(generateOrderedSeatItem(order, seat, price.getPrice()));
        });
    }

    private void processSeatsByClass(List<Carriage> carriages, Order order, List<OrderedSeat> orderedSeatList,
                                     Map<SeatClass, SchedulePrice> schedulePriceMap, SeatClass seatClass) {
        carriages.stream()
            .flatMap(carriage -> carriage.getSeats().stream())
            .filter(seat -> seat.getSeatClass() == seatClass)
            .forEach(seat -> {
                SchedulePrice price = schedulePriceMap.get(seat.getSeatClass());
                orderedSeatList.add(generateOrderedSeatItem(order, seat, price.getPrice()));
            });
    }

    private void processOrder(Order order, List<OrderedSeat> orderedSeatList, int carriageLimit,
                              boolean isLessThanOrEqual) {
        List<Carriage> carriages = order.getSchedule().getTrain().getCarriages();
        Map<SeatClass, SchedulePrice> schedulePriceMap = createSchedulePriceMap(order.getSchedule());
        processCarriages(carriages, order, orderedSeatList, schedulePriceMap, carriageLimit, isLessThanOrEqual);
    }

    private void processOrderByClass(Order order, List<OrderedSeat> orderedSeatList, SeatClass seatClass) {
        List<Carriage> carriages = order.getSchedule().getTrain().getCarriages();
        Map<SeatClass, SchedulePrice> schedulePriceMap = createSchedulePriceMap(order.getSchedule());
        processSeatsByClass(carriages, order, orderedSeatList, schedulePriceMap, seatClass);
    }

    private void processMixedOrder(Order order, List<OrderedSeat> orderedSeatList) {
        List<Carriage> carriages = order.getSchedule().getTrain().getCarriages();
        Map<SeatClass, SchedulePrice> schedulePriceMap = createSchedulePriceMap(order.getSchedule());

        List<Seat> seats = new ArrayList<>();

        // Get 80% of first class seats
        List<Seat> firstClassSeats = carriages.stream()
            .flatMap(carriage -> carriage.getSeats().stream())
            .filter(seat -> seat.getSeatClass() == SeatClass.first)
            .collect(Collectors.toList());
        seats.addAll(Utility.selectRandomly(firstClassSeats, (int) (firstClassSeats.size() * 0.8)));

        // Get all business and economy class seats
        seats.addAll(carriages.stream()
            .flatMap(carriage -> carriage.getSeats().stream())
            .filter(seat -> seat.getSeatClass() == SeatClass.business || seat.getSeatClass() == SeatClass.economy)
            .toList());

        processSeats(seats, order, orderedSeatList, schedulePriceMap);
    }

    private void processRandomSeats(Order order, List<OrderedSeat> orderedSeatList, SeatClass seatClass,
                                    double percentageOrCount) {
        List<Carriage> carriages = order.getSchedule().getTrain().getCarriages();
        Map<SeatClass, SchedulePrice> schedulePriceMap = createSchedulePriceMap(order.getSchedule());

        List<Seat> seats = carriages.stream()
            .flatMap(carriage -> carriage.getSeats().stream())
            .filter(seat -> seat.getSeatClass() == seatClass)
            .collect(Collectors.toList());

        List<Seat> selectedSeats;
        if (percentageOrCount < 1) {
            selectedSeats = Utility.selectRandomly(seats, (int) (seats.size() * percentageOrCount));
        } else {
            selectedSeats = Utility.selectRandomly(seats, (int) percentageOrCount);
        }

        processSeats(selectedSeats, order, orderedSeatList, schedulePriceMap);
    }

    private Map<SeatClass, SchedulePrice> createSchedulePriceMap(Schedule schedule) {
        return schedule.getSchedulePrices().stream()
            .collect(Collectors.toMap(SchedulePrice::getSeatClass, price -> price));
    }

    public void unseed() {
        logger.info("Deleting all ordered seats data.");
        orderedSeatRepository.deleteAll();
        logger.info("All ordered seats data deleted.");
    }
}
