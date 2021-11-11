import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false) // notification color change

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => {
        return b.likes - a.likes
      }) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
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
      setUser(user)
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
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const addedBlog = await blogService.create(blogObject)
      handleSuccess(`a new blog ${addedBlog.title} by ${addedBlog.author} added`)
    } catch (exception) {
      handleError('blog creation failed')
    }
  }

  const likeBlog = async (blogObject) => {
    try {
      const likedBlog = await blogService.update(blogObject.id, blogObject)
      handleSuccess(`blog ${likedBlog.title} by ${likedBlog.author} liked`)
    } catch (exception) {
      handleError('blog liking failed')
    }
  }

  const deleteBlog = async (blogToDelete) => {
    try {
      await blogService.remove(blogToDelete.id)
      handleSuccess(`blog ${blogToDelete.title} by ${blogToDelete.author} deleted`)
    } catch (exception) {
      handleError('blog deletion failed')
    }
  }

  const handleSuccess = async (message) => {
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs.sort((a, b) => {
      return b.likes - a.likes
    }))
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleError = (message) => {
    setError(true)
    setMessage(message)
    setTimeout(() => {
      setError(false)
      setMessage(null)
    }, 5000)
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={message} error={error} />

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

      <Notification message={message} error={error} />

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