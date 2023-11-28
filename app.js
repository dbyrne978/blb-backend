const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const BacklogItem = require('./models/backlogItem')

// Middleware
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
//

app.get('/api/backlogItems/:id', (request, response, next) => {
  BacklogItem
    .findById(request.params.id)
    .then(backlogItem => {
      if (backlogItem) {
        response.json(backlogItem)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/backlogItems/:id', (request, response, next) => {
  BacklogItem
    .findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/backlogItems', (request, response, next) => {
  BacklogItem
    .find({})
    .then(backlogItems => {
      response.json(backlogItems)
    })
    .catch(error => next(error))
})

app.post('/api/backlogItems', (request, response, next) => {
  const body = request.body

  const backlogItem = new BacklogItem({
    title: body.title,
    format: body.format,
    completionStatus: body.completionStatus || "Backlog"
  })

  backlogItem
    .save()
    .then(savedBacklogItem => response.json(savedBacklogItem))
    .catch(error => next(error))
})

app.put('/api/backlogItems/:id', (request, response, next) => {
  const body = request.body

  const updatedBacklogItem = {
    title: body.title,
    format: body.format,
    completionStatus: body.completionStatus
  }

  BacklogItem
    .findByIdAndUpdate(request.params.id, updatedBacklogItem, { new: true })
    .then(updatedBacklogItem => {
      response.json(updatedBacklogItem)
    })
    .catch(error => next(error))
})

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