const router = require('express').Router();
const { log } = require('handlebars');
const { Review, User, Movie } = require('../models');
const withAuth = require('../utils/auth');

// router is either login/1 to login or login/0 sign up
router.get('/login/:login', (req, res) => {
  let login = req.params.login * 1;
  res.render('login', {login})
});

router.get('/dashboard', withAuth, async (req, res) => {
  let user = req.session;
  try {
    const reviewData = await Review.findAll({
      where: {
        userId: user.userId
      },
      include: [{
          model: Movie
      }]
    });

    const reviews = reviewData.map((review) => review.get({ plain: true }));

    res.render('dashboard', {
      user,
      reviews,
      logged_in: user.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/search', withAuth, (req, res) => {
  let userId = req.session.userId;
  res.render('search', {userId})
});

router.get('/logout', withAuth, (req, res) => {
  req.session.logged_in = false;
  req.session.userId = null;
  req.session.username = null;
  res.render('home')
});

router.get('/movie/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [{
        model: Review,
        include: [{
          model: User,
        }]
      }]
    });
    console.log(movie.get({ plain: true }));
    const userId = req.session.userId;
    // res.status(200).json(movie);
    res.render('movie', {userId, movie: movie.get({ plain: true })})
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/review/:id', (req, res) => {
  res.render('review')
});

router.get('/editReview/:id', async (req, res) => {
  try{ 
      const editData = await Review.findByPk(req.params.id);
      if(!editData) {
          res.status(404).json({message: 'No review with this id!'});
          return;
      }
      const editReview = editData.get({ plain: true });
      console.log(editReview);
      res.render('editReview', {editReview});
    } catch (err) {
        res.status(500).json(err);
    };     
});

router.get('*', async (req, res) => {
    try {
      res.render('home');
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;