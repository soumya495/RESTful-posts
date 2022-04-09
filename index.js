const express = require('express')
const app = express()
let data = require('./data.json')
const path = require('path')
const { v4: uuid } = require('uuid')
const methodOverride = require('method-override')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
// middleware to parse form data
app.use(express.urlencoded({ extended: true }))
// middleware to use patch request from forms
app.use(methodOverride('_method'))

// route for Home
app.get('/', (req, res) => {
  res.render('home')
})

// GET /posts - lists all available posts
app.get('/posts', (req, res) => {
  res.render('posts', { posts: data })
})

// GET /posts/:id - list one post with ID
app.get('/posts/:id', (req, res) => {
  const { id } = req.params
  const post = data.find((d) => d.id === id)
  if (!post) res.redirect('/notfound')
  res.render('post', { ...post })
})

// GET /newpost - form to add new post
app.get('/newpost', (req, res) => {
  res.render('newpost')
})

// POST /posts - add a new post
app.post('/posts', (req, res) => {
  const { userId, title, body } = req.body
  data.unshift({ title, body, userId: parseInt(userId), id: uuid() })
  res.redirect('/posts')
})

// GET /editpost/:id - form to edit a post using ID
app.get('/editpost/:id', (req, res) => {
  const { id } = req.params
  const post = data.find((p) => p.id === id)
  if (!post) res.redirect('/notfound')
  res.render('editpost', { ...post })
})

// PATCH /posts/:id - edit title,body of post with ID
app.patch('/posts/:id', (req, res) => {
  const { id } = req.params
  const { title, body } = req.body
  const post = data.find((p) => p.id === id)
  if (!post) res.redirect('/notfound')
  post.title = title
  post.body = body
  res.redirect('/posts')
})

// DELETE /posts/:id - delete a post using ID
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params
  data = data.filter((d) => d.id !== id)
  res.redirect('/posts')
})

// return all users from data
const getUsers = () => {
  let users = []
  for (let d of data) {
    if (!users.includes(d.userId)) {
      users.push(d.userId)
    }
  }
  return users
}

// return all posts under a given userID
const getPosts = (id) => {
  let posts = []
  for (let d of data) {
    if (d.userId === parseInt(id)) posts.push(d)
  }
  return posts
}

// GET /users - list all available users
app.get('/users', (req, res) => {
  const users = getUsers()
  res.render('users', { data, users })
})

// GET /users/:id - list all available posts of one user
app.get('/users/:id', (req, res) => {
  const { id } = req.params
  const posts = getPosts(id)
  if (!posts || posts.length === 0) res.redirect('/notfound')
  res.render('user', { posts, id })
})

app.get('*', (req, res) => {
  res.render('notfound')
})

app.listen('3000', () => {
  console.log('Listening on Port 3000')
})
