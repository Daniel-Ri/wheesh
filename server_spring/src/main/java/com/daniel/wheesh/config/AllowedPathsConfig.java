package com.daniel.wheesh.config;

import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
public class AllowedPathsConfig {
    public List<String> getPermittedPaths() {
        return List.of(
            "/api/station",
            "/api/schedule/**",
            "/api/order/validate**",
            "/api/user/login",
            "/api/user/register",
            "/api/user/sendEmailToken",
            "/api/public/**"
        );
    }

    public Map<String, String> getMethodSpecificPaths() {
        return Map.of(
            "/api/banner/**", "GET"
        );
    }
}
