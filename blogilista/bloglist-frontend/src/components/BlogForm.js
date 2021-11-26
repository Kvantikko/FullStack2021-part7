import { React, useState } from 'react'
import { create } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
//import { Form, Button } from 'react-bootstrap'


const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    const blog = {
      title: title,
      author: author,
      url: url
    }
    dispatch(create(blog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form id='onSubmit' onSubmit={addBlog}>
        <div>
        title:
          <input
            id='title'
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
        author:
          <input
            id='author'
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
        url:
          <input
            id='url'
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id="submitBlog" type="submit">create</button>
      </form>
    </div>
  )
  /*
  return (
    <form onSubmit={addBlog}>
      <Form.Group>
        <Form.Label>title</Form.Label>
        <Form.Control
          id='title'
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <Form.Label>author</Form.Label>
        <Form.Control
          id='author'
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <Form.Label>url</Form.Label>
        <Form.Control
          id='url'
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button variant="primary" type="submit">
          login
        </Button>
      </Form.Group>
    </form>
  )
  */


}

export default BlogForm