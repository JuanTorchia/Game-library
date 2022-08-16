package com.juantorchia.gamesapi.service;

import com.juantorchia.gamesapi.exception.GameNotFoundException;
import com.juantorchia.gamesapi.model.Game;
import com.juantorchia.gamesapi.repository.GameRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
@Service
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;

    @Override
    public Game validateAndGetGame(String appId) {
        return gameRepository.findById(appId).orElseThrow(() -> new GameNotFoundException(appId));
    }

    @Override
    public List<Game> getGames() {
        return gameRepository.findAll();
    }

    @Override
    public Game saveMovie(Game game) {
        return gameRepository.save(game);
    }

    @Override
    public void deleteMovie(Game game) {
        gameRepository.delete(game);
    }
}