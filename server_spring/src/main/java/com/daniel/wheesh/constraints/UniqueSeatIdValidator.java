package com.daniel.wheesh.constraints;

import com.daniel.wheesh.order.CreateOrderedSeatRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class UniqueSeatIdValidator implements ConstraintValidator<UniqueSeatId, List<CreateOrderedSeatRequest>> {

    @Override
    public boolean isValid(List<CreateOrderedSeatRequest> orderedSeats, ConstraintValidatorContext context) {
        if (orderedSeats == null) {
            return true; // Null values should be handled by @NotEmpty
        }

        Set<Long> seatIds = new HashSet<>();
        for (CreateOrderedSeatRequest orderedSeat : orderedSeats) {
            if (!seatIds.add(orderedSeat.getSeatId())) {
                return false; // Duplicate seatId found
            }
        }

        return true;
    }
}
