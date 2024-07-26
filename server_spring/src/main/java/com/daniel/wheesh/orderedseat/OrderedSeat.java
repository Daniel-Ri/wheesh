package com.daniel.wheesh.orderedseat;

import com.daniel.wheesh.carriage.Carriage;
import com.daniel.wheesh.constraints.MinAge;
import com.daniel.wheesh.order.Order;
import com.daniel.wheesh.passenger.Gender;
import com.daniel.wheesh.schedule.Schedule;
import com.daniel.wheesh.seat.Seat;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "\"OrderedSeats\"")
public class OrderedSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"scheduleId\"", nullable = false)
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"carriageId\"", nullable = false)
    private Carriage carriage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"seatId\"", nullable = false)
    private Seat seat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"orderId\"")
    private Order order;

    private Long price;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @MinAge(value = 17, required = false, message = "Must be at least 17 years old")
    @Column(name = "\"dateOfBirth\"")
    public LocalDate dateOfBirth;

    @Pattern(regexp = "\\d{16}", message = "ID Card must be exactly 16 digits")
    @Column(name = "\"idCard\"")
    public String idCard;

    public String name;

    @Email
    public String email;

    public String secret;

    @CreatedDate
    @Column(nullable = false, name = "\"createdAt\"")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "\"updatedAt\"")
    public Date updatedAt;

    @Override
    public String toString() {
        return "OrderedSeat{" +
            "id=" + id +
            ", scheduleId=" + schedule.getId() +
            ", seatId=" + seat.getId() +
            ", orderId=" + (order != null ? order.getId() : "null") +
            ", price=" + price +
            ", gender='" + gender + '\'' +
            ", dateOfBirth=" + dateOfBirth +
            ", idCard='" + idCard + '\'' +
            ", name='" + name + '\'' +
            ", email='" + email + '\'' +
            ", createdAt='" + createdAt + '\'' +
            ", updatedAt='" + updatedAt + '\'' +
            "}";
    }
}
