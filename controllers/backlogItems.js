const backlogItemsRouter = require('express').Router()
const BacklogItem = require('../models/backlogItem')

backlogItemsRouter.get('/:id', (request, response, next) => {
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

backlogItemsRouter.delete('/:id', (request, response, next) => {
  BacklogItem
    .findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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

  try {
    const savedBacklogItem = await backlogItem.save()
    response.status(201).json(savedBacklogItem)
  } catch (exception) {
    next(exception)
  }
  
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