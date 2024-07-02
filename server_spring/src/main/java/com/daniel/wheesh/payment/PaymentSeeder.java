package com.daniel.wheesh.payment;

import com.daniel.wheesh.order.Order;
import com.daniel.wheesh.order.OrderRepository;
import com.daniel.wheesh.orderedseat.OrderedSeat;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PaymentSeeder {
    private static final Logger logger = LoggerFactory.getLogger(PaymentSeeder.class);

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public void seed() {
        if (paymentRepository.count() > 0) {
            logger.info("Payments already exist in the database. No seeding needed.");
            return;
        }

        logger.info("No payments found in the database. Seeding initial data.");

        List<Order> orderList = orderRepository.findAll();
        List<Payment> paymentList = new ArrayList<>();

        for (Order order : orderList) {
            long totalPrice = order.getOrderedSeats().stream()
                .mapToLong(OrderedSeat::getPrice)
                .sum();
            paymentList.add(Payment.builder()
                    .order(order)
                    .amount(totalPrice)
                    .isPaid(true)
                    .duePayment(LocalDateTime.now())
                .build()
            );
        }
        paymentRepository.saveAll(paymentList);

        logger.info("Seeded initial payments data");
    }

    public void unseed() {
        logger.info("Deleting all payments data.");
        paymentRepository.deleteAll();
        logger.info("All payments data deleted.");
    }
}
