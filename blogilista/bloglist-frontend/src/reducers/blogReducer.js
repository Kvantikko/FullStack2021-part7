import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return sort(action.data)
  case 'LIKE':
    return sort(
      state.map(blog =>
        blog.id !== action.data.id ? blog : action.data)
    )
  case 'NEW_BLOG':
    return state.concat(action.data)
  case 'DELETE_BLOG':
    return state.filter(blog =>
      blog.id !== action.data.id)
  default:
    return state
  }
}

const sort = array =>
  array.sort((a, b) => {
    return b.likes - a.likes
  })

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const like = (blogObject) => {
  return async dispatch => {
    const blogObjectReformed = { ...blogObject, likes: blogObject.likes + 1, user: blogObject.user.id }
    const updatedBlog = await blogService.update(blogObjectReformed.id, blogObjectReformed)
    dispatch({
      type:'LIKE',
      data: updatedBlog
    })
  }
}

export const create = (blogObject) => {
  return async dispatch => {
    const newBlog = await blogService.createNew(blogObject)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const remove = (blogObject) => {
  return async dispatch => {
    const deletedBlog = await blogService.remove(blogObject.id)
    dispatch({
      type: 'DELETE_BLOG',
      data: deletedBlog
    })
  }
}

export default blogReducer