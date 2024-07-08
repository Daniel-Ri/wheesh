package com.daniel.wheesh.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.id DESC")
    List<Order> findAllByUserIdOrderByOrderIdDesc(Long userId);

    @Query("SELECT o FROM Order o " +
        "JOIN FETCH o.payment p " +
        "JOIN FETCH o.schedule s " +
        "WHERE o.user.id = :userId " +
        "AND p.isPaid = true " +
        "AND s.arrivalTime >= :sixHoursAgo " +
        "ORDER BY o.id DESC")
    List<Order> findPaidOrdersByUserIdAndLocalDateTime(Long userId, LocalDateTime sixHoursAgo);

    @Query("SELECT o FROM Order o " +
        "JOIN FETCH o.payment p " +
        "JOIN FETCH o.schedule s " +
        "WHERE o.user.id = :userId " +
        "AND p.isPaid = true " +
        "AND s.arrivalTime < :sixHoursAgo " +
        "ORDER BY o.id DESC")
    List<Order> findHistoryOrdersByUserIdAndLocalDateTime(Long userId, LocalDateTime sixHoursAgo);

    @Query("SELECT o FROM Order o " +
        "JOIN FETCH o.payment p " +
        "JOIN FETCH o.schedule s " +
        "WHERE o.user.id = :userId " +
        "AND p.isPaid = false " +
        "AND p.duePayment > :now " +
        "ORDER BY o.id DESC")
    List<Order> findUnpaidOrdersByUserIdAndLocalDateTime(Long userId, LocalDateTime now);

    @Query("SELECT o FROM Order o " +
        "JOIN FETCH o.payment p " +
        "WHERE p.isPaid = false " +
        "AND p.duePayment <= :now")
    List<Order> findAllUnpaidOrdersPassedDueTime(LocalDateTime now);

    @Query("SELECT o FROM Order o " +
        "JOIN FETCH o.payment p " +
        "WHERE p.isPaid = false")
    List<Order> findAllUnpaidOrders();

    @Query("SELECT o FROM Order o " +
        "JOIN FETCH o.payment p " +
        "JOIN FETCH o.schedule s " +
        "WHERE p.isPaid = true " +
        "AND o.isNotified = false " +
        "AND s.departureTime > :now " +
        "AND s.departureTime <= :oneHourAway")
    List<Order> findAllNotNotifiedPaidOrdersBeforeOneHourAway(LocalDateTime now, LocalDateTime oneHourAway);
}
