import React, { Component } from 'react'
import { withKeycloak } from '@react-keycloak/web'
import { Button, Container, Grid, Icon, Step, Divider } from 'semantic-ui-react'
import { handleLogError } from '../misc/Helpers'
import { gamesApi } from '../misc/GamesApi'
import { rapidAPI } from '../misc/RapidAPI'
import CompleteStep from './CompleteStep'
import FormStep from './FormStep'
import SearchStep from './SearchStep'
import { Redirect } from 'react-router-dom'
import { isAdmin } from '../misc/Helpers'

class GameWizard extends Component {
  state = {
    step: 1,

    // Search Step
    isLoading: false,
    searchText: '',
    games: [],
    selectedMovie: null,

    // Form Step
    appId: '',
    title: '',
    released: '',
    price: '',
    imageUrl: '',
    appIdError: false,
    titleError: false,
    releasedError: false,
    priceError: false
  }

  handlePreviousStep = () => {
    let { step, appIdError, titleError, releasedError, priceError, imgUrlError } = this.state

    if (step === 2) {
      appIdError = false
      titleError = false
      releasedError = false
      priceError = false
      imgUrlError = false
    }

    step = step > 1 ? step - 1 : step
    this.setState({ step, appIdError, titleError, releasedError, priceError, imgUrlError })
  }

  handleNextStep = () => {
    let { step } = this.state

    if (step === 2 && !this.isValidForm()) {
      return
    }

    step = step < 3 ? step + 1 : step
    this.setState({ step })
  }

  handleChange = (e) => {
    const { id, value } = e.target
    this.setState({ [id]: value })
  }

  handleTableSelection = (movie) => {
    const { selectedMovie } = this.state

    if (movie && selectedMovie && movie.appId === selectedMovie.appId) {
      this.setState({
        selectedMovie: null,
        appId: '',
        title: '',
        price: '',
        released: '',
        imgUrl: ''
      })
    } else {
      this.setState({
        selectedMovie: movie,
        appId: movie.appId,
        title: movie.title,
        price: movie.price,
        released: movie.released,
        imgUrl: movie.imgUrl
      })
    }
  }

  handleSearchgames = async () => {
    this.setState({ isLoading: true })
    const {searchText} = this.state

    try {
      const response = await rapidAPI.getgames(searchText)
      console.log(response)
      const getResponse = response
      let games = getResponse

        this.setState({ games, isLoading: false })
    } catch (error) {
      handleLogError(error)
    }
  }

  handleCreateMovie = async () => {
    const { keycloak } = this.props
    const { appId, title, released, price, imgUrl } = this.state

    const movie = { appId, title, released, price, imgUrl }
    try {
      const movieToArray = JSON.stringify(movie)
      console.log(movieToArray)
      await gamesApi.saveMovie(movieToArray, keycloak.token)
      this.props.history.push("/home")
    } catch (error) {
      handleLogError(error)
    }
  }

  isValidForm = () => {
    const {appId, title, price, released, imgUrl} = this.state

    const appIdError = appId.trim() === ''
    const titleError = title.trim() === ''
    const releasedError = price.trim() === ''
    const priceError = released.trim() === ''
    const imgUrlError = imgUrl.trim() === ''

    this.setState({ appIdError, titleError, releasedError, priceError, imgUrlError })
    return (appIdError || titleError || releasedError || priceError || imgUrlError) ? false : true
  }

  getContent = () => {
    const { step } = this.state

    let stepContent = null
    if (step === 1) {
      const { isLoading, searchText, games, selectedMovie } = this.state
      stepContent = (
        <SearchStep
          searchText={searchText}
          isLoading={isLoading}
          games={games}
          selectedMovie={selectedMovie}
          handleChange={this.handleChange}
          handleSearchgames={this.handleSearchgames}
          handleTableSelection={this.handleTableSelection}
        />
      )
    } else if (step === 2) {
      const { appId,title, imgUrl, price, released, appIdError, titleError, releasedError, priceError, imgUrlError } = this.state
      stepContent = (
        <FormStep
          appId={appId}
          imgUrl={imgUrl}
          title={title}
          price={price}
          released={released}
          appIdError={appIdError}
          titleError={titleError}
          releasedError={releasedError}
          priceError={priceError}
          imgUrlError={imgUrlError}
          handleChange={this.handleChange}
        />
      )
    } else if (step === 3) {
      const { appId, title, price, released, imgUrl } = this.state
      const movie = { appId, title, price, released, imgUrl }
      stepContent = (
        <CompleteStep movie={movie} />
      )
    }

    return (
      <Container>
        <Grid columns={2}>
          <Grid.Column mobile={16} tablet={4} computer={4}>
            <Step.Group fluid vertical >
              <Step active={step === 1}>
                <Icon name='search' />
                <Step.Content>
                  <Step.Title>Search</Step.Title>
                  <Step.Description>Search game</Step.Description>
                </Step.Content>
              </Step>

              <Step active={step === 2}>
                <Icon name='game' />
                <Step.Content>
                  <Step.Title>Game</Step.Title>
                  <Step.Description>Game Form</Step.Description>
                </Step.Content>
              </Step>

              <Step active={step === 3}>
                <Icon name='flag checkered' />
                <Step.Content>
                  <Step.Title>Complete</Step.Title>
                  <Step.Description>Preview and complete</Step.Description>
                </Step.Content>
              </Step>
            </Step.Group>

            <Button.Group fluid>
              <Button
                disabled={step === 1}
                onClick={this.handlePreviousStep}>Back</Button>
              <Button.Or />
              <Button
                positive
                disabled={step === 3}
                onClick={this.handleNextStep}>Next</Button>
            </Button.Group>

            {step === 3 && (
              <>
                <Divider />
                <Button fluid color='blue' onClick={this.handleCreateMovie}>Create</Button>
              </>
            )}
          </Grid.Column>
          <Grid.Column mobile={16} tablet={12} computer={12}>
            {stepContent}
          </Grid.Column>
        </Grid>
      </Container>
    )
  }

  render() {
    const { keycloak } = this.props
    return keycloak && keycloak.authenticated && isAdmin(keycloak) ? this.getContent() : <Redirect to='/' />
  }
}

export default withKeycloak(GameWizard)
