package com.daniel.wheesh.banner;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class DeleteBannerResponse {
    private final String message = "Banner deleted successfully";
}
