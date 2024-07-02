package com.daniel.wheesh.seat;

import com.daniel.wheesh.carriage.Carriage;
import com.daniel.wheesh.orderedseat.OrderedSeat;
import com.daniel.wheesh.schedule.SeatClass;
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
@Table(name = "seats")
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "carriageId", nullable = false)
    private Carriage carriage;

    @Column(nullable = false, name = "seatNumber")
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "seatClass")
    private SeatClass seatClass;

    @OneToMany(mappedBy = "seat", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderedSeat> orderedSeats;

    @CreatedDate
    @Column(nullable = false, name = "createdAt")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updatedAt")
    public Date updatedAt;
}
