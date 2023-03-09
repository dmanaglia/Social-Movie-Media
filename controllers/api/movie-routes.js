const router = require('express').Router();
const { Movie } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/allTitles', withAuth, (req, res) => {
    allTitles = Movie.findAll({
        
    })
});

module.exports = router;