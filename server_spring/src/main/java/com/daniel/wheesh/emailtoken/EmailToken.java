package com.daniel.wheesh.emailtoken;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "emailtokens")
public class EmailToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Email
    @Column(nullable = false)
    public String email;

    @Column(nullable = false)
    public String token;

    @Column(nullable = false, name = "expiredAt")
    public LocalDateTime expiredAt;

    @CreatedDate
    @Column(nullable = false, name = "createdAt")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updatedAt")
    public Date updatedAt;
}
