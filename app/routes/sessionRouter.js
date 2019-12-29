const express = require('express');
const router = express.Router();

const Session = require('../models/sessionModel');
const userMiddleware = require('../middlewares/userMiddleware');
const sessionMiddleware = require('../middlewares/sessionMiddleware');

// Get session
router.get('/', userMiddleware, sessionMiddleware, async (req, res) => {
  try {
    if (!res.session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    res.json(res.session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create new session
router.post('/', userMiddleware, sessionMiddleware, async (req, res) => {
  if (res.session) {
    res.status(400).json({ message: 'Session already exists' });
    return;
  }

  const { startTime, totalMoney, cooldowns } = req.body;

  if (!startTime || !totalMoney || !cooldowns){
    res.status(400).json({ message: 'Not all fields are provided' });
    return;
  }

  try {
    const newSession = await Session.create({
      userName: req.user.name,
      startTime,
      totalMoney,
      cooldowns,
    });
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update session
router.patch('/', userMiddleware, sessionMiddleware, async (req, res) => {
  if (!res.session) {
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
