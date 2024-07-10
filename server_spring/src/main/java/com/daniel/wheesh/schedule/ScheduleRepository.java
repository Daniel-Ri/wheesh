package com.daniel.wheesh.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDepartureTimeAfterOrderById(LocalDateTime departureTime);

    List<Schedule> findByDepartureTimeAfterOrderByDepartureTime(LocalDateTime departureTime);

    @Query("SELECT s FROM Schedule s ORDER BY s.departureTime DESC LIMIT 1")
    Optional<Schedule> findLatestSchedule();

    @Query("SELECT s FROM Schedule s " +
        "JOIN FETCH s.departureStation ds " +
        "JOIN FETCH s.arrivalStation as_ " +
        "LEFT JOIN FETCH s.orders " +
        "WHERE ds.id = :departureStationId " +
        "AND as_.id = :arrivalStationId " +
        "AND s.departureTime >= :startLimit " +
        "AND s.departureTime < :endLimit " +
        "ORDER BY s.departureTime ASC"
    )
    List<Schedule> findByDepartureStationIdAndArrivalStationIdAndDepartureTimeBetweenOrderByDepartureTime(
        Long departureStationId, Long arrivalStationId, LocalDateTime startLimit, LocalDateTime endLimit);

    @Query("SELECT s FROM Schedule s WHERE s.departureTime >= :localDateTime ORDER BY s.departureTime ASC")
    List<Schedule> findAfterLocalDateTime(LocalDateTime localDateTime);

    @Transactional
    @Modifying
    @Query("DELETE FROM Schedule s WHERE s.departureTime >= :timeLimit")
    void deleteAfterTimeLimit(LocalDateTime timeLimit);
}
