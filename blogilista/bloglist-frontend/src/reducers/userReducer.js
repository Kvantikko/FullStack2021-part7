import userService from '../services/users'

const userReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USERS': {
    return action.data
  }
  case 'ADD_BLOG': {
    const userToUpdate = state.find(u => u.id === action.data.user.id)
    const blogToAdd = {
      title: action.data.title,
      author: action.data.author,
      url: action.data.url,
      id: action.data.id
    }
    userToUpdate.blogs = userToUpdate.blogs.concat(blogToAdd)
    return state.map(user =>
      user.id !== action.data.user.id ? user : userToUpdate)
  }
  case 'REMOVE_BLOG': {
    const userToUpdate = state.find(u => u.id === action.data.user.id)
    userToUpdate.blogs = userToUpdate.blogs.filter(b => b.id !== action.data.id)
    return state.map(user =>
      user.id !== action.data.user.id ? user : userToUpdate)
  }
  default: {
    return state
  }
  }
}

export const initializeUsers = () => {
  return async dispatch => {
    try {
      const users = await userService.getAll()
      dispatch({
        type: 'INIT_USERS',
        data: users
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export const addBlogToUser = (blog) => {
  return async dispatch => {
    try {
      dispatch({
        type: 'ADD_BLOG',
        data: blog
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export const removeBlogFromUser = (blog) => {
  return async dispatch => {
    try {
      dispatch({
        type: 'REMOVE_BLOG',
        data: blog
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export default userReducer