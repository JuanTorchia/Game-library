import React from 'react'
import {Form, Icon, Image, Segment, Table,} from 'semantic-ui-react'

function SearchStep({ searchText, isLoading, games, selectedMovie, handleChange, handleSearchgames, handleTableSelection }) {
  const movieList = games ? games.map(movie => {
    const active = movie && selectedMovie && movie.appId === selectedMovie.appId ? true : false
    return (
      <Table.Row  key={movie.appId} active={active} onClick={() => handleTableSelection(movie)}>
        <Table.Cell width={3}><Image src={movie.imgUrl} alt={movie.title} /></Table.Cell>
        <Table.Cell width={6}>{movie.title}</Table.Cell>
        <Table.Cell width={3}>{movie.price.replace(/ /g, '')}</Table.Cell>
        <Table.Cell width={2}>{movie.released}</Table.Cell>
        <Table.Cell><a href={movie.url}><Icon link name='steam'/></a></Table.Cell>
      </Table.Row>
    )
  }) : (<Table.Row>
    <Table.Cell></Table.Cell>
  </Table.Row>
    )
  return (
    <Segment loading={isLoading}>
      <Form onSubmit={handleSearchgames}>
        <Form.Group unstackable>
          <Form.Input
            placeholder='Search for a game title ...'
            id='searchText'
            value={searchText}
            onChange={handleChange}
            fluid
            width={12}
          />
          <Form.Button
            color='blue'
            content='Search'
            disabled={searchText.trim() === ''}
            fluid
            width={4}
          />
        </Form.Group>
      </Form>

      <Table compact selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Image</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Release Date</Table.HeaderCell>
            <Table.HeaderCell>Links</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body width={12}>
          {movieList}
        </Table.Body>
      </Table>
    </Segment>
  )
}

export default SearchStep
