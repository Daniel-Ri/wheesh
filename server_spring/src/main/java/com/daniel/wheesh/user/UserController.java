package com.daniel.wheesh.user;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService service;

    @PostMapping("/login")
    private ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) throws Exception {
        return ResponseEntity.ok(service.login(request));
    }

    @PostMapping("/register")
    private ResponseEntity<ProfileResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.register(request));
    }

    @PostMapping("/sendEmailToken")
    private ResponseEntity<SendEmailTokenResponse> sendEmailToken(@Valid @RequestBody SendEmailTokenRequest request) throws MessagingException {
        return ResponseEntity.ok(service.sendEmailToken(request));
    }

    @GetMapping
    private ResponseEntity<ProfileResponse> getProfile() throws Exception {
        return ResponseEntity.ok(service.getProfile());
    }

    @PutMapping
    private ResponseEntity<UpdateProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) throws Exception {
        return ResponseEntity.ok(service.updateProfile(request));
    }

    @PutMapping("/changePassword")
    private ResponseEntity<ChangePasswordResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) throws Exception {
        return ResponseEntity.ok(service.changePassword(request));
    }

    @PutMapping("/changeEmail")
    private ResponseEntity<UpdateProfileResponse> changeEmail(@Valid @RequestBody ChangeEmailRequest request) throws Exception {
        return ResponseEntity.ok(service.changeEmail(request));
    }

    @PostMapping("/verifyToken")
    private ResponseEntity<Void> verifyToken() {
        return ResponseEntity.ok().build();
    }
}
