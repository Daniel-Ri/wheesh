package com.daniel.wheesh.config;

import org.springframework.context.ApplicationEvent;

public class DataSeedingCompletedEvent extends ApplicationEvent {
    public DataSeedingCompletedEvent(Object source) {
        super(source);
    }
}
