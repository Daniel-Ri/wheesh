package com.daniel.wheesh.config;

import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final AllowedPathsConfig allowedPathsConfig;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userId;

        // Check if the request URI matches any of the permitted paths
        String requestUri = request.getRequestURI();
        String requestMethod = request.getMethod();
        boolean isPermittedPath = allowedPathsConfig.getPermittedPaths().stream()
            .anyMatch(path -> path.equals(requestUri) ||
                (path.endsWith("/**") && requestUri.startsWith(path.substring(0, path.length() - 3)))
            );

        boolean isMethodSpecificPath = allowedPathsConfig.getMethodSpecificPaths().entrySet().stream()
            .anyMatch(entry -> entry.getKey().equals(requestUri) ||
                (entry.getKey().endsWith("/**") &&
                    requestUri.startsWith(entry.getKey().substring(0, entry.getKey().length() - 3)) &&
                    entry.getValue().equalsIgnoreCase(requestMethod)
                )
            );

        if (isPermittedPath || isMethodSpecificPath) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            jwt = authHeader.substring(7);
            userId = jwtService.extractUserId(jwt);
        } catch (StringIndexOutOfBoundsException | MalformedJwtException ex) {
            ex.printStackTrace();
            filterChain.doFilter(request, response);
            return;
        }

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.customUserDetailsService.loadUserByUsername(userId); // if there is no
            // username in repository, it will return error (I think)
            if (jwtService.isTokenValid(jwt, userDetails)) { // supposed to be jwtService.isTokenValid(jwt, userDetails)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
                );

                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
