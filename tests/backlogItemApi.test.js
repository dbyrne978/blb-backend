const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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

beforeEach(async () => {
  await BacklogItem.deleteMany({})
  let backlogItemObject = new BacklogItem(initialBacklogItems[0])
  await backlogItemObject.save()
  backlogItemObject = new BacklogItem(initialBacklogItems[1])
  await backlogItemObject.save()
})

test('all backlogItems are returned', async () => {
  const response = await api.get('/api/backlogItems')

  expect(response.body).toHaveLength(initialBacklogItems.length)
})

test('a specific backlogItem is within the returned backlogItems', async () => {
  const response = await api.get('/api/backlogItems')

  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'Final Fantasy XII'
  )
})

test('a valid backlogItem can be added', async () => {
  const newBacklogItem = {
    title: 'There Will Be Blood',
    format: 'Movie',
    completionStatus: 'Backlog',
  }

  await api
    .post('/api/backlogItems')
    .send(newBacklogItem)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/backlogItems')

  const contents = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBacklogItems.length + 1)
  expect(contents).toContain(
    'There Will Be Blood'
  )
})

test('backlogItem without title is not added', async () => {
  const newBacklogItem = {
    format: 'Movie',
    completionStatus: 'Backlog',
  }

  await api
    .post('/api/backlogItems')
    .send(newBacklogItem)
    .expect(400)

  const response = await api.get('/api/backlogItems')

  expect(response.body).toHaveLength(initialBacklogItems.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})