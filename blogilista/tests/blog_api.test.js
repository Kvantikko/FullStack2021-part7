const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')


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


afterAll(() => {
  mongoose.connection.close()
  
})