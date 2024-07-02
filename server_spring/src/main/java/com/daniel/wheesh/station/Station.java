package com.daniel.wheesh.station;

import com.daniel.wheesh.passenger.Passenger;
import com.daniel.wheesh.schedule.Schedule;
import com.daniel.wheesh.scheduleday.ScheduleDay;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "stations")
public class Station {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(nullable = false)
    public String name;

    @OneToMany(mappedBy = "departureStation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScheduleDay> departureScheduleDays;

    @OneToMany(mappedBy = "arrivalStation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ScheduleDay> arrivalScheduleDays;

    @OneToMany(mappedBy = "departureStation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> departureSchedules;

    @OneToMany(mappedBy = "arrivalStation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Schedule> arrivalSchedules;

    @CreatedDate
    @Column(nullable = false, name = "createdAt")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updatedAt")
    public Date updatedAt;
}
