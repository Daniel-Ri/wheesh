package com.daniel.wheesh.order;

import com.daniel.wheesh.orderedseat.ResponseDataOrderedSeatOnlyWithName;
import com.daniel.wheesh.payment.ResponseDataPayment;
import com.daniel.wheesh.schedule.ResponseDataScheduleWithoutAvailability;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataOrder {
    private Long id;
    private Long userId;
    private Long scheduleId;
    private Boolean isNotified;
    private LocalDateTime createdAt;

    @JsonProperty("Payment")
    private ResponseDataPayment payment;

    @JsonProperty("Schedule")
    private ResponseDataScheduleWithoutAvailability schedule;

    @JsonProperty("OrderedSeats")
    private List<ResponseDataOrderedSeatOnlyWithName> orderedSeats;
}
