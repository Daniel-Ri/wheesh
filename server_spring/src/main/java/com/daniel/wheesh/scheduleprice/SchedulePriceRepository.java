package com.daniel.wheesh.scheduleprice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SchedulePriceRepository extends JpaRepository<SchedulePrice, Long> {
    @Query("SELECT s FROM SchedulePrice s WHERE s.schedule.id = :scheduleId")
    List<SchedulePrice> findByScheduleId(Long scheduleId);
}
