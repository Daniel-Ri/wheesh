package com.daniel.wheesh.order;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderedSeatRequest {
    @NotNull(message = "Seat Id should not be null")
    private Long seatId;

    @NotNull(message = "Passenger Id should not be null")
    private Long passengerId;
}
