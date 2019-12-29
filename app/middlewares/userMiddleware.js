async function userMiddleware(req, res, next) {
    req.user = {
      name: 'Foarvad',
      email: 'foarvad@gmail.com',
    };
    next();
}

module.exports = userMiddleware;
