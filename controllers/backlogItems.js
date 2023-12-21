const backlogItemsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

backlogItemsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

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