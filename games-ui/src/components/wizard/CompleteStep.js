import React from 'react'
import { Card } from 'semantic-ui-react'
import GameCard from '../home/GameCard'

function CompleteStep({ movie }) {
    console.log(movie)
  return (
    <Card.Group doubling centered>
      <GameCard movie={movie} link={false} />
    </Card.Group>
  )
}

export default CompleteStep
