import React from 'react'
import { Card, Header, Segment } from 'semantic-ui-react'
import GameCard from './GameCard'

function GameList({ games }) {
  const movieList = games.map(movie => <GameCard key={movie.appId} movie={movie} link={true} />)

  return (
    games.length > 0 ? (
      <Card.Group doubling centered>
        {movieList}
      </Card.Group >
    ) : (
        <Segment padded color='blue'>
          <Header textAlign='center' as='h4'>No games</Header>
        </Segment>
      )
  )
}

export default GameList
