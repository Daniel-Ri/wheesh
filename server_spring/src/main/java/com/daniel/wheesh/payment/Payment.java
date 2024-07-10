package com.daniel.wheesh.payment;

import com.daniel.wheesh.order.Order;
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
import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "\"Payments\"")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"orderId\"", nullable = false)
    private Order order;

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false, name = "\"isPaid\"")
    private Boolean isPaid;

    @Column(nullable = false, name = "\"duePayment\"")
    private LocalDateTime duePayment;

    @CreatedDate
    @Column(nullable = false, name = "\"createdAt\"")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "\"updatedAt\"")
    public Date updatedAt;

    @Override
    public int hashCode() {
        return Objects.hash(id, amount, isPaid, duePayment, createdAt, updatedAt);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Payment payment = (Payment) o;
        return Objects.equals(id, payment.id) && Objects.equals(amount, payment.amount) &&
            Objects.equals(isPaid, payment.isPaid) && Objects.equals(duePayment, payment.duePayment) &&
            Objects.equals(createdAt, payment.createdAt) && Objects.equals(updatedAt, payment.updatedAt);
    }
}
