import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import { handleLogError } from '../misc/Helpers'
import { gamesApi } from '../misc/GamesApi'
import GameList from './GameList'

class Home extends Component {
  state = {
    isLoading: false,
    games: []
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    try {
      const response = await gamesApi.getgames()
      const games = response.data
      this.setState({ games, isLoading: false })
    } catch (error) {
      handleLogError(error)
    }
  }

  render() {
    const { isLoading, games } = this.state
    return (
      isLoading ? <></> : (
        <Container>
          <GameList games={games} />
        </Container>
      )
    )
  }
}

export default Home
