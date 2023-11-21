require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const BacklogItem = require('./models/backlogItem')

// Middleware
const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('dist'))
//

app.get('/api/backlogItems/:id', (request, response) => {
  BacklogItem
    .findById(request.params.id)
    .then(backlogItem => response.json(backlogItem))
    .catch((error) => {
      console.log('ID not found')
    })
})

app.delete('/api/backlogItems/:id', (request, response) => {
  BacklogItem
    .findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

app.get('/api/backlogItems', (request, response) => {
  BacklogItem
    .find({})
    .then(backlogItems => {
      response.json(backlogItems)
    })
})

app.post('/api/backlogItems', (request, response) => {
  const body = request.body

  if (body.title === undefined) {
    return response.status(400).json({ 
      error: 'title missing' 
    })
  }

  const backlogItem = new BacklogItem({
    title: body.title,
    format: body.format || "Movie",
    completionStatus: body.completionStatus || "Backlog"
  })

  backlogItem
    .save()
    .then(savedBacklogItem => response.json(savedBacklogItem))
})

app.put('/api/backlogItems/:id', (request, response) => {
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
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
