package com.juantorchia.gamesapi.mapper;

import com.juantorchia.gamesapi.model.Game;
import com.juantorchia.gamesapi.rest.dto.CreateGameRequest;
import com.juantorchia.gamesapi.rest.dto.GameDto;
import com.juantorchia.gamesapi.rest.dto.UpdateGameRequest;
import com.juantorchia.gamesapi.service.UserExtraService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = UserExtraService.class
)
public abstract class GameMapper {

    @Autowired
    protected UserExtraService userExtraService;

    @Mapping(target = "comments", ignore = true)
    public abstract Game toGame(CreateGameRequest createGameRequest);

    @Mapping(target = "appId", ignore = true)
    @Mapping(target = "comments", ignore = true)
    public abstract void updateGameFromDto(UpdateGameRequest updateGameRequest, @MappingTarget Game game);

    public abstract GameDto toGameDto(Game game);

    @Mapping(
            target = "avatar",
            expression = "java( userExtraService.getUserExtra(comment.getUsername()).isPresent() ? userExtraService.getUserExtra(comment.getUsername()).get().getAvatar() : comment.getUsername() )"
    )
    public abstract GameDto.CommentDto toGameDtoCommentDto(Game.Comment comment);
}