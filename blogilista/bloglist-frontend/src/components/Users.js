import React from 'react'
import User from './User.js'

const Users = ({ users }) => {

  return(
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>

          {users.map(user =>
            <User key={user.id} user={user} />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Users
