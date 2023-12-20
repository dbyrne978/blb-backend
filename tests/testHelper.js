const BacklogItem = require('../models/backlogItem')

const initialBacklogItems = [
  {
    title: 'Final Fantasy XII',
    format: 'Game',
    completionStatus: 'Complete',
  },
  {
    title: 'The Witcher',
    format: 'TV Show',
    completionStatus: 'Backlog',
  },
]

const nonExistingId = async () => {
  const backlogItem = new BacklogItem({
    title: 'testingNonExistingId',
    format: 'Game',
    completionStatus: 'Complete',
  })
  await backlogItem.save()
  await backlogItem.deleteOne()

  return backlogItem._id.toString()
}

const backlogItemsInDb = async () => {
  const backlogItems = await BacklogItem.find({})
  return backlogItems.map(backlogItem => backlogItem.toJSON())
}

module.exports = {
  initialBacklogItems, nonExistingId, backlogItemsInDb
}