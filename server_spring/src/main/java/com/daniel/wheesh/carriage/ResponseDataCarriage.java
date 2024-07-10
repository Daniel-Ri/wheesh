package com.daniel.wheesh.carriage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataCarriage {
    private Long id;
    private Long carriageNumber;
}
