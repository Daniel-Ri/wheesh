package com.daniel.wheesh.order;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DeleteOrderResponse {
    private final String message = "Successfully cancel the order";
}
