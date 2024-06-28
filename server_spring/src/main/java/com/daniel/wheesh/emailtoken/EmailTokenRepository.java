package com.daniel.wheesh.emailtoken;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface EmailTokenRepository extends JpaRepository<EmailToken, Long> {
    Optional<EmailToken> findByEmail(String email);

    Optional<EmailToken> findByEmailAndTokenAndExpiredAtAfter(String email, String token, LocalDateTime expiredAt);
}
