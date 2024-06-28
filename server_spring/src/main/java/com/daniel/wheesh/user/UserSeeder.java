package com.daniel.wheesh.user;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class UserSeeder {
    private static final Logger logger = LoggerFactory.getLogger(UserSeeder.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public void seedUsers() {
        if (userRepository.count() == 0) {
            logger.info("No users found in the database. Seeding initial data.");
            User[] users = new User[]{
                    User.builder()
                        .username("bangjoe")
                        .password(passwordEncoder.encode("123456"))
                        .role(Role.admin)
                        .email("bangjoe@gmail.com")
                        .build(),
                    User.builder()
                        .username("johndoe")
                        .password(passwordEncoder.encode("123456"))
                        .role(Role.user)
                        .email("johndoe@gmail.com")
                        .build(),
                    User.builder()
                        .username("jeandoe")
                        .password(passwordEncoder.encode("123456"))
                        .role(Role.user)
                        .email("jeandoe@gmail.com")
                        .build(),
                    User.builder()
                        .username("agus")
                        .password(passwordEncoder.encode("123456"))
                        .role(Role.user)
                        .email("agus@gmail.com")
                        .build(),
                    User.builder()
                        .username("asep")
                        .password(passwordEncoder.encode("123456"))
                        .role(Role.user)
                        .email("asep@gmail.com")
                        .build(),
                    User.builder()
                        .username("slamet")
                        .password(passwordEncoder.encode("123456"))
                        .role(Role.user)
                        .email("slamet@gmail.com")
                        .build()
            };
            userRepository.saveAll(Arrays.asList(users));
            logger.info("Seeded initial user data");
        } else {
            logger.info("Users already exist in the database. No seeding needed.");
        }
    }

    public void unseedUsers() {
        logger.info("Deleting all user data.");
        userRepository.deleteAll();
        logger.info("All user data deleted.");
    }
}
