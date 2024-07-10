package com.daniel.wheesh.order;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateOrderResponse {
    private final String message = "Successfully paid the order";
}
