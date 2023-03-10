const router = require('express').Router();
const { Review } = require('../../models');
const withAuth = require('../../utils/auth');

// need to include movieId in review post/put!!

router.post('/', withAuth, async (req, res) => {
    try {
        const newReview = await Review.create({
          ...req.body,
          userId: req.session.userId,
        });
    
        res.status(200).json(newReview);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        const reviewData = await Review.update(req.body, {
            where: {
                id: req.params.id,
                userId: req.session.userId,
            },
        });
  
        if (!reviewData) {
            res.status(404).json({ message: 'No review found with this id!' });
            return;
        }
  
        res.status(200).json(reviewData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const reviewData = await Review.destroy({
            where: {
                id: req.params.id,
                userId: req.session.userId,
            },
        });
  
        if (!reviewData) {
            res.status(404).json({ message: 'No review found with this id!' });
            return;
        }
  
        res.status(200).json(reviewData);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:movieId', withAuth, async (req, res) => {
    let user = req.session;
    try {
      const reviewData = await Review.findOne({
        where: {
          userId: user.userId,
          movieId: req.params.movieId
        }
      });
      res.status(200).json(reviewData)
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;