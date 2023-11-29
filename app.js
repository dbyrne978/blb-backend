const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const backlogItemsRouter = require('./controllers/backlogItems')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

app.use('/api/backlogItems', backlogItemsRouter)

// Last loaded middleware.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

module.exports = app