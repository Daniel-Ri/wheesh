package com.daniel.wheesh.passenger;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/passenger")
public class PassengerController {
    private final PassengerService service;

    @GetMapping
    private ResponseEntity<PassengersResponse> getPassengers() throws Exception {
        return ResponseEntity.ok(service.getPassengers());
    }

    @GetMapping("/{passengerId}")
    private ResponseEntity<OnePassengerResponse> getOnePassenger(
        @PathVariable("passengerId") Long passengerId
    ) throws Exception {
        return ResponseEntity.ok(service.getOnePassenger(passengerId));
    }

    @PostMapping
    private ResponseEntity<OnePassengerResponse> createPassenger(
        @Valid @RequestBody CreatePassengerRequest request
    ) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createPassenger(request));
    }

    @PutMapping("/{passengerId}")
    private ResponseEntity<OnePassengerResponse> updatePassenger(
        @PathVariable("passengerId") Long passengerId, @Valid @RequestBody UpdatePassengerRequest request
    ) throws Exception {
        return ResponseEntity.ok(service.updatePassenger(passengerId, request));
    }

    @DeleteMapping("/{passengerId}")
    private ResponseEntity<DeletePassengerResponse> deletePassenger(
        @PathVariable("passengerId") Long passengerId
    ) throws Exception {
        return ResponseEntity.ok(service.deletePassenger(passengerId));
    }
}
