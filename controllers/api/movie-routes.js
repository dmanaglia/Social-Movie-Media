const router = require('express').Router();
const { Op } = require("sequelize");
const { Movie } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/allTitles', withAuth, async (req, res) => {
    const allTitles = await Movie.findAll({
        attributes: ['id','Title']
    })
    res.status(200).json(allTitles);
});

router.get('/id/:id', withAuth, async (req, res) => {
    const oneMovie = await Movie.findByPk(req.params.id)
    res.status(200).json(oneMovie);
});

router.get('/:term', withAuth, async (req, res) => {
    const term = req.params.term.replaceAll('_', ' ');
    const movieData = await Movie.findAll({
        where:{
            Title: {
                [Op.like]: `%${term}%`
            }
        }
    });
    res.status(200).json(movieData);
})

module.exports = router;