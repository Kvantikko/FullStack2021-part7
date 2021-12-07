import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }

  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div style={{ textAlign: 'center' }}>
      <div id="togglableShow-button" style={hideWhenVisible}>
        <Button onClick={toggleVisibility} >{props.buttonLabel}</Button>
      </div>
      <div id="togglableHide-button" style={showWhenVisible}>
        {props.children}
        <Button variant="danger" onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable