package com.daniel.wheesh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class WheeshServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(WheeshServerApplication.class, args);
	}

}
