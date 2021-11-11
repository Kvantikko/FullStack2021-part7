describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Mikko Mallikas',
      username: 'malli',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('malli')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Mikko Mallikas logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('malli')
      cy.get('#password').type('ihax0r')
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Mikko Mallikas logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'malli', password: 'salainen' })
      console.log('localStorage:', window.localStorage)
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()

      cy.contains('title')
      cy.contains('author')
      cy.contains('url')
      cy.contains('create')
      cy.contains('cancel')

      cy.get('#title').type('Testi Title')
      cy.get('#author').type('Tomi Testaaja')
      cy.get('#url').type('https://testi.fi')

      cy.get('#submitBlog').click()

      cy.contains('Testi Title')
      cy.contains('Tomi Testaaja')
      cy.contains('view')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'No Tässäpä Testi Title',
          author: 'Tomi Testaaja',
          url: 'https://testi.fi'
        })
      })

      it('A blog can be liked', function() {
        cy.contains('view').click()

        cy.contains('likes: 0')

        cy.contains('like').click()

        cy.contains('likes: 1')
      })

      it('A blog can be removed if the blog creator is logged in user', function() {
        cy.contains('view').click()

        cy.contains('remove').click()

        cy.get('.notification')
          .should('contain', 'blog No Tässäpä Testi Title by Tomi Testaaja deleted')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')

        cy.get('.blog').should('not.exist')
      })

      it('A blog can\'t be removed if logged in user is no the creator', function() {
        const user2 = {
          name: 'Mikko Pallikas',
          username: 'palli',
          password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user2)

        cy.contains('logout').click()

        cy.get('#username').type('palli')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()

        cy.contains('view').click()
        cy.contains('remove').should('not.exist')
      })

      describe('and more blogs exists', function () {
        beforeEach(function () {
          cy.createBlog({
            title: '3rd Most Likes',
            author: 'Tomi Testaaja',
            url: 'https://testi.fi',
            likes: 3
          })

          cy.createBlog({
            title: '5th Most Likes',
            author: 'Tomi Testaaja',
            url: 'https://testi.fi',
            likes: 1
          })
          cy.createBlog({
            title: 'Most Likes',
            author: 'Tomi Testaaja',
            url: 'https://testi.fi',
            likes: 5
          })
          cy.createBlog({
            title: '4th Most Likes',
            author: 'Tomi Testaaja',
            url: 'https://testi.fi',
            likes: 2
          })
          cy.createBlog({
            title: '2nd Most Likes',
            author: 'Tomi Testaaja',
            url: 'https://testi.fi',
            likes: 4
          })
        })

        it('All blogs are in descending order according to likes and liking a blog makes it rise at the top', function() {
          cy.get('.blog').eq(0).contains('Most Likes').should('exist')
          cy.get('.blog').eq(1).contains('2nd Most Likes').should('exist')
          cy.get('.blog').eq(2).contains('3rd Most Likes').should('exist')
          cy.get('.blog').eq(3).contains('4th Most Likes').should('exist')
          cy.get('.blog').eq(4).contains('5th Most Likes').should('exist')


          cy.get('.blog').eq(4).contains('view').click()

          for(let i = 0; i < 6; i++) {
            cy.get('.blogShowMore').contains('like').click()
            cy.wait(2000)
          }

          cy.get('.blogShowMore').contains('hide').click()

          cy.get('.blog').eq(0).contains('5th Most Likes').should('exist')

          cy.get('.blog').find('.changeView').click({ multiple: true })
        })
      })
    })
  })
})
