const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.static('dist'))

let backlogItems = [
  {
    "title": "cxfygkcx",
    "format": "Movie",
    "completionStatus": "Playing",
    "id": 4
  },
  {
    "title": "gnx",
    "format": "Movie",
    "completionStatus": "Backlog",
    "id": 5
  },
  {
    "title": "zdgmzmzdg",
    "format": "Movie",
    "completionStatus": "Playing",
    "id": 6
  },
  {
    "title": "Rally long name lets see if this works or not",
    "format": "Movie",
    "completionStatus": "Backlog",
    "id": 7
  },
  {
    "title": "gv",
    "format": "Movie",
    "completionStatus": "Backlog",
    "id": 9
  }
]

app.get('/info', (request, response) => {
  let numOfBacklogItems = backlogItems.length
  let date = new Date().toJSON();
  let responseString = `This backlog contains ${numOfBacklogItems} items.`

  response.send(responseString)
})

app.get('/api/backlogItems/:id', (request, response) => {
  const id = request.params.id
  const backlogItem = backlogItems.find(backlogItem => backlogItem.id == id)
  
  if (backlogItem) {
    response.json(backlogItem)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/backlogItems/:id', (request, response) => {
  const id = Number(request.params.id)
  backlogItems = backlogItems.filter(backlogItem => backlogItem.id !== id)

  response.status(204).end()
})

app.get('/api/backlogItems', (request, response) => {
  response.json(backlogItems)
})

const generateId = () => {
  const maxId = backlogItems.length > 0
    ? Math.max(...backlogItems.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/backlogItems', (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({ 
      error: 'title missing' 
    })
  }

  const backlogItem = {
    title: body.title,
    format: body.format || "Movie",
    completionStatus: body.completionStatus || "Backlog",
    id: generateId(),
  }

  backlogItems = backlogItems.concat(backlogItem)

  response.json(backlogItem)
})

app.put('/api/backlogItems/:id', (request, response) => {
  const body = request.body
  const id = Number(request.params.id)
  const updatedBacklogItem = {
    title: body.title,
    format: body.format,
    completionStatus: body.completionStatus,
    id: id,
  }

  backlogItems = backlogItems.filter(backlogItem => backlogItem.id !== id)
  backlogItems = [...backlogItems, updatedBacklogItem]

  response.json(updatedBacklogItem)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
