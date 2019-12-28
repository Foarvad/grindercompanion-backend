const mongoose = require('mongoose');

const Cooldown = require('./cooldownModel').schema;


const schema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  totalMoney: {
    type: String,
    required: true,
  },
  cooldowns: {
    type: [Cooldown],
    required: true,
  },
});

module.exports = mongoose.model('Session', schema);
