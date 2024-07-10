package com.daniel.wheesh.order;

import com.daniel.wheesh.constraints.UniqueSeatId;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequest {
    @NotNull(message = "Schedule Id should not be null")
    private Long scheduleId;

    @Valid
    @NotEmpty(message = "Ordered Seats should not be empty")
    @UniqueSeatId
    private List<CreateOrderedSeatRequest> orderedSeats;
}
