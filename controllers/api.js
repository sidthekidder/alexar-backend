const { promisify } = require('util');
const request = require('request');
const cheerio = require('cheerio');
const graph = require('fbgraph');
const Twit = require('twit');
const Linkedin = require('node-linkedin')(process.env.LINKEDIN_ID, process.env.LINKEDIN_SECRET, process.env.LINKEDIN_CALLBACK_URL);
const axios = require('axios');
const Item = require('../models/Item');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  })
};

exports.getItems = function (req, res) {
  console.log(req.body)

  Item.find({}, function(err, items) {
    console.log(err)
    console.log(items)

    return res.json({
      success: true,
      places: formatItems(items, 'places'),
      events: formatItems(items, 'events')
    })
  })
};

exports.createItem = function (req, res) {
  console.log("CreateItem call")
  console.log(req.body)

  let startTime, endTime;
  if (req.body.type == 'place') {
    startTime = ''
    endTime = ''
  } else if (req.body.type == 'event') {
    startTime = new Date(req.body.startTime)
    endTime = new Date(req.body.endTime)
  }

  // create the item
  var item0 = new Item({ 
    name: req.body.name,
    desc: req.body.desc,
    type: req.body.type,
    startTime: startTime,
    imageSrc: "sampleimg.jpg",
    endTime: endTime,
    location: {
      "type" : "Point",
      "coordinates" : [
        req.body.longitude,
        req.body.latitude
      ]
    }
  });

  // save the item
  item0.save(function (err) {
    if (err) {
      console.log("Error!")
      return res.json({
        success: false,
        message: "Error: " + JSON.stringify(err)
      })
    } else {
      return res.json({
        success: true,
        message: "Item successfully created",
        data: item0
      })
    }
  });
};

exports.search = function (req, res) {
  console.log("Searching for " + req.body.text)

  Item.find({'name' : new RegExp(req.body.text, 'i')}, function(err, items) {
    if (err) {
      console.log("Error!")
      return res.json({
        success: false,
        message: "Error: " + JSON.stringify(err)
      })
    } else {
      return res.json({
        success: true,
        places: formatItems(items, 'places'),
        events: formatItems(items, 'events')
      })
    }
  });
};

function formatItems(items, type) {
  let list = []
  items.forEach(function(item) {
    if (type == 'events') {
      if (item['type'] == 'place') return // ignore the places for events list
    } else if (type == 'places') {
      if (item['type'] == 'event') return // ignore the events for places list
    }

    var obj = {}
    obj['name'] = item['name']
    obj['desc'] = item['desc']
    obj['imageSrc'] = item['imageSrc']
    obj['_id'] = item['_id']
    obj['longitude'] = item['location']['coordinates'][0]
    obj['latitude'] = item['location']['coordinates'][1]
    list.push(obj)
  })
  return list
}

