async function getUserMiddleware(req, res, next) {
    req.user = {
      name: 'Foarvad',
      email: 'foarvad@gmail.com',
    };
    next();
}

module.exports = getUserMiddleware;
