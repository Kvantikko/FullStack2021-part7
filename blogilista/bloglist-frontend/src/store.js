import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import blogReducer from './reducers/blogReducer.js'
import loggedUserReducer from './reducers/loggedUserReducer.js'
import notificationReducer from './reducers/notificationReducer.js'
import timerReducer from './reducers/timerReducer.js'
import userReducer from './reducers/userReducer.js'


const reducer = combineReducers({
  blogs: blogReducer,
  user: loggedUserReducer,
  users: userReducer,
  notification: notificationReducer,
  timer: timerReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store