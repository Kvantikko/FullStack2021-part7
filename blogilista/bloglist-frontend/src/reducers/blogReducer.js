import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS':
    return sort(action.data)
  case 'LIKE':
    return sort(
      state.map(blog =>
        blog.id !== action.data.id ? blog : { ...blog, likes: action.data.likes })
    )
  case 'COMMENT':
    return state.map(blog =>
      blog.id !== action.data.blog ? blog : { ...blog, comments: blog.comments.concat(action.data) })
  case 'NEW_BLOG':
    return state.concat(action.data)
  case 'DELETE_BLOG':
    return state.filter(blog =>
      blog.id !== action.data)
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
    try {
      const blogs = await blogService.getAll()
      dispatch({
        type: 'INIT_BLOGS',
        data: blogs
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export const like = (blogObject) => {
  return async dispatch => {
    try {
      const blogObjectReformed = {
        ...blogObject,
        likes: blogObject.likes + 1,
        user: blogObject.user.id,
        comments: blogObject.comments.map(c => c.id)
      }
      const updatedBlog = await blogService.update(blogObjectReformed.id, blogObjectReformed)
      dispatch(setNotification(`Blog ${updatedBlog.title} by ${updatedBlog.author} liked!`, 5, false))
      dispatch({
        type:'LIKE',
        data: updatedBlog
      })
    } catch(error) {
      console.log(error)
      dispatch(setNotification(`Blog liking failed. ${error}`, 5, true))
    }
  }
}

export const newComment = (comment, blogObject) => {
  console.log('OBJECT ', blogObject )
  console.log('COMMENT ', comment)


  return async dispatch => {
    try {
      const addedComment =  await blogService.comment(blogObject.id, { content: comment, blog: blogObject.id })
      console.log('RESPONSE ',addedComment)


      dispatch(setNotification(`Blog ${blogObject.title} by ${blogObject.author} commented!`, 5, false))
      dispatch({
        type:'COMMENT',
        data: addedComment
      })

    } catch(error) {
      console.log(error)
      dispatch(setNotification(`Blog commenting failed. ${error}. Did you try to send a blank comment?`, 5, true))
    }
  }
}

export const create = (blogObject) => {
  return async dispatch => {
    try {
      const newBlog = await blogService.createNew(blogObject)
      dispatch(setNotification(`New blog ${newBlog.title} created!`, 5, false))
      dispatch({
        type:'NEW_BLOG',
        data: newBlog
      })
    } catch(error) {
      console.log(error)
      dispatch(setNotification(`Blog creation failed. ${error}. Title, author and url are required!`, 5, true))
    }
  }
}

export const remove = (blogObject) => {
  return async dispatch => {
    try {
      await blogService.remove(blogObject.id)
      dispatch(setNotification(`Blog ${blogObject.title} deleted!`, 5, false))
      dispatch({
        type: 'DELETE_BLOG',
        data: blogObject.id
      })
    } catch (error) {
      console.log(error)
      dispatch(setNotification(`Blog deletion failed. ${error}`, 5, true))
    }
  }
}

export default blogReducer