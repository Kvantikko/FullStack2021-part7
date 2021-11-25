import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ user, showMore }) => {
  if (!user) {
    return null
  }

  if (showMore) {
    return(
      <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <div style={{ paddingLeft: 15 }}>
          {user.blogs.map(blog =>
            <li key={blog.id} >{blog.title}</li>
          )}
        </div>
      </div>
    )
  }

  return(
    <tr>
      <td> <Link to={`users/${user.id}`}>{user.name}</Link></td>
      <td> {user.blogs.length} </td>
    </tr>
  )
}

export default User