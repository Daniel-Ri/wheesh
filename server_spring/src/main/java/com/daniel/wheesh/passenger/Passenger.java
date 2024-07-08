package com.daniel.wheesh.passenger;

import com.daniel.wheesh.constraints.MinAge;
import com.daniel.wheesh.user.User;
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
import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "passengers")
public class Passenger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Column(nullable = false, name = "isUser")
    public Boolean isUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Gender gender;

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

    @CreatedDate
    @Column(nullable = false, name = "createdAt")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updatedAt")
    public Date updatedAt;

    @Override
    public String toString() {
        return "Passenger {id=" + id + ", userId=" + user.getId() + ", isUser=" + isUser +
            ", gender='" + gender + "', dateOfBirth=" + dateOfBirth + ", idCard='" + idCard +
            "', name='" + name + "', email='" + email + "', createdAt=" + createdAt +
            ", updatedAt=" + updatedAt + "}";
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, isUser, gender, dateOfBirth, idCard, name, email, createdAt, updatedAt);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Passenger passenger = (Passenger) o;
        return Objects.equals(id, passenger.id) && Objects.equals(isUser, passenger.isUser) &&
            Objects.equals(gender, passenger.gender) && Objects.equals(dateOfBirth, passenger.dateOfBirth) &&
            Objects.equals(idCard, passenger.idCard)  && Objects.equals(name, passenger.name) &&
            Objects.equals(email, user.email) &&
            Objects.equals(createdAt, user.createdAt) && Objects.equals(updatedAt, user.updatedAt);
    }
}
