import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({
  handleLogin,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange
}) => {

  return (
    <form style={{ margin: 50 }} onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={username}
          onChange={({ target }) => handleUsernameChange(target.value)}
        />
        <Form.Label>password:</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={password}
          onChange={({ target }) => handlePasswordChange(target.value)}
        />
        <Button style={{ marginTop: 30 }} variant="primary" type="submit">
          login
        </Button>
      </Form.Group>
    </form>
  )

}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
}

export default LoginForm