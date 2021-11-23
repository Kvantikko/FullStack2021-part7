import { setTimer } from '../reducers/timerReducer'

const notificationReducer = (state = { message: null, error: false }, action) => {

  switch (action.type) {
  case 'SET_NOTIFICATION':
    return {
      message: action.data.message,
      error: action.data.error
    }
  case 'RESET_NOTIFICATION':
    return {
      message: action.data.message,
      error: action.data.error
    }
  default:
    return state
  }
}

export const setNotification = (message, time, error) => {
  return async dispatch => {
    const timer = setTimeout(() => {
      dispatch(dismissNotification())
      dispatch(setTimer(null))
    }, time * 1000)
    dispatch(setTimer(timer))

    dispatch({
      type: 'SET_NOTIFICATION',
      data: { message, error }
    })
  }
}

export const dismissNotification = () => {
  return {
    type: 'RESET_NOTIFICATION',
    data: { message: null, error: false }
  }
}
export default notificationReducer