import React from 'react'
import {Form, Image, Segment} from 'semantic-ui-react'

function FormStep({ appId,title, imgUrl, price, released, appIdError, titleError, releasedError, priceError, imgUrlError, handleChange }) {
  return (
    <Segment>
      <Form>
        <Form.Input
          label='Steam ID'
          id='appId'
          onChange={handleChange}
          value={appId}
          error={appIdError}
        />
        <Form.Input
          fluid
          label='Title'
          id='title'
          onChange={handleChange}
          value={title}
          error={titleError}
        />
        <Form.Input
          fluid
          label='Price'
          id='price'
          onChange={handleChange}
          value={price.replace(/ /g, '')}
          error={releasedError}
        />
        <Form.Input
          label='Released Date'
          id='released'
          onChange={handleChange}
          value={released}
          error={priceError}
        />
        <Form.Input
            label='imgUrl'
            id='imgUrl'
            onChange={handleChange}
            value={imgUrl}
            error={imgUrlError}
        />
      </Form>
    </Segment>
  )
}

export default FormStep
