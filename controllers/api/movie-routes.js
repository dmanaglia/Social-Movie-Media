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

router.get('/:term/:range?', withAuth, async (req, res) => {
    const term = req.params.term.replaceAll('_', ' ');
    const fullData = await Movie.findAll({
        where:{
            Title: {
                [Op.like]: `%${term}%`
            }
        }
    });
    let total = fullData.length;
    if(req.params.range){
        let range = req.params.range.split('-');
        let movieData = [];
        let i = range[0] - 1;
        while(i < range[1] || i === fullData.length -1){
            console.log(i);
            movieData.push(fullData[i]);
            i++;
        }
        res.status(200).json({total, movieData});
    } else{
        res.status(200).json(fullData);
    }
});

//range === 1-10, 11-20 etc.
router.get('/get/all/:range', withAuth, async (req, res) => {
   try { 
        let range = req.params.range.split('-');
        let movieData = await Movie.findAll({
            where: {
                [Op.and]: [{id: {[Op.gte]: range[0]}}, {id: {[Op.lte]: range[1]}}]
            }
        })
        res.status(200).json({total: 2000, movieData});
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;