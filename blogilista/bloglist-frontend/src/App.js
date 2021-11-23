import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, like, create, remove } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

import { useDispatch, useSelector } from 'react-redux'
import store from './store'

const App = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(initializeBlogs())
  },[dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      store.dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      store.dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleError('wrong username or password')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out')
    window.localStorage.clear()
    blogService.setToken(null)
    store.dispatch(setUser(null))
  }

  const addBlog = (blogObject) => {
    dispatch(create(blogObject))
      .then(() => handleSuccess(`New blog ${blogObject.title} created!`))
      .catch((error) => handleError(`Blog creation failed! ${error.toString()}`))
  }

  const likeBlog = (blogObject) => {
    dispatch(like(blogObject))
      .then(() => handleSuccess(`Blog ${blogObject.title} by ${blogObject.author} liked!`))
      .catch((error) => handleError(`Blog liking failed! ${error.toString()}`))
  }

  const deleteBlog = async (blogObjectToDelete) => {
    dispatch(remove(blogObjectToDelete))
      .then(() => handleSuccess(`Blog ${blogObjectToDelete.title} by ${blogObjectToDelete.author} deleted!`))
      .catch((error) => handleError(`Blog deletion failed! ${error.toString()}`))
  }

  const handleSuccess = async (message) => {
    dispatch(initializeBlogs())
    dispatch(setNotification(message, 5, false))
  }

  const handleError = (message) => {
    dispatch(setNotification(message, 5, true))
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification/>

        <LoginForm handleLogin={handleLogin}
          username={username} handleUsernameChange={setUsername}
          password={password} handlePasswordChange={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification/>

      {user.name} logged in
      <button onClick={handleLogout} type="submit">logout</button>
      <p></p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} updateLikes={likeBlog} removeBlog={deleteBlog} />
      )}
    </div>
  )
}

export default App