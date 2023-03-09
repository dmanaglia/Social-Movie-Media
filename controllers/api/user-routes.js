const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        req.session.logged_in = true;
        req.session.userid = userData.id;
        req.session.username = userData.username;
        res.status(200).json(userData);
      } catch (err) {
        res.status(400).json(err);
      }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });
    if (!userData) {
      res.status(404).json({ message: 'Unknown user' });
      return;
    }
    const validPassword = userData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(401).json({ message: `Incorrect password for ${req.body.username}` });
      return;
    }
    req.session.logged_in = true;
    req.session.userId = userData.id;
    req.session.username = userData.username;
    res.json({ user: userData, message: 'You are now logged in!' });
  } catch (err) {
      res.status(400).json(err);
  }
});


module.exports = router;