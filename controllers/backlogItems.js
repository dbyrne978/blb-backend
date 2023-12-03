const backlogItemsRouter = require('express').Router()
const BacklogItem = require('../models/backlogItem')

backlogItemsRouter.get('/:id', async (request, response, next) => {
  const backlogItem = await BacklogItem.findById(request.params.id)
  if (backlogItem) {
      response.json(backlogItem)
    } else {
      response.status(404).end()
    }
})

backlogItemsRouter.delete('/:id', async (request, response, next) => {
  await BacklogItem.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

backlogItemsRouter.get('/', async (request, response) => {
  const backlogItems = await BacklogItem.find({})
  response.json(backlogItems)
})

backlogItemsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const backlogItem = new BacklogItem({
    title: body.title,
    format: body.format,
    completionStatus: body.completionStatus || "Backlog"
  })

  const savedBacklogItem = await backlogItem.save()
  response.status(201).json(savedBacklogItem)
})

backlogItemsRouter.put('/:id', (request, response, next) => {
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

module.exports = backlogItemsRouter