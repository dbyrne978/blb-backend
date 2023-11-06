const express = require('express')
const app = express()

app.use(express.json())

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

app.post('/api/backlogItems', (request, response) => {
  const maxId = backlogItems.length > 0
    ? Math.max(...backlogItems.map(n => n.id)) 
    : 0

  const backlogItem = request.body
  backlogItem.id = maxId + 1

  backlogItems = backlogItems.concat(backlogItem)

  response.json(backlogItem)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
