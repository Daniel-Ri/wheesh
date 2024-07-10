package com.daniel.wheesh.user;

import com.daniel.wheesh.config.EmailService;
import com.daniel.wheesh.config.JwtService;
import com.daniel.wheesh.emailtoken.EmailToken;
import com.daniel.wheesh.emailtoken.EmailTokenRepository;
import com.daniel.wheesh.global.CustomException;
import com.daniel.wheesh.passenger.Gender;
import com.daniel.wheesh.passenger.Passenger;
import com.daniel.wheesh.passenger.PassengerRepository;
import com.daniel.wheesh.passenger.ResponseDataPassenger;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    private final PassengerRepository passengerRepository;

    private final EmailTokenRepository emailTokenRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final EmailService emailService;

    public LoginResponse login(LoginRequest request) throws Exception {
        User user = repository.findByUsernameOrEmail(request.usernameOrEmail(), request.usernameOrEmail())
            .orElseThrow(() -> new UsernameNotFoundException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username/email or password");
        }

        var jwtToken = jwtService.generateToken(user);
        return LoginResponse.builder()
            .token(jwtToken)
            .userResponse(
                UserResponse.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .role(user.getRole().toString())
                    .email(user.getEmail())
                    .build()
            )
            .build();
    }

    @Transactional
    public ProfileResponse register(RegisterRequest request) {
        if (repository.existsByUsername(request.getUsername())) {
            throw new CustomException("Username already exists!", HttpStatus.BAD_REQUEST);
        }

        if (repository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already exists!", HttpStatus.BAD_REQUEST);
        }

        Optional<EmailToken> foundEmailToken =
            emailTokenRepository.findByEmailAndTokenAndExpiredAtAfter(
                request.getEmail(),
                request.getEmailToken(),
                LocalDateTime.now()
            );
        if (foundEmailToken.isEmpty()) {
            throw new CustomException("Email token is expired or invalid!", HttpStatus.BAD_REQUEST);
        }

        emailTokenRepository.delete(foundEmailToken.get());

        var user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.user)
            .build();
        repository.save(user);

        var passenger = Passenger.builder()
            .user(user)
            .isUser(true)
            .gender(Gender.valueOf(request.getGender()))
            .dateOfBirth(request.getDateOfBirth())
            .idCard(request.getIdCard())
            .name(request.getName())
            .email(request.getEmail())
            .build();
        passengerRepository.save(passenger);

        return ProfileResponse.builder()
            .data(
                ProfileResponseData.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .role(user.getRole().toString())
                    .email(user.getEmail())
                    .passengers(List.of(
                        ResponseDataPassenger.builder()
                            .id(passenger.getId())
                            .userId(passenger.getUser().getId())
                            .isUser(passenger.getIsUser())
                            .gender(passenger.getGender())
                            .dateOfBirth(passenger.getDateOfBirth())
                            .idCard(passenger.getIdCard())
                            .name(passenger.getName())
                            .email(passenger.getEmail())
                            .build()
                    ))
                    .build()
            )
            .build();
    }

    public ProfileResponse getProfile() throws Exception {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        User user = repository.findByUsername(username).orElseThrow(
            () -> new Exception("User not found")
        );

        Passenger passenger = passengerRepository.findByUserIdAndIsUserIsTrue(user.getId()).orElseThrow(
            () -> new Exception("Something wrong happen")
        );

        return ProfileResponse.builder()
            .data(
                ProfileResponseData.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .role(user.getRole().toString())
                    .email(user.getEmail())
                    .passengers(List.of(
                        ResponseDataPassenger.builder()
                            .id(passenger.getId())
                            .userId(passenger.getUser().getId())
                            .isUser(passenger.getIsUser())
                            .gender(passenger.getGender())
                            .dateOfBirth(passenger.getDateOfBirth())
                            .idCard(passenger.getIdCard())
                            .name(passenger.getName())
                            .email(passenger.getEmail())
                            .build()
                    ))
                    .build()
            )
            .build();
    }

    @Transactional
    public UpdateProfileResponse updateProfile(UpdateProfileRequest request) throws Exception {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        User currentUser = repository.findByUsername(username).orElseThrow(
            () -> new Exception("User not found")
        );

        Passenger currentPassenger = passengerRepository.findByUserIdAndIsUserIsTrue(currentUser.getId()).orElseThrow(
            () -> new Exception("Something wrong happen")
        );

        if (request.getUsername() != null) {
            // Check if username is already taken
            User existingUser = repository.findByUsername(request.getUsername()).orElse(null);
            if (existingUser != null && !existingUser.getId().equals(currentUser.getId())) {
                throw new CustomException("Username already exist!", HttpStatus.BAD_REQUEST);
            }
            currentUser.setUsername(request.getUsername());
        }

        if (request.getGender() != null) {
            currentPassenger.setGender(Gender.valueOf(request.getGender()));
        }

        if (request.getDateOfBirth() != null) {
            currentPassenger.setDateOfBirth(request.getDateOfBirth());
        }

        if (request.getIdCard() != null) {
            currentPassenger.setIdCard(request.getIdCard());
        }

        if (request.getName() != null) {
            currentPassenger.setName(request.getName());
        }

        repository.save(currentUser);
        passengerRepository.save(currentPassenger);

        return UpdateProfileResponse.builder()
            .userResponse(
                UserResponse.builder()
                    .id(currentUser.getId())
                    .username(currentUser.getUsername())
                    .email(currentUser.getEmail())
                    .role(currentUser.getRole().toString())
                    .build()
            )
            .build();
    }

    public ChangePasswordResponse changePassword(ChangePasswordRequest request) throws Exception {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        User currentUser = repository.findByUsername(username).orElseThrow(
            () -> new Exception("User not found")
        );

        if (!passwordEncoder.matches(request.getOldPassword(), currentUser.getPassword())) {
            throw new CustomException("Invalid old password", HttpStatus.UNAUTHORIZED);
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repository.save(currentUser);

        return new ChangePasswordResponse();
    }


    public SendEmailTokenResponse sendEmailToken(SendEmailTokenRequest request) throws MessagingException {
        Optional<User> existingUser = repository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            throw new CustomException("Email already exist!", HttpStatus.BAD_REQUEST);
        }

        String randomToken = generateRandomToken();
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime expiredAt = currentTime.plusMinutes(5);

        Optional<EmailToken> existingEmailToken = emailTokenRepository.findByEmail(request.getEmail());
        if (existingEmailToken.isPresent()) {
            if (existingEmailToken.get().getExpiredAt().isBefore(currentTime)) {
                existingEmailToken.get().setToken(randomToken);
                existingEmailToken.get().setExpiredAt(expiredAt);

                emailTokenRepository.save(existingEmailToken.get());
            } else {
                randomToken = existingEmailToken.get().getToken();
            }
        } else {
            emailTokenRepository.save(
                EmailToken.builder()
                    .email(request.getEmail())
                    .token(randomToken)
                    .expiredAt(expiredAt)
                    .build()
            );
        }

        if (Action.valueOf(request.getAction()) == Action.create) {
            emailService.sendTokenForNewEmail(request.getEmail(), randomToken);
        } else { // Action.update
            emailService.sendTokenForUpdateEmail(request.getEmail(), randomToken);
        }

        return new SendEmailTokenResponse();
    }

    public String generateRandomToken() {
        Random random = new Random();
        int tokenInt = random.nextInt(1000000); // Generates a random number between 0 and 999999
        return String.format("%06d", tokenInt);
    }

    public UpdateProfileResponse changeEmail(ChangeEmailRequest request) throws Exception {
        if (repository.existsByEmail(request.getEmail())) {
            throw new CustomException("Email already exists!", HttpStatus.BAD_REQUEST);
        }

        Optional<EmailToken> foundEmailToken =
            emailTokenRepository.findByEmailAndTokenAndExpiredAtAfter(
                request.getEmail(),
                request.getEmailToken(),
                LocalDateTime.now()
            );
        if (foundEmailToken.isEmpty()) {
            throw new CustomException("Email token is expired or invalid!", HttpStatus.BAD_REQUEST);
        }

        emailTokenRepository.delete(foundEmailToken.get());

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        User currentUser = repository.findByUsername(username).orElseThrow(
            () -> new Exception("User not found")
        );

        Passenger passenger = passengerRepository.findByUserIdAndIsUserIsTrue(currentUser.getId()).orElseThrow(
            () -> new Exception("Something wrong happen")
        );
        currentUser.setEmail(request.getEmail());
        passenger.setEmail(request.getEmail());

        repository.save(currentUser);
        passengerRepository.save(passenger);

        return UpdateProfileResponse.builder()
            .userResponse(
                UserResponse.builder()
                    .id(currentUser.getId())
                    .username(currentUser.getUsername())
                    .email(currentUser.getEmail())
                    .role(currentUser.getRole().toString())
                    .build()
            )
            .build();
    }
}
