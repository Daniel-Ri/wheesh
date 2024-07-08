package com.daniel.wheesh.orderedseat;

import com.daniel.wheesh.constraints.MinAge;
import com.daniel.wheesh.order.Order;
import com.daniel.wheesh.passenger.Gender;
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
@Table(name = "orderedseats")
public class OrderedSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderId", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seatId", nullable = false)
    private Seat seat;

    @Column(nullable = false)
    private Long price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @MinAge(value = 17, message = "Must be at least 17 years old")
    @Column(nullable = false, name = "dateOfBirth")
    public LocalDate dateOfBirth;

    @Pattern(regexp = "\\d{16}", message = "ID Card must be exactly 16 digits")
    @Column(nullable = false, name = "idCard")
    public String idCard;

    @Column(nullable = false)
    public String name;

    @Email
    @Column(nullable = false)
    public String email;

    @Column(nullable = false)
    public String secret;

    @CreatedDate
    @Column(nullable = false, name = "createdAt")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updatedAt")
    public Date updatedAt;

    @Override
    public String toString() {
        return "OrderedSeat{" +
            "id=" + id +
            ", orderId=" + order.getId() +
            ", seatId=" + seat.getId() +
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
