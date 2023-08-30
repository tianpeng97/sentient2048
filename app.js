// modules
const express = require('express')
const path = require('path')
require('express-async-errors') // BEFORE ROUTES
const middleware = require('./utils/middleware')
const logger = require('morgan')

// routers
const accountsRouter = require('./controllers/accounts')
const loginRouter = require('./controllers/login')

// app
const app = express()

// use
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // only parse strings/arrays
app.use(express.static('build'))

// use routes
app.use('/api/accounts', accountsRouter)
app.use('/api/login', loginRouter)
app.use('/game', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, './build/') })
})
app.use('/signin', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, './build/') })
})
app.use('/signup', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, './build/') })
})

// middlewares
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
