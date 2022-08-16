package com.juantorchia.gamesapi.rest;

import com.juantorchia.gamesapi.mapper.GameMapper;
import com.juantorchia.gamesapi.model.Game;
import com.juantorchia.gamesapi.rest.dto.AddCommentRequest;
import com.juantorchia.gamesapi.rest.dto.CreateGameRequest;
import com.juantorchia.gamesapi.rest.dto.GameDto;
import com.juantorchia.gamesapi.rest.dto.UpdateGameRequest;
import com.juantorchia.gamesapi.service.GameService;
import com.juantorchia.gamesapi.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/games")
public class GamesController {

    private final GameService gameService;
    private final GameMapper gameMapper;

    @GetMapping
    public List<GameDto> getGames() {
        return gameService.getGames().stream()
                .map(gameMapper::toGameDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{appId}")
    public GameDto getGame(@PathVariable String appId) {
        Game game = gameService.validateAndGetGame(appId);
        return gameMapper.toGameDto(game);
    }

    @Operation(security = {@SecurityRequirement(name = SwaggerConfig.BEARER_KEY_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public GameDto createGame(@Valid @RequestBody CreateGameRequest createGameRequest) {
        Game game = gameMapper.toGame(createGameRequest);
        game = gameService.saveMovie(game);
        return gameMapper.toGameDto(game);
    }

    @Operation(security = {@SecurityRequirement(name = SwaggerConfig.BEARER_KEY_SECURITY_SCHEME)})
    @PutMapping("/{appId}")
    public GameDto updateMovie(@PathVariable String appId, @Valid @RequestBody UpdateGameRequest updateGameRequest) {
        Game game = gameService.validateAndGetGame(appId);
        gameMapper.updateGameFromDto(updateGameRequest, game);
        game = gameService.saveMovie(game);
        return gameMapper.toGameDto(game);
    }

    @Operation(security = {@SecurityRequirement(name = SwaggerConfig.BEARER_KEY_SECURITY_SCHEME)})
    @DeleteMapping("/{appId}")
    public GameDto deleteMovie(@PathVariable String appId) {
        Game game = gameService.validateAndGetGame(appId);
        gameService.deleteMovie(game);
        return gameMapper.toGameDto(game);
    }

    @Operation(security = {@SecurityRequirement(name = SwaggerConfig.BEARER_KEY_SECURITY_SCHEME)})
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/{appId}/comments")
    public GameDto addMovieComment(@PathVariable String appId, @Valid @RequestBody AddCommentRequest addCommentRequest, Principal principal) {
        Game game = gameService.validateAndGetGame(appId);
        Game.Comment comment = new Game.Comment(principal.getName(), addCommentRequest.getText(), LocalDateTime.now());
        game.getComments().add(0, comment);
        game = gameService.saveMovie(game);
        return gameMapper.toGameDto(game);
    }
}