const router = require('express').Router();
const { Review, User, Movie } = require('../models');
const withAuth = require('../utils/auth');

// router is either login/1 to login or login/0 to sign up
router.get('/login/:login', (req, res) => {
  let login = req.params.login * 1;
  res.render('login', {login})
});
//gets all user reviews and returns them in order of most newest to oldest
router.get('/home', withAuth, async (req, res) => {
  const reviewData = await Review.findAll({
    order: [['updated_at', 'DESC']],
    include: [{
      model: Movie
    }, 
    {
      model: User
    }]
  })
  const reviews = reviewData.map((review) => review.get({ plain: true }));
  res.render('home', {reviews});
});
//gets all movies reviewed by the user and returns them
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
//renders search page
router.get('/search', withAuth, (req, res) => {
  let userId = req.session.userId;
  res.render('search', {userId})
});
//resets all session variables and navigates to the welcome page
router.get('/logout', withAuth, (req, res) => {
  req.session.logged_in = false;
  req.session.userId = null;
  req.session.username = null;
  res.render('welcome')
});

router.get('/movie/:id', withAuth, async (req, res) => { // Each movie has its own id, and when clicking on the movie, include the reviews for that movie/id
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [{
        model: Review,
        include: [{
          model: User,
        }]
      }]
    });
    const userId = req.session.userId;
    res.render('movie', {userId, movie: movie.get({ plain: true })});
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/review/:id', withAuth, async (req, res) => { // Each review has its own id, and is associated with a with a specific movie id
  const movieData = await Movie.findByPk(req.params.id);
  const movie = movieData.get({ plain: true })
  res.render('addReview', {movie});
});

router.get('/editReview/:id', withAuth, async (req, res) => { // Find a review by its id and relationship to a specific movie (for editing purposes)
  try{
      const editData = await Review.findByPk(req.params.id, {
        include: [{
          model: Movie
        }]
      });
      if(!editData) {
          res.status(404).json({message: 'No review with this id!'});
          return;
      }
      const editReview = editData.get({ plain: true });
      res.render('editReview', {editReview});
    } catch (err) {
        res.status(500).json(err);
    };     
});
//if route is unknown and user is logged in it will render the home page
//if route is unknown and user is not logged in it will render the welcome page
router.get('*', async (req, res) => {
    try {
      if(req.session.logged_in){
        res.render('home');
      } else {
        res.render('welcome');
      }
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;