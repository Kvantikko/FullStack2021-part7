import React from 'react'
import User from './User.js'
import { Table } from 'react-bootstrap'

const Users = ({ users }) => {

  return(
    <div>
      <h2 style={{ textAlign: 'center' }} >Users</h2>
      <Table striped style={{ marginTop: 40 }} >
        <tbody>
          <tr>
            <th style={{ textAlign: 'center' }} >USER</th>
            <th style={{ textAlign: 'center' }} >BLOGS CREATED</th>
          </tr>

          {users.map(user =>
            <User key={user.id} user={user} />
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
