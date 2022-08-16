import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Grid } from 'semantic-ui-react'
import { handleLogError } from '../misc/Helpers'
import { gamesApi } from '../misc/GamesApi'
import GameCard from '../home/GameCard'
import MovieComments from './MovieComments'
import MovieCommentForm from './MovieCommentForm'
import { withKeycloak } from '@react-keycloak/web'

class MovieDetail extends Component {
  state = {
    authenticated: false,
    movie: null,
    commentText: ''
  }

  async componentDidMount() {
    const appId = this.props.match.params.id
    const { authenticated } = this.props.keycloak

    this.setState({ authenticated })
    try {
      const response = await gamesApi.getMovie(appId)
      const movie = response.data
      this.setState({ movie })
    } catch (error) {
      handleLogError(error)
    }
  }

  handleChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  handleAddComment = async () => {
    const { commentText } = this.state
    if (!commentText) {
      return
    }

    const { keycloak } = this.props
    let { movie } = this.state
    const comment = { text: commentText }
    try {
      const response = await gamesApi.addMovieComment(movie.appId, comment, keycloak.token)
      movie = response.data
      this.setState({ movie, commentText: '' })
    } catch (error) {
      handleLogError(error)
    }
  }

  render() {
    const { authenticated, movie, commentText } = this.state
    return (
      !movie ? <></> : (
        <Container>
          <Grid columns={2} stackable>
            <Grid.Row>
              <Grid.Column width={5}>
                <GameCard movie={movie} link={false} />
              </Grid.Column>
              <Grid.Column width={11}>
                <MovieCommentForm
                  authenticated={authenticated}
                  commentText={commentText}
                  handleAddComment={this.handleAddComment}
                  handleChange={this.handleChange}
                />
                <MovieComments comments={movie.comments} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      )
    )
  }
}

export default withRouter(withKeycloak(MovieDetail))
