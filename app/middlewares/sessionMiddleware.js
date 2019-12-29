const Session = require('../models/sessionModel');

async function sessionMiddleware(req, res, next) {
    try {
      const session = await Session.findOne({ userName: req.user.name });
      res.session = session;
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

module.exports = sessionMiddleware;
