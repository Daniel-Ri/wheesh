package com.daniel.wheesh.order;

import com.daniel.wheesh.orderedseat.ResponseDataOrderedSeatWithOrder;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ValidateTicketResponse {
    @JsonProperty("data")
    private ResponseDataOrderedSeatWithOrder orderedSeat;
}
