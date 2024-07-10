package com.daniel.wheesh.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RunDataLoader implements CommandLineRunner {
    private final DataSeeder seeder;

    @Override
    public void run(String... args) throws Exception {
        seeder.seed();
    }
}
