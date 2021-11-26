import React from 'react'
import { useSelector } from 'react-redux'
import Blog from './Blog'
import { Table } from 'react-bootstrap'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  return(
    <Table striped style={{ marginTop: 40 }} >
      <tbody>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </tbody>
    </Table>

  )
}

export default BlogList