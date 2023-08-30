const bcrypt = require('bcrypt')
const accountsRouter = require('express').Router()
const accounts = require('../models/accounts')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const exclude = (user, keys) => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key))
  )
}

accountsRouter.get('/', async (req, res) => {
  const accountsFind = await accounts.findMany({
    select: {
      id: true,
      username: true,
      highscore: true,
      date_completed: true,
    },
    take: 10,
    orderBy: [{ highscore: 'desc' }, { date_completed: 'asc' }],
  })

  res.json(accountsFind)
})

accountsRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const decodedToken = jwt.verify(getTokenFrom(req), config.SECRET)

  if (!decodedToken.id && decodedToken.id !== id) {
    return res.status(401).json({ error: 'Token invalid.' })
  }

  const account = await accounts.findUnique({
    select: {
      username: true,
      highscore: true,
    },
    where: {
      id: id,
    },
  })

  return res.json(account)
})

accountsRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const account = await accounts.create({
    data: {
      username,
      password: passwordHash,
    },
  })
  const accountSafe = exclude(account, ['password'])
  return res.status(201).json(accountSafe)
})

// accountsRouter.delete('/:id', (req, res, next) => {})

accountsRouter.patch('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const newData = req.body
  const decodedToken = jwt.verify(getTokenFrom(req), config.SECRET)

  if (!decodedToken.id && decodedToken.id !== id) {
    return res.status(401).json({ error: 'Token invalid.' })
  }

  const updateUser = await accounts.update({
    where: {
      id: id,
    },
    data: newData,
  })

  return res.json(updateUser)
})

module.exports = accountsRouter
