package com.daniel.wheesh.passenger;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    Optional<Passenger> findByUserIdAndIsUserIsTrue(Long userId);
    Optional<Passenger> findByEmail(String email);

    List<Passenger> findByUserId(Long userId);

    @Query("SELECT COUNT(p) FROM Passenger p WHERE p.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

}
