package com.daniel.wheesh.orderedseat;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderedSeatRepository extends JpaRepository<OrderedSeat, Long> {

    @Query("SELECT os FROM OrderedSeat os WHERE os.seat.id IN :seatIds AND os.order.schedule.id = :scheduleId")
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<OrderedSeat> findLockedOrderedSeatsBySeatIdsAndScheduleId(List<Long> seatIds, Long scheduleId);

    Optional<OrderedSeat> findByIdAndSecret(Long id, String secret);
}
