const _ = require('lodash')

const dummy = (blogs) => {
  return(1)
}


const totalLikes = (blogs) => {
  return(
    blogs
      .map(blog => blog.likes) // map transformoi uudeksi taulukoksi, jossa vain tykkäykset
      .reduce((sum, likes) => sum + likes, 0) // reduce summaa ne tykkäykset yhteen
  )
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return(undefined)
  }

  let favoriteBlog = undefined
  let mostLikes = 0
  
  blogs
    .map(blog => {
      if(mostLikes < blog.likes) {
        mostLikes = blog.likes
        favoriteBlog = blog
      }
    })

  return({
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  })
}


// using lodash in this function
const mostBlogs = (blogs) => {
    const authors = blogs.map(blog => blog.author)

    const amountOfBlogs = 
        _.values(_.groupBy(authors))
         .map(data => ({author: data[0], blogs: data.length}))
    
    return(_.maxBy(amountOfBlogs, author => author.blogs))
}


const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return(undefined)
  }
   
  const authors = blogs.map(blog => {
    return({name: blog.author,
            likes: blog.likes
          })
  })

  let counts = {}, i, value
    
  for (i = 0; i < authors.length; i++) {
    value = authors[i].name
    if (typeof counts[value] === "undefined") {
      counts[value] = authors[i].likes
    } else {
      counts[value] = counts[value] + authors[i].likes
    }
  }
    
  const authorNameWithMostLikes = 
    Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
    
  const amountOfLikes = 
    Math.max(...(Object.values(counts)))
    
  return({
    author: authorNameWithMostLikes,
    likes: amountOfLikes
  })
}
  
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}