const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const backlogItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  completionStatus: {
    type: String,
    required: true
  },
})

backlogItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('BacklogItem', backlogItemSchema)