const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const config = require('../utils/config')
const accounts = require('../models/accounts')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const account = await accounts.findUnique({
    where: {
      username,
    },
  })
  const passwordCorrect =
    account === null ? false : await bcrypt.compare(password, account.password)

  if (!(account && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid username or password.',
    })
  }

  const tokenInfo = {
    username: account.username,
    id: account.id,
  }

  const token = jwt.sign(tokenInfo, config.SECRET, { expiresIn: 60 * 60 })

  res.status(200).send({ token, id: account.id })
})

module.exports = loginRouter
