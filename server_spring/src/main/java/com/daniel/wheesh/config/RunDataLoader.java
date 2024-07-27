package com.daniel.wheesh.config;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RunDataLoader implements CommandLineRunner, ApplicationEventPublisherAware {
    private final DataSeeder seeder;
    private ApplicationEventPublisher eventPublisher;

    @Override
    public void run(String... args) throws Exception {
        seeder.seed();
        eventPublisher.publishEvent(new DataSeedingCompletedEvent(this));
    }

    @Override
    public void setApplicationEventPublisher(@NonNull ApplicationEventPublisher applicationEventPublisher) {
        this.eventPublisher = applicationEventPublisher;
    }
}
