const backlogItemsRouter = require('express').Router()
const BacklogItem = require('../models/backlogItem')
const User = require('../models/user')

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
  const backlogItems = await BacklogItem
    .find({}).populate('user', { username: 1, name: 1 })
    
  response.json(backlogItems)
})

backlogItemsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const backlogItem = new BacklogItem({
    title: body.title,
    format: body.format,
    completionStatus: body.completionStatus || "Backlog",
    user: user.id
  })

  const savedBacklogItem = await backlogItem.save()
  user.backlogItems = user.backlogItems.concat(savedBacklogItem._id)
  await user.save()

  response.status(201).json(savedBacklogItem)
})

backlogItemsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const updatedBacklogItem = {
    title: body.title,
    format: body.format,
    completionStatus: body.completionStatus
  }

  const backlogItemAfterUpdate = await BacklogItem
    .findByIdAndUpdate(request.params.id, updatedBacklogItem, { new: true })

  response.status(200).json(backlogItemAfterUpdate)
})

module.exports = backlogItemsRouter