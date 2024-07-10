package com.daniel.wheesh.passenger;

import com.daniel.wheesh.global.CustomException;
import com.daniel.wheesh.user.User;
import com.daniel.wheesh.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PassengerService {
    private final PassengerRepository passengerRepository;

    private final UserRepository userRepository;

    private User getCurrentUser() throws Exception {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userDetails.getUsername();

        return userRepository.findByUsername(username).orElseThrow(
            () -> new Exception("User not found")
        );
    }

    public PassengersResponse getPassengers() throws Exception {
        User currentUser = getCurrentUser();

        List<Passenger> passengers = passengerRepository.findByUserIdOrderById(currentUser.getId());

        List<ResponseDataPassenger> responseDataPassengers = passengers.stream()
            .map(passenger -> ResponseDataPassenger.builder()
                .id(passenger.getId())
                .userId(passenger.getUser().getId())
                .isUser(passenger.getIsUser())
                .gender(passenger.getGender())
                .dateOfBirth(passenger.getDateOfBirth())
                .idCard(passenger.getIdCard())
                .name(passenger.getName())
                .email(passenger.getEmail())
                .build())
            .toList();

        return PassengersResponse.builder()
            .passengers(responseDataPassengers)
            .build();
    }

    public OnePassengerResponse getOnePassenger(Long passengerId) throws Exception {
        Passenger passenger = passengerRepository.findById(passengerId).orElseThrow(() -> new CustomException(
            "Passenger Not Found", HttpStatus.NOT_FOUND));

        User currentUser = getCurrentUser();
        if (!currentUser.getId().equals(passenger.getUser().getId())) {
            throw new CustomException("Not Authorized", HttpStatus.BAD_REQUEST);
        }

        return OnePassengerResponse.builder()
            .passenger(ResponseDataPassenger.builder()
                .id(passenger.getId())
                .userId(passenger.getUser().getId())
                .isUser(passenger.getIsUser())
                .gender(passenger.getGender())
                .dateOfBirth(passenger.getDateOfBirth())
                .idCard(passenger.getIdCard())
                .name(passenger.getName())
                .email(passenger.getEmail())
                .build())
            .build();
    }

    public OnePassengerResponse createPassenger(CreatePassengerRequest request) throws Exception {
        User currentUser = getCurrentUser();
        Long count = passengerRepository.countByUserId(currentUser.getId());
        if (count >= 15) {
            throw new CustomException("You have reached the limit of creating passengers", HttpStatus.BAD_REQUEST);
        }

        var passenger = Passenger.builder()
            .user(currentUser)
            .isUser(false)
            .gender(Gender.valueOf(request.getGender()))
            .dateOfBirth(request.getDateOfBirth())
            .idCard(request.getIdCard())
            .name(request.getName())
            .email(request.getEmail())
            .build();
        passengerRepository.save(passenger);

        return OnePassengerResponse.builder()
            .passenger(ResponseDataPassenger.builder()
                .id(passenger.getId())
                .userId(passenger.getUser().getId())
                .isUser(passenger.getIsUser())
                .gender(passenger.getGender())
                .dateOfBirth(passenger.getDateOfBirth())
                .idCard(passenger.getIdCard())
                .name(passenger.getName())
                .email(passenger.getEmail())
                .build())
            .build();
    }

    public OnePassengerResponse updatePassenger(Long passengerId, UpdatePassengerRequest request) throws Exception {
        Passenger passenger = passengerRepository.findById(passengerId).orElseThrow(() -> new CustomException(
            "Passenger Not Found", HttpStatus.NOT_FOUND));

        User currentUser = getCurrentUser();
        if (!currentUser.getId().equals(passenger.getUser().getId())) {
            throw new CustomException("Not Authorized", HttpStatus.BAD_REQUEST);
        }

        if (passenger.getIsUser()) {
            throw new CustomException("You cannot change your data with this endpoint", HttpStatus.BAD_REQUEST);
        }

        if (request.getGender() != null) {
            passenger.setGender(Gender.valueOf(request.getGender()));
        }

        if (request.getDateOfBirth() != null) {
            passenger.setDateOfBirth(request.getDateOfBirth());
        }

        if (request.getIdCard() != null) {
            passenger.setIdCard(request.getIdCard());
        }

        if (request.getName() != null) {
            passenger.setName(request.getName());
        }

        if (request.getEmail() != null) {
            passenger.setEmail(request.getEmail());
        }

        passengerRepository.save(passenger);

        return OnePassengerResponse.builder()
            .passenger(ResponseDataPassenger.builder()
                .id(passenger.getId())
                .userId(passenger.getUser().getId())
                .isUser(passenger.getIsUser())
                .gender(passenger.getGender())
                .dateOfBirth(passenger.getDateOfBirth())
                .idCard(passenger.getIdCard())
                .name(passenger.getName())
                .email(passenger.getEmail())
                .build())
            .build();
    }

    public DeletePassengerResponse deletePassenger(Long passengerId) throws Exception {
        Passenger passenger = passengerRepository.findById(passengerId).orElseThrow(() -> new CustomException(
            "Passenger Not Found", HttpStatus.NOT_FOUND));

        User currentUser = getCurrentUser();
        if (!currentUser.getId().equals(passenger.getUser().getId())) {
            throw new CustomException("Not Authorized", HttpStatus.BAD_REQUEST);
        }

        if (passenger.getIsUser()) {
            throw new CustomException("You cannot delete your data with this endpoint", HttpStatus.BAD_REQUEST);
        }

        passengerRepository.deleteById(passengerId);

        return DeletePassengerResponse.builder()
            .message("Successfully delete %s".formatted(passenger.getName()))
            .build();
    }
}
