const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }).populate('comments', { content: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user
  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0, // body.likes === undefined ? 0 : body.likes
      user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  const savedUser = await user.save()
  
  // reformatting the response to include user.username and user.name 
  const { blogs, ...rest } = savedUser.toJSON();
  const responseBlog = { ...savedBlog.toJSON(), user: rest }

  response.json(responseBlog)
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  console.log('IN ROUTER COMMENTS')
  
  const blog = await Blog.findById(request.params.id)
  
  
  
  console.log('REQUEST ', request.body)
  console.log('BLOG', blog)
  
  const comment = new Comment({
    content: request.body.content,
    blog: request.params.id
  })



  console.log('COMMENT', comment)
  

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()
  
  response.json(savedComment)
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  
  if (blog.user === undefined || !(blog.user.toString() === request.user._id.toString()) ) {
    response.status(401).json({ 
      error: 'you are not authorized to delete this blog'
    })  
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter