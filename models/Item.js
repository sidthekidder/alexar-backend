const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  location:  {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  name: String,
  type: String,
  desc: String,
  startTime: Date,
  endTime: Date,
  imageSrc: String
}, { timestamps: true });


const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
