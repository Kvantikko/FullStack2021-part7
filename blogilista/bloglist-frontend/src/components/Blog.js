import { React, useState } from 'react'

const Blog = ({
  blog,
  user,
  updateLikes,
  removeBlog
}) => {

  const [showMore, setShowMore] = useState(false) // show more or less of the blog info

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const changeView = () => {
    if (!showMore) {
      setShowMore(true)
    } else {
      setShowMore(false)
    }
  }

  const addLike = (event) => {
    event.preventDefault()
    updateLikes(blog)
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Removing blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog)
    }
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
    return(
      <div className='blogShowMore' style={blogStyle}>
        {blog.title} | {blog.author} <button onClick={changeView}>hide</button>
        <div>
          {blog.url}
        </div>
        <div id="likes">
          likes: {blog.likes} <button id="like-button" onClick={addLike}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          {removeButton()}
        </div>
      </div>
    )
  }

  return(
    <div className='blog' style={blogStyle}>
      {blog.title} | {blog.author} <button className='changeView' onClick={changeView}>view</button>
    </div>
  )
}

export default Blog