package com.daniel.wheesh.order;

import com.daniel.wheesh.orderedseat.OrderedSeat;
import com.daniel.wheesh.payment.Payment;
import com.daniel.wheesh.schedule.Schedule;
import com.daniel.wheesh.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "\"Orders\"")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"userId\"", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"scheduleId\"", nullable = false)
    private Schedule schedule;

    @Column(nullable = false, name = "\"isNotified\"")
    private Boolean isNotified;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderedSeat> orderedSeats;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;

    @CreatedDate
    @Column(nullable = false, name = "\"createdAt\"")
    public LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "\"updatedAt\"")
    public LocalDateTime updatedAt;

    @Override
    public int hashCode() {
        return Objects.hash(id, isNotified, createdAt, updatedAt);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Order order = (Order) o;
        return Objects.equals(id, order.id) && Objects.equals(isNotified, order.isNotified) &&
            Objects.equals(createdAt, order.createdAt) && Objects.equals(updatedAt, order.updatedAt);
    }

    @Override
    public String toString() {
        return "Order{" +
            "id=" + id + "," +
            ", userId=" + user.getId() +
            ", scheduleId=" + schedule.getId() +
            ", isNotified=" + isNotified +
            ", createdAt='" + createdAt + '\'' +
            ", updatedAt='" + updatedAt + '\'' +
            "}";
    }
}
