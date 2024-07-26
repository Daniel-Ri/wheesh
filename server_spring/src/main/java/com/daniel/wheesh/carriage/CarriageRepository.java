package com.daniel.wheesh.carriage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CarriageRepository extends JpaRepository<Carriage, Long> {
    @Query("SELECT c FROM Carriage c JOIN FETCH c.seats WHERE c.train.id = :trainId")
    List<Carriage> findByTrainId(Long trainId);
}
