import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> on submit, "createBlog" is called with the right parameters', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('#onSubmit')

  fireEvent.change(title, {
    target: { value: 'testing of forms could be easier' }
  })

  fireEvent.change(author, {
    target: { value: 'Testi Testeri' }
  })

  fireEvent.change(url, {
    target: { value: 'testiurl' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing of forms could be easier')
  expect(createBlog.mock.calls[0][0].author).toBe('Testi Testeri')
  expect(createBlog.mock.calls[0][0].url).toBe('testiurl')
})
