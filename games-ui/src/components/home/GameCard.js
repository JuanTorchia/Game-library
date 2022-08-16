import React from 'react'
import {Card, Icon, Image} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

function GameCard({ movie, link }) {
  const content = (
    <>
      <Image src={movie.imgUrl ? movie.imgUrl : '/images/game-imgUrl.jpg'} wrapped ui={false} />

      <Card.Content header>
        <Card.Header textAlign="center">{movie.title}</Card.Header>
      </Card.Content>
      <Card.Content content>
        <Card.Description>Precio: <strong>{movie.price}</strong></Card.Description>
        <Card.Meta>Release date: <strong>{movie.released}</strong></Card.Meta>

      </Card.Content>
        <Card.Content extra>
                <Icon name='user' />
                10 Friends
        </Card.Content>
    </>
  )
  return (
    !link ? <Card>{content}</Card> : <Card as={Link} to={`/games/${movie.appId}`}>{content}</Card>
  )
}

export default GameCard
