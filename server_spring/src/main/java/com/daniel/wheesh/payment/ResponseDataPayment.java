package com.daniel.wheesh.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataPayment {
    private Long id;
    private Long amount;
    private Boolean isPaid;
    private LocalDateTime duePayment;
}
