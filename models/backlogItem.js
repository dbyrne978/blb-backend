const mongoose = require('mongoose')

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

backlogItemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('BacklogItem', backlogItemSchema)