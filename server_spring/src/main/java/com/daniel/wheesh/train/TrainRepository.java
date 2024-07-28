package com.daniel.wheesh.train;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TrainRepository extends JpaRepository<Train, Long> {
    List<Train> findAllByOrderById();

    @Query("SELECT t FROM Train t JOIN t.schedules s WHERE s.id = :scheduleId")
    Optional<Train> findByScheduleId(Long scheduleId);
}
