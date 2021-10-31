const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { error } = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
  
  /*
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
  */
})
  
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  response.json(savedBlog.toJSON())
  
  /*
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  response.json(savedBlog.toJSON())
  
  /*
  const blog = new Blog(request.body)
  blog
      .save()
      .then(result => {
      response.status(201).json(result)
      })
  */
})

module.exports = blogsRouter