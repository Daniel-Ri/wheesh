package com.daniel.wheesh.order;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ValidateArrivalTicketRequest {
    @NotNull(message = "Arrival Station Id should not be null")
    private Long arrivalStationId;

    @NotNull(message = "Ordered Seat Id should not be null")
    private Long orderedSeatId;

    @NotEmpty(message = "Secret should not be empty")
    private String secret;
}
