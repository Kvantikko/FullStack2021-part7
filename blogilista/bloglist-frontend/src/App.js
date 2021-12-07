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
import { Navbar, Nav, Button } from 'react-bootstrap'


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
      if (exception.toString().includes('code 500')) {
        dispatch(setNotification(exception.toString() + ', username and password might be right but there is a problem with the server', 7, true))
      } else {
        dispatch(setNotification('Wrong username or password', 5, true))
      }
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
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


  const toggleBlogForm = () => {
    blogFormRef.current.toggleVisibility()
  }
  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div className="container">
        <h2 style={{ margin: 50 }} >Log in to application</h2>
        <Notification/>
        <LoginForm handleLogin={handleLogin}
          username={username} handleUsernameChange={setUsername}
          password={password} handlePasswordChange={setPassword}
        />
      </div>
    )
  }

  const headerStyle = {
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
    color: '#4682B4',
  }

  return (
    <div className="container">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link style={{ padding: 5 }} to="/blogs">blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={{ padding: 5 }} to="/users">users</Link>
            </Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Navbar.Text href="#" as="span">
              <em>{user.name} logged in</em>
            </Navbar.Text>
            <Button onClick={handleLogout} type="submit" style={{ marginLeft: 20 }}>logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <h1 style={headerStyle} >THE ULTIMATE BLOGS APP</h1>
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
            <BlogForm hideBlogForm={toggleBlogForm} />
          </Togglable>
          <BlogList/>
        </Route>
      </Switch>
    </div>
  )
}

export default App