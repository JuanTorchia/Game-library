import React from 'react'
import { Button, Form } from 'semantic-ui-react'

function GamesForm({ form, handleChange, handleSaveMovie, clearForm }) {
  return (
    <Form>
      <Form.Input
        fluid
        label='appId *'
        id='appId'
        onChange={handleChange}
        value={form.appId}
        error={form.appIdError}
      />
      <Form.Input
        fluid
        label='Title *'
        id='title'
        onChange={handleChange}
        value={form.title}
        error={form.titleError}
      />
      <Form.Input
        fluid
        label='released *'
        id='released'
        onChange={handleChange}
        value={form.released}
        error={form.releasedError}
      />
      <Form.Input
        fluid
        label='price *'
        id='price'
        onChange={handleChange}
        value={form.price}
        error={form.priceError}
      />
      <Form.Input
        fluid
        label='imgUrl'
        id='imgUrl'
        onChange={handleChange}
        value={form.imgUrl}
      />
      <Button.Group fluid>
        <Button onClick={clearForm}>Cancel</Button>
        <Button.Or />
        <Button positive onClick={handleSaveMovie}>Save</Button>
      </Button.Group>
    </Form>
  )
}

export default GamesForm
