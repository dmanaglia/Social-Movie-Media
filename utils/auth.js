const hasAuth = (req, res, next) => {
    if (!req.session.logged_in) {
      res.redirect('/login/1');
    } else {
      next();
    }
  };
  
  module.exports = hasAuth;