package com.daniel.wheesh.schedule;

import com.daniel.wheesh.order.Order;
import com.daniel.wheesh.scheduleprice.SchedulePrice;
import com.daniel.wheesh.station.Station;
import com.daniel.wheesh.train.Train;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainId", nullable = false)
    private Train train;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departureStationId", nullable = false)
    private Station departureStation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrivalStationId", nullable = false)
    private Station arrivalStation;

    @Column(nullable = false, name = "departureTime")
    public LocalDateTime departureTime;

    @Column(nullable = false, name = "arrivalTime")
    public LocalDateTime arrivalTime;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SchedulePrice> schedulePrices;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    @CreatedDate
    @Column(nullable = false, name = "createdAt")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updatedAt")
    public Date updatedAt;

    @Override
    public int hashCode() {
        return Objects.hash(id, departureTime, arrivalTime, createdAt, updatedAt);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Schedule schedule = (Schedule) o;
        return Objects.equals(id, schedule.id) && Objects.equals(departureTime, schedule.departureTime) &&
            Objects.equals(arrivalTime, schedule.arrivalTime) && Objects.equals(createdAt, schedule.createdAt) &&
            Objects.equals(updatedAt, schedule.updatedAt);
    }

    @Override
    public String toString() {
        return "Schedule{" +
            "id=" + id +
            ", trainId=" + train.getId() +
            ", departureStationId=" + departureStation.getId() +
            ", arrivalStationId=" + arrivalStation.getId() +
            ", departureTime=" + departureTime +
            ", arrivalTime=" + arrivalTime +
            ", createdAt=" + createdAt +
            ", updatedAt=" + updatedAt +
            '}';
    }
}
