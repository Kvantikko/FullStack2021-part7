const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const { response } = require('express')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
 
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})


test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  
  const titles = response.body.map(r => r.title)
  expect(titles).toContain(
    'Go To Statement Considered Harmful'
  )
})


test('returned blogs have a property named "id"', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => expect(blog.id).toBeDefined())
})


test('a valid blog can be added', async () => {
  const newBlog = {
    title: "This is a valid blog",
    author: "Kaka A. Masaka",
    url: "http://blog.totallysafeforwork.com",
    likes: 69,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)

  expect(titles).toContain(
    'This is a valid blog'
  )
})


test('if property "likes" is not given any value, value is zero', async () => {
  const newBlog = {
    title: "This blog doesn't have any likes",
    author: "Nobody L. Ikes",
    url: "http://blog.totallysafeforwork.com",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const newAddedBlog = blogsAtEnd[helper.initialBlogs.length]

  expect(newAddedBlog.likes).toBe(0)
})


test('if trying to add a blog without properties "title" or "url", responding with 400 Bad Request', async () => {
  const newBlog = {
    author: "No T. Itleorurl",
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})


test('deletion of a blog succeeds with status code 204 if id is valid', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(b => b.title)

  expect(titles).not.toContain(blogToDelete.title)
})


test('modifying blog likes is possible', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToModify = blogsAtStart[0]
  const likesAtStart = blogToModify.likes
  blogToModify.likes = blogToModify.likes + 1
  
  await api
    .put(`/api/blogs/${blogToModify.id}`)
    .send(blogToModify)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  const modifiedBlog = blogsAtEnd[0]

  expect(modifiedBlog.likes).not.toBe(likesAtStart)
})

test('only likes can be modified', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToModify = blogsAtStart[0]
  const likesAtStart = blogToModify.likes
  blogToModify.title = 'Hahaa höhöö'
  blogToModify.author = 'Yritän M. Uuttaa'
  blogToModify.url = 'Heh'
  blogToModify.likes = blogToModify.likes + 10
  
  await api
    .put(`/api/blogs/${blogToModify.id}`)
    .send(blogToModify)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  const modifiedBlog = blogsAtEnd[0]
  
  expect(modifiedBlog.title).not.toBe('Hahaa höhöö')
  expect(modifiedBlog.author).not.toBe('Yritän M. Uuttaa')
  expect(modifiedBlog.url).not.toBe('Heh')
  expect(modifiedBlog.likes).not.toBe(likesAtStart)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'hh',
      name: 'Heikki Heh',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain(
      `\`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3)`)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is not given', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      name: 'Heikki Heh',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('\`username\` is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'heke',
      name: 'Heikki Heh',
      password: 'ss',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    console.log(result.body.error);
    
    expect(result.body.error).toContain('password is not defined or password is shorter than 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if password is not given', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'heke',
      name: 'Heikki Heh'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    console.log(result.body.error);
    
    expect(result.body.error).toContain('password is not defined or password is shorter than 3 characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })
})


afterAll(() => {
  mongoose.connection.close()
  
})