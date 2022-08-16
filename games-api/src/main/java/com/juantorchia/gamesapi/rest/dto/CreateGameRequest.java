package com.juantorchia.gamesapi.rest.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CreateGameRequest {

    @Schema(example = "10")
    @NotBlank
    private String appId;

    @Schema(example = "Counter-Strike")
    @NotBlank
    private String title;

    @Schema(example = "1 Nov, 2000")
    @NotBlank
    private String released;

    @Schema(example = "8,19€")
    @NotBlank
    private String price;

    @Schema(example = "https://cdn.cloudflare.steamstatic.com/steam/apps/10/capsule_sm_120.jpg?t=1602535893")
    private String imgUrl;
}