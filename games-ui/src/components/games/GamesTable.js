import React from 'react'
import { Button, Image, Table } from 'semantic-ui-react'

function GamesTable({ games, handleDeleteMovie, handleEditMovie }) {
  const height = window.innerHeight - 100
  const style = {
    height: height,
    maxHeight: height,
    overflowY: 'auto',
    overflowX: 'hidden'
  }

  const movieList = games && games.map(movie => {
    return (
      <Table.Row key={movie.appId}>
        <Table.Cell collapsing>
          <Button
            circular
            color='red'
            size='small'
            icon='trash'
            onClick={() => handleDeleteMovie(movie)}
          />
          <Button
            circular
            color='orange'
            size='small'
            icon='edit'
            onClick={() => handleEditMovie(movie)}
          />
        </Table.Cell>
        <Table.Cell>{movie.appId}</Table.Cell>
        <Table.Cell>{movie.title}</Table.Cell>
        <Table.Cell>{movie.released}</Table.Cell>
        <Table.Cell>{movie.price}</Table.Cell>
        <Table.Cell>
          <Image size='tiny' src={movie.imgUrl ? movie.imgUrl : '/images/game-imgUrl.jpg'} rounded />
        </Table.Cell>
      </Table.Row>
    )
  })

  return (
    <div style={style}>
      <Table compact striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={2}/>
            <Table.HeaderCell width={2}>appId</Table.HeaderCell>
            <Table.HeaderCell width={4}>Title</Table.HeaderCell>
            <Table.HeaderCell width={3}>released</Table.HeaderCell>
            <Table.HeaderCell width={2}>price</Table.HeaderCell>
            <Table.HeaderCell width={3}>imgUrl</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {movieList}
        </Table.Body>
      </Table>
    </div>
  )
}

export default GamesTable
