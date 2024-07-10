package com.daniel.wheesh.banner;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "\"Banners\"")
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(nullable = false, name = "\"imageDesktop\"")
    private String imageDesktop;

    @Column(nullable = false, name = "\"imageMobile\"")
    private String imageMobile;

    @CreatedDate
    @Column(nullable = false, name = "\"createdAt\"")
    public Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "\"updatedAt\"")
    public Date updatedAt;
}
