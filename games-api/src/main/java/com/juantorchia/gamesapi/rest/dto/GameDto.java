package com.juantorchia.gamesapi.rest.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class GameDto {

    private String appId;
    private String title;
    private String released;
    private String price;
    private String imgUrl;
    private List<CommentDto> comments;

    @Data
    public static class CommentDto {
        private String username;
        private String avatar;
        private String text;
        private LocalDateTime timestamp;
    }
}