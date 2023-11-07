const express = require('express')
const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)

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
    "title": "Really long name lets see if this works or not",
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
