import { React, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { like, newComment, remove } from '../reducers/blogReducer'
import { Link, useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const Blog = ({ blog, showMore }) => {
  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()
  /*
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: showMore ? null : 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
*/
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
      return <div style={{ fontSize: 20,  }} >No comments yet</div>
    }

    return(
      <div style={{ margingLeft: 'auto', margingRight: 'auto' }}>
        <div style={{ display: 'inline-block', textAlign: 'left', marginRight: 150 }}>
          {blog.comments.map(comment =>
            <li key={comment.id} >{comment.content}</li>
          )}
        </div>
      </div>
    )
  }

  const removeButton = () => {
    if (blog.user.username !== user.username) {
      return null
    } else {
      return(
        <Button style={{ margin: 10 }} id="remove-button" onClick={deleteBlog}>remove blog</Button>
      )
    }
  }

  if (showMore) {
    if(blog === undefined) {
      return null
    }

    return(
      <div className='blogShowMore' style={{ textAlign: 'center' }}>
        <h2>{blog.title} | {blog.author}</h2>
        <div>
          <a style={{ fontSize: 30 }} href={blog.url}>{blog.url}</a>
        </div>
        <div style={{ margin: 5, fontSize: 20 }} >
          <div style={{ margin: 5 }} id="likes">
            This blog has {blog.likes} likes<Button style={{ margin: 10 }} id="like-button" onClick={addLike}>like</Button>
          </div>
          <div>
            Blog added by {blog.user.name}
          </div>
          <div>
            {removeButton()}
          </div>
        </div>
        <h3 style={{ marginTop: 30 }} >Comments</h3>
        <div>
          <form id='onSubmit' onSubmit={addComment}>
            <input
              type="text"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
            />
            <Button style={{ margin: 10 }} type="submit">add comment</Button>
          </form>
        </div>
        {renderComments()}
      </div>
    )
  }

  return(
    <tr>
      <td >
        <Link to={`blogs/${blog.id}`} className='blog' >
          {blog.title}
        </Link>
      </td>
      <td style={{ textAlign: 'right' }}>
        {blog.author}
      </td>
    </tr>
  )
}

export default Blog