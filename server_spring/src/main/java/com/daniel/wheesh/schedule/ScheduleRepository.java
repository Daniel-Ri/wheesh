package com.daniel.wheesh.schedule;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    @Override
    @Query("SELECT s FROM Schedule s " +
        "JOIN FETCH s.departureStation ds " +
        "JOIN FETCH s.arrivalStation as_ " +
        "JOIN FETCH s.train t " +
        "LEFT JOIN FETCH s.orderedSeats os " +
        "WHERE s.id = :id " +
        "ORDER BY os.id ASC")
    @NonNull
    Optional<Schedule> findById(@NonNull Long id);

    List<Schedule> findByDepartureTimeAfterOrderById(LocalDateTime departureTime);

    List<Schedule> findByDepartureTimeAfterOrderByDepartureTime(LocalDateTime departureTime);

    @Query("SELECT s FROM Schedule s ORDER BY s.departureTime DESC LIMIT 1")
    Optional<Schedule> findLatestSchedule();

    @Query("SELECT s FROM Schedule s " +
        "JOIN FETCH s.departureStation ds " +
        "JOIN FETCH s.arrivalStation as_ " +
        "JOIN FETCH s.train t " +
        "JOIN FETCH s.orderedSeats os " +
        "JOIN FETCH os.seat " +
        "WHERE ds.id = :departureStationId " +
        "AND as_.id = :arrivalStationId " +
        "AND s.departureTime >= :startLimit " +
        "AND s.departureTime < :endLimit " +
        "ORDER BY s.departureTime ASC"
    )
    List<Schedule> findByDepartureStationIdAndArrivalStationIdAndDepartureTimeBetweenOrderByDepartureTime(
        Long departureStationId, Long arrivalStationId, LocalDateTime startLimit, LocalDateTime endLimit);

    @Query("SELECT s FROM Schedule s " +
        "LEFT JOIN FETCH s.orderedSeats " +
        "WHERE s.departureTime >= :localDateTime " +
        "ORDER BY s.departureTime ASC")
    List<Schedule> findAfterLocalDateTime(LocalDateTime localDateTime);

    @Query("SELECT s FROM Schedule s " +
        "JOIN FETCH s.departureStation ds " +
        "JOIN FETCH s.arrivalStation as_ " +
        "JOIN FETCH s.train t " +
        "WHERE s.departureTime >= :localDateTime ORDER BY s.departureTime ASC"
    )
    List<Schedule> findAfterLocalDateTimeWithTrainAndStations(LocalDateTime localDateTime);

    @Transactional
    @Modifying
    @Query("DELETE FROM Schedule s WHERE s.departureTime >= :timeLimit")
    void deleteAfterTimeLimit(LocalDateTime timeLimit);

    @Query("SELECT s FROM Schedule s JOIN s.orders o WHERE o.id = :orderId")
    Optional<Schedule> findByOrderId(Long orderId);
}
