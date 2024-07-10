package com.daniel.wheesh.carriage;

import com.daniel.wheesh.seat.Seat;
import com.daniel.wheesh.train.Train;
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
@Table(name = "\"Carriages\"")
public class Carriage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"trainId\"", nullable = false)
    private Train train;

    @Column(nullable = false, name = "\"carriageNumber\"")
    private Long carriageNumber;

    @OneToMany(mappedBy = "carriage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seat> seats;

    @CreatedDate
    @Column(nullable = false, name = "\"createdAt\"")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "\"updatedAt\"")
    public Date updatedAt;
}
