import React, { Component } from 'react'
import { withKeycloak } from '@react-keycloak/web'
import { Container, Grid, Header, Segment, Icon, Divider } from 'semantic-ui-react'
import { handleLogError } from '../misc/Helpers'
import { gamesApi } from '../misc/GamesApi'
import GamesForm from './GamesForm'
import GamesTable from './GamesTable'
import { isAdmin } from '../misc/Helpers'
import { Redirect } from 'react-router-dom'
import ConfirmationModal from '../misc/ConfirmationModal'

class GamesPage extends Component {
  formInitialState = {
    appId: '',
    title: '',
    released: '',
    price: '',
    imgUrl: '',

    appIdError: false,
    titleError: false,
    releasedError: false,
    priceError: false
  }

  modalInitialState = {
    isOpen: false,
    header: '',
    content: '',
    onAction: null,
    onClose: null
  }

  state = {
    games: [],
    form: { ...this.formInitialState },
    modal: { ...this.modalInitialState },
    deleteMovie: null,
  }

  async componentDidMount() {
    this.handleGetgames()
  }

  handleChange = (e) => {
    const { id, value } = e.target
    const form = { ...this.state.form }
    form[id] = value
    this.setState({ form })
  }

  handleGetgames = async () => {
    try {
      const response = await gamesApi.getgames()
      const games = response.data
      this.setState({ games })
    } catch (error) {
      handleLogError(error)
    }
  }

  handleSaveMovie = async () => {
    if (!this.isValidForm()) {
      return
    }

    const { keycloak } = this.props
    const { appId, title, released, price, imgUrl } = this.state.form
    
    const movie = { appId, title, released, price, imgUrl }
    try {
      await gamesApi.saveMovie(movie, keycloak.token)
      this.clearForm()
      this.handleGetgames()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleDeleteMovie = (movie) => {
    const modal = {
      isOpen: true,
      header: 'Delete Game ' + movie.title,
      content: `Would you like to delete game '${movie.title}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({ modal, deleteMovie: movie })
    // The deletion is done in handleActionModal function
  }

  handleEditMovie = (movie) => {
    const form = {
      appId: movie.appId,
      title: movie.title,
      released: movie.released,
      price: movie.price,
      imgUrl: movie.imgUrl,
      appIdError: false,
      titleError: false,
      releasedError: false,
      priceError: false
    }
    this.setState({ form })
  }

  clearForm = () => {
    this.setState({ form: { ...this.formInitialState } })
  }

  isValidForm = () => {
    const form = { ...this.state.form }
    const appIdError = form.appId.trim() === ''
    const titleError = form.title.trim() === ''
    const releasedError = form.released.trim() === ''
    const priceError = form.price.trim() === ''

    form.appIdError = appIdError
    form.titleError = titleError
    form.releasedError = releasedError
    form.priceError = priceError

    this.setState({ form })
    return (appIdError || titleError || releasedError || priceError) ? false : true
  }

  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props
      const { deleteMovie } = this.state

      try {
        await gamesApi.deleteMovie(deleteMovie.appId, keycloak.token)
        this.handleGetgames()
      } catch (error) {
        handleLogError(error)
      }
    }
    this.setState({ modal: { ...this.modalInitialState } })
  }

  handleCloseModal = () => {
    this.setState({ modal: { ...this.modalInitialState } })
  }

  render() {
    const { keycloak } = this.props
    if (!isAdmin(keycloak)) {
      return <Redirect to='/' />
    }

    const { games, form, modal } = this.state
    return (
      <Container>
        <Grid>
          <Grid.Column mobile={16} tablet={16} computer={4}>
            <Segment>
              <Header as='h2'>
                <Icon name='game' />
                <Header.Content>Games</Header.Content>
              </Header>
              <Divider />
              <GamesForm
                form={form}
                handleChange={this.handleChange}
                handleSaveMovie={this.handleSaveMovie}
                clearForm={this.clearForm}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={12}>
            <GamesTable
              games={games}
              handleDeleteMovie={this.handleDeleteMovie}
              handleEditMovie={this.handleEditMovie}
            />
          </Grid.Column>
        </Grid>

        <ConfirmationModal modal={modal} />
      </Container>
    )
  }
}

export default withKeycloak(GamesPage)
