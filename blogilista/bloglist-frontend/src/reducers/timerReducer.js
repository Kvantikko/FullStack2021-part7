const timerReducer = (state = null, action) => {
  switch(action.type) {
  case 'SET_TIMER':
    clearTimeout(state)
    return action.data
  default:
    return state
  }
}

export const setTimer = (timer) => {
  return {
    type: 'SET_TIMER',
    data: timer
  }
}

export default timerReducer