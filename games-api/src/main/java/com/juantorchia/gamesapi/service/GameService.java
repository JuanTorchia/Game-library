package com.juantorchia.gamesapi.service;

import com.juantorchia.gamesapi.model.Game;

import java.util.List;

public interface GameService {

    Game validateAndGetGame(String appId);

    List<Game> getGames();

    Game saveMovie(Game game);

    void deleteMovie(Game game);
}