const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./testHelper')
const app = require('../app')
const api = supertest(app)

const BacklogItem = require('../models/backlogItem')


beforeEach(async () => {
  await BacklogItem.deleteMany({})
  await BacklogItem.insertMany(helper.initialBacklogItems)
})

describe('when there is initially some backlogItems saved', () => {
  test('all backlogItems are returned', async () => {
    const response = await api.get('/api/backlogItems')
  
    expect(response.body).toHaveLength(helper.initialBacklogItems.length)
  })

  test('a specific backlogItem is within the returned backlogItems', async () => {
    const response = await api.get('/api/backlogItems')
  
    const contents = response.body.map(r => r.title)
    expect(contents).toContain(
      'Final Fantasy XII'
    )
  })
})

describe('viewing a specific backlogItem', () => {
  test('succeeds with valid id', async () => {
    const backlogItemsAtStart = await helper.backlogItemsInDb()
  
    const backlogItemToView = backlogItemsAtStart[0]
  
    const resultingBacklogItem = await api
      .get(`/api/backlogItems/${backlogItemToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    expect(resultingBacklogItem.body).toEqual(backlogItemToView)
  })
})

describe('addition of a new backlogItem', () => {
  test('succeeds with valid data', async () => {
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
  
    const backlogItemsAtEnd = await helper.backlogItemsInDb()
    expect(backlogItemsAtEnd).toHaveLength(helper.initialBacklogItems.length + 1)
  
    const contents = backlogItemsAtEnd.map(item => item.title)
    expect(contents).toContain('There Will Be Blood')
  })
  
  test('fails with status code 400 if it has no title', async () => {
    const newBacklogItem = {
      format: 'Movie',
      completionStatus: 'Backlog',
    }

    await api
      .post('/api/backlogItems')
      .send(newBacklogItem)
      .expect(400)

    const backlogItemsAtEnd = await helper.backlogItemsInDb()

    expect(backlogItemsAtEnd).toHaveLength(helper.initialBacklogItems.length)
  })

})

describe('deletion of a backlogItem', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const backlogItemsAtStart = await helper.backlogItemsInDb()
    const backlogItemToDelete = backlogItemsAtStart[0]
  
    await api
      .delete(`/api/backlogItems/${backlogItemToDelete.id}`)
      .expect(204)
  
    const backlogItemsAtEnd = await helper.backlogItemsInDb()
  
    expect(backlogItemsAtEnd).toHaveLength(
      helper.initialBacklogItems.length - 1
    )
  
    const contents = backlogItemsAtEnd.map(r => r.title)
  
    expect(contents).not.toContain(backlogItemToDelete.title)
  })

})

describe('editing of a backlogItem', () => {
  test('succeeds with valid data', async () => {
    const backlogItemsAtStart = await helper.backlogItemsInDb()
    const backlogItemToEdit = backlogItemsAtStart[0]
  
    await api
      .put(`/api/backlogItems/${backlogItemToEdit.id}`)
      .send({completionStatus: 'Playing'})
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const backlogItemsAtEnd = await helper.backlogItemsInDb()
    expect(backlogItemsAtEnd).toHaveLength(helper.initialBacklogItems.length)
  
    const editedBacklogItem = backlogItemsAtEnd[0]
    expect(editedBacklogItem.completionStatus).toEqual('Playing')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})