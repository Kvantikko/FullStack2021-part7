import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ user, showMore }) => {
  if (!user) {
    return null
  }

  if (showMore) {
    return(
      <div>
        <h2 style={{ textAlign: 'center' }} >{user.name}</h2>
        <h3 style={{ textAlign: 'center', fontSize: 25, margin: 12 }} >Added blogs</h3>
        <div style={{ textAlign: 'center' }} >
          <div style={{  display: 'inline-block', textAlign: 'left', marginTop: 30 }}>
            {user.blogs.length !== 0
              ?
              user.blogs.map(blog =>
                <li key={blog.id} >{blog.title}</li>
              )
              :
              <div style={{ textAlign: 'center', fontSize: 20 }} >This user has not added any blogs yet</div>
            }
          </div>
        </div>
      </div>
    )
  }

  return(
    <tr>
      <td style={{ textAlign: 'center' }} > <Link to={`users/${user.id}`}>{user.name}</Link></td>
      <td style={{ textAlign: 'center' }} > {user.blogs.length} </td>
    </tr>
  )
}

export default User