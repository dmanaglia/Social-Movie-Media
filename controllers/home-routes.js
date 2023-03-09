const router = require('express').Router();
const { Review, User } = require('../models');
const withAuth = require('../utils/auth');

// router is either login/1 to login or login/0 sign up
router.get('/login/:login', (req, res) => {
  let login = req.params.login * 1;
  res.render('login', {login})
});

router.get('/dashboard', withAuth, (req, res) => {
  let user = req.session;
  res.render('dashboard', {user})
});

router.get('/search', withAuth, (req, res) => {
  let user = req.session;
  res.render('search', {user})
});

router.get('/logout', withAuth, (req, res) => {
  req.session.logged_in = false;
  req.session.userid = null;
  req.session.username = null;
  res.render('home')
});

router.get('*', async (req, res) => {
    try {
      res.render('home');
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;