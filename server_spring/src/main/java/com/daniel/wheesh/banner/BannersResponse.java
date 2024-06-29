package com.daniel.wheesh.banner;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BannersResponse {
    @JsonProperty("data")
    private List<ResponseDataBanner> banners;
}
