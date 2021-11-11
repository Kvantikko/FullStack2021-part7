import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Tomi Testaaja',
  url: 'testiurl',
  likes: 0,
  user: {
    username: 'mama',
    name: 'Masa Mainio'
  }
}

const loggedUser = {
  username: 'mama',
  name: 'Masa Mainio'
}


test('when "view" button is not pressed, renders only blog title and author', () => {
  const component = render(
    <Blog blog={blog} />
  )

  //component.debug()

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  expect(component.container).toHaveTextContent(
    'Tomi Testaaja'
  )

  expect(component.container).not.toHaveTextContent(
    'testiurl'
  )

  expect(component.container).not.toHaveTextContent(
    0
  )
})


test('when "view" button is pressed, renders blog title, author, url and likes', () => {
  const component = render(
    <Blog blog={blog} user={loggedUser} />
  )

  //component.debug()

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  expect(component.container).toHaveTextContent(
    'Tomi Testaaja'
  )

  expect(component.container).toHaveTextContent(
    'testiurl'
  )

  expect(component.container).toHaveTextContent(
    'likes: 0'
  )
})


test('when "like" button is pressed twice, eventhandler that is passed as props, is called twice', () => {
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} user={loggedUser} updateLikes={mockHandler} />
  )

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  //component.debug()

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})