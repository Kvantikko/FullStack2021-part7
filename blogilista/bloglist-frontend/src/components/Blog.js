import { React, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { like, newComment, remove } from '../reducers/blogReducer'
import { Link, useHistory } from 'react-router-dom'

const Blog = ({ blog, showMore }) => {
  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: showMore ? null : 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const addLike = (event) => {
    event.preventDefault()
    dispatch(like(blog))
  }

  const addComment = (event) => {
    event.preventDefault()
    dispatch(newComment(comment, blog))
    setComment('')
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Removing blog ${blog.title} by ${blog.author}`)) {
      dispatch(remove(blog))
      history.push('/blogs')
    }
  }

  const renderComments = () => {
    if(blog.comments.length === 0) {
      return null
    }

    return(
      <div style={{ paddingLeft: 15 }}>
        {blog.comments.map(comment =>
          <li key={comment.id} >{comment.content}</li>
        )}
      </div>
    )
  }

  const removeButton = () => {
    if (blog.user.username !== user.username) {
      return null
    } else {
      return(
        <button id="remove-button" onClick={deleteBlog}>remove</button>
      )
    }
  }

  if (showMore) {
    if(blog === undefined) {
      return null
    }

    return(
      <div className='blogShowMore' style={blogStyle}>
        <h2>{blog.title} | {blog.author}</h2>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div id="likes">
          likes: {blog.likes} <button id="like-button" onClick={addLike}>like</button>
        </div>
        <div>
          added by {blog.user.name}
        </div>
        <div>
          {removeButton()}
        </div>
        <h3>comments</h3>
        <div>
          <form id='onSubmit' onSubmit={addComment}>
            <input
              type="text"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
            />
            <button type="submit">add comment</button>
          </form>
        </div>
        {renderComments()}
      </div>
    )
  }

  return(
    <div style={blogStyle}>
      <Link to={`blogs/${blog.id}`} className='blog' >
        {blog.title} | {blog.author}
      </Link>
    </div>
  )
}

export default Blog