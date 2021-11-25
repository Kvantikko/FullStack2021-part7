import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch, useHistory, Link } from 'react-router-dom'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import User from './components/User'
import Blog from './components/Blog'
import Users from './components/Users'
import blogService from './services/blogs'
import loginService from './services/login'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setUser } from './reducers/loggedUserReducer'
import { initializeUsers } from './reducers/userReducer'


const App = () => {
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  },[dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
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
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(setNotification('Wrong username or password', 5, true))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out')
    window.localStorage.clear()
    blogService.setToken(null)
    dispatch(setUser(null))
    history.push('/')
  }

  const match = useRouteMatch('/users/:id')
  const showUser = match
    ? users.find(user => user.id === match.params.id)
    : null

  const match2 = useRouteMatch('/blogs/:id')
  const showBlog = match2
    ? blogs.find(blog => blog.id === match2.params.id)
    : null


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
      <div>
        <Link style={{ padding: 5 }} to="/blogs">blogs</Link>
        <Link style={{ padding: 5 }} to="/users">users</Link>
        {user.name} logged in <button onClick={handleLogout} type="submit">logout</button>
      </div>
      <h2>Blogs App</h2>
      <Notification/>
      <p></p>
      <Switch>
        <Route path="/users/:id">
          <User user={showUser} showMore={true} />
        </Route>
        <Route path="/users">
          <Users users={users}/>
        </Route>
        <Route path="/blogs/:id">
          <Blog blog={showBlog} showMore={true}/>
        </Route>
        <Route path="/">
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm />
          </Togglable>
          <BlogList/>
        </Route>
      </Switch>
    </div>
  )
}

export default App