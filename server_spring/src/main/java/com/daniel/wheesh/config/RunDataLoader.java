package com.daniel.wheesh.config;

import com.daniel.wheesh.passenger.PassengerSeeder;
import com.daniel.wheesh.user.UserSeeder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Profile({"default", "test"})
public class RunDataLoader implements CommandLineRunner {

    private final UserSeeder userSeeder;

    private final PassengerSeeder passengerSeeder;

    @Override
    public void run(String... args) throws Exception {
        userSeeder.seedUsers();
        passengerSeeder.seedPassengers();
    }
}
