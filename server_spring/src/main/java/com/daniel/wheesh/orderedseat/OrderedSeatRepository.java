package com.daniel.wheesh.orderedseat;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface OrderedSeatRepository extends JpaRepository<OrderedSeat, Long> {

    @Query("SELECT os " +
        "FROM OrderedSeat os " +
        "LEFT JOIN FETCH os.order " +
        "JOIN FETCH os.seat se " +
        "WHERE se.id IN :seatIds AND os.schedule.id = :scheduleId")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<OrderedSeat> findLockedOrderedSeatsBySeatIdsAndScheduleId(List<Long> seatIds, Long scheduleId);

    Optional<OrderedSeat> findByIdAndSecret(Long id, String secret);

    @Transactional
    @Modifying
    @Query("UPDATE OrderedSeat os " +
        "SET os.order = NULL, " +
        "os.price = NULL, " +
        "os.gender = NULL, " +
        "os.dateOfBirth = NULL, " +
        "os.idCard = NULL, " +
        "os.name = NULL, " +
        "os.email = NULL, " +
        "os.secret = NULL " +
        "WHERE os.order.id = :orderId")
    void cancelBookSeatByOrderId(Long orderId);

    @Transactional
    @Modifying
    @Query("UPDATE OrderedSeat os " +
        "SET os.order = NULL, " +
        "os.price = NULL, " +
        "os.gender = NULL, " +
        "os.dateOfBirth = NULL, " +
        "os.idCard = NULL, " +
        "os.name = NULL, " +
        "os.email = NULL, " +
        "os.secret = NULL " +
        "WHERE os.order.id IN :orderIds")
    void cancelBookSeatByManyOrderIds(List<Long> orderIds);
}
