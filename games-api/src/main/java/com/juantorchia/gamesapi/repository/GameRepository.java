package com.juantorchia.gamesapi.repository;

import com.juantorchia.gamesapi.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends MongoRepository<Game, String> {
}