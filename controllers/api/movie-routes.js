const router = require('express').Router();
const { Movie } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/allTitles', withAuth, async (req, res) => {
    const allTitles = await Movie.findAll({
        attributes: ['id','Title']
    })
    res.status(200).json(allTitles);
});

router.get('/:id', withAuth, async (req, res) => {
    const oneMovie = await Movie.findByPk(req.params.id)
    res.status(200).json(oneMovie);
});


module.exports = router;