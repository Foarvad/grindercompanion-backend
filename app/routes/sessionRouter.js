const express = require('express');
const router = express.Router();

const Session = require('../models/sessionModel');
const userMiddleware = require('../middlewares/userMiddleware');

// Get session
router.get('/', userMiddleware, async (req, res) => {
  try {
    const session = await Session.findOne({ userName: req.user.name });
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create new session
router.post('/', userMiddleware, async (req, res) => {
  const existingSession = await Session.findOne({ userName: req.user.name });
  if (existingSession) {
    res.status(400).json({ message: 'Session already exists' });
  }

  const { startTime, totalMoney, cooldowns } = req.body;

  if (!startTime || !totalMoney || !cooldowns){
    res.status(400).json({ message: 'Not all fields are provided' });
    return;
  }

  const session = new Session({
    userName: req.user.name,
    startTime,
    totalMoney,
    cooldowns,
  });

  try {
    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update session
router.patch('/', userMiddleware, async (req, res) => {
  const session = await Session.findOne({ userName: req.user.name });
  if (!session) {
    res.status(400).json({ message: 'Session not found' });
  }

  const { startTime, totalMoney, cooldowns } = req.body;

  const updatePayload = {};
  if (startTime)
    updatePayload.startTime = startTime;
  if (totalMoney)
    updatePayload.totalMoney = totalMoney;
  if (cooldowns)
    updatePayload.cooldowns = cooldowns;

  try {
    const result = await Session.updateOne({ userName: req.user.name }, updatePayload);

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete session
router.delete('/', userMiddleware, async (req, res) => {
  try {
    const result = await Session.deleteOne({ userName: req.user.name });
    if (result.deletedCount !== 1) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports = router;
