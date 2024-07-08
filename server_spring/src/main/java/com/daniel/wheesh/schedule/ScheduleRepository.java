package com.daniel.wheesh.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDepartureTimeAfter(LocalDateTime departureTime);

    @Query("SELECT s FROM Schedule s ORDER BY s.departureTime DESC LIMIT 1")
    Optional<Schedule> findLatestSchedule();

    List<Schedule> findByDepartureStationIdAndArrivalStationIdAndDepartureTimeBetween(
        Long departureStationId, Long arrivalStationId, LocalDateTime startLimit, LocalDateTime endLimit);

    @Query("SELECT s FROM Schedule s WHERE s.departureTime >= :localDateTime ORDER BY s.departureTime ASC")
    List<Schedule> findAfterLocalDateTime(LocalDateTime localDateTime);

    @Query("SELECT s FROM Schedule s WHERE s.departureTime >= :localDateTime ORDER BY s.departureTime ASC LIMIT 1")
    Optional<Schedule> findOneAfterLocalDateTime(LocalDateTime localDateTime);

    @Transactional
    @Modifying
    @Query("DELETE FROM Schedule s WHERE s.departureTime >= :timeLimit")
    void deleteAfterTimeLimit(LocalDateTime timeLimit);
}
