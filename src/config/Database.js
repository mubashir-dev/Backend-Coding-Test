const mongoose = require('mongoose')
const {logger} = require('../helpers/Logger')
require('dotenv').config()

//Connection Options
const mongooseOptions = {
  useUnifiedTopology: true
};

exports.database = () => {
  mongoose.connect(process.env.MONGO_URL, mongooseOptions, (err) => {
    if (!err) {
      logger.info(`MongoDB Connected To:${process.env.MONGO_DB}`)
    } else {
      logger.error(`MongoDB Connection Failed:${err.stack}`)
    }
  })
};



