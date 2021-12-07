import { React, useState } from 'react'
import { create } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { Form, Button, Row, Col } from 'react-bootstrap'


const BlogForm = ({ hideBlogForm }) => {
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
    dispatch(create(blog, hideBlogForm))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <Button style={{ marginBottom: 15 }} variant="success" type="submit">
          create new
        </Button>
        <Form.Group as={Row} className="mb-3" >
          <Form.Label column sm={2} >Title</Form.Label>
          <Col sm={8}>
            <Form.Control
              id='title'
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" >
          <Form.Label column sm={2} >Author</Form.Label>
          <Col sm={8}>
            <Form.Control
              id='author'
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" >
          <Form.Label column sm={2} >Url</Form.Label>
          <Col sm={8}>
            <Form.Control
              id='url'
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </Col>
        </Form.Group>
      </form>
    </div>
  )

}

export default BlogForm