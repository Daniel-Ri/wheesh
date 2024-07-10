package com.daniel.wheesh.banner;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDataBanner {
    private Long id;
    private String imageDesktop;
    private String imageMobile;
}
