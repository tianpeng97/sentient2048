const errorHandler = (error, request, response, next) => {
  if (error.name === 'TypeError') {
    return response.status(404).send({ error: 'Type error.' })
  } else if (error.name === 'PrismaClientKnownRequestError') {
    return response.status(404).send({ error: 'Username already taken.' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'Token expired.' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'Unknown endpoint.' })
}

module.exports = { errorHandler, unknownEndpoint }
