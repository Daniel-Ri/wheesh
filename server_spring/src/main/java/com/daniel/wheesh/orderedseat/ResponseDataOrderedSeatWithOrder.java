package com.daniel.wheesh.orderedseat;

import com.daniel.wheesh.order.ResponseDataOrderWithScheduleOnly;
import com.daniel.wheesh.passenger.Gender;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataOrderedSeatWithOrder {
    private Long id;
    private Long price;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String idCard;
    private String name;
    private String email;

    @JsonProperty("Order")
    private ResponseDataOrderWithScheduleOnly order;
}
