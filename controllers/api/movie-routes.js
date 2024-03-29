const router = require('express').Router();
const { Op } = require("sequelize");
const { Movie } = require('../../models');
const withAuth = require('../../utils/auth');
//returns list of all titles in the dataset (no repeats)
router.get('/allTitles', withAuth, async (req, res) => {
    const allTitles = await Movie.findAll({
        attributes: ['Title']
    });
    let titles = [];
    for(let movie of allTitles){
        titles.push(movie.Title);
    }
    uniqueTitles = [...new Set(titles)];
    res.status(200).json(uniqueTitles);
});
//returns list of all Actors in the dataset (no repeats)
router.get('/allActors', withAuth, async (req, res) => {
    const actorData = await Movie.findAll({
        attributes: ['Stars']
    });
    let allActors = [];
    for(let actorsObj of actorData){
        let actorsStr = actorsObj.Stars;
        let actorList = actorsStr.split(',');
        for(let actor of actorList){
            allActors.push(actor.trim());
        }
    }
    uniqueActors = [...new Set(allActors)];
    res.status(200).json(uniqueActors);
});
//returns a list of all directors in the dataset (no repeats)
router.get('/allDirectors', withAuth, async (req, res) => {
    const directorData = await Movie.findAll({
        attributes: ['Directors']
    });
    let allDirectors = [];
    for(let directorObj of directorData){
        let directorStr = directorObj.Directors;
        if(directorStr.includes(',')){
            let directorList = directorStr.split(',');
            for(let director of directorList){
                allDirectors.push(director.trim());
            }
        }else {
            allDirectors.push(directorStr.trim())
        }
    }
    uniqueDirectors = [...new Set(allDirectors)];
    res.status(200).json(uniqueDirectors);
});
//gets all movies between a specified range 
router.get('/getAll/:range', withAuth, async (req, res) => {
   try { 
        let range = req.params.range.split('-');
        let movieData = await Movie.findAll({
            where: {
                [Op.and]: [{id: {[Op.gte]: range[0]}}, {id: {[Op.lte]: range[1]}}]
            }
        })
        //total is always 2000 since there are 2000 movies in the dataset
        res.status(200).json({total: 2000, movieData});
    } catch(err) {
        res.status(500).json(err);
    }
});
//takes in serch term and case to note what the term represents (1 title, 2 actor etc)
router.get('/singleSearch/:a/:case/:range', withAuth, async (req, res) => {
    const a = req.params.a.replaceAll('_', ' ');
    let fullData;
    switch(req.params.case){
        case '1':
            fullData = await Movie.findAll({
                where:{
                    Title: {
                        [Op.like]: `%${a}%`
                    }
                }
            });
            break;
        case '2':
            fullData = await Movie.findAll({
                where:{
                    Stars: {
                        [Op.like]: `%${a}%`
                    }
                }
            });
            break;
        case '3':
            fullData = await Movie.findAll({
                where:{
                    Directors: {
                        [Op.like]: `%${a}%`
                    }
                }
            });
            break;
        case '4':
            fullData = await Movie.findAll({
                where:{
                    Genre: {
                        [Op.like]: `%${a}%`
                    }
                }
            });
            break;
        default:
            console.log('something went wrong!');
            break;
    }
    let total = fullData.length;
    //extracts info from all movies found to only those found within specified range
    let range = req.params.range.split('-');
    let movieData = [];
    let i = range[0] - 1;
    while(i < range[1] && i < fullData.length){
        movieData.push(fullData[i]);
        i++;
    }
    //returns the total number found and the data on the movies within the specified range
    res.status(200).json({total, movieData});
});
//takes in 2 search terms with a case to note what each term represents (6 possibilities)
router.get('/doubleSearch/:a/:b/:case/:range', withAuth, async (req, res) => {
    const a = req.params.a.replaceAll('_', ' ');
    const b = req.params.b.replaceAll('_', ' ');
    let fullData;
    switch(req.params.case) {
        case '1':    
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Title: {
                            [Op.like]: `%${a}%`
                        }},
                        {Stars: {
                            [Op.like]: `%${b}%`
                        }}
                    ]
                }
            });
            break;
        case '2':
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Title: {
                            [Op.like]: `%${a}%`
                        }},
                        {Directors: {
                            [Op.like]: `%${b}%`
                        }}
                    ]
                }
            });
            break;
        case '3':
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Title: {
                            [Op.like]: `%${a}%`
                        }},
                        {Genre: {
                            [Op.like]: `%${b}%`
                        }}
                    ]
                }
            });
            break;
        case '4':
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Stars: {
                            [Op.like]: `%${a}%`
                        }},
                        {Directors: {
                            [Op.like]: `%${b}%`
                        }}
                    ]
                }
            });
            break;
        case '5':
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Stars: {
                            [Op.like]: `%${a}%`
                        }},
                        {Genre: {
                            [Op.like]: `%${b}%`
                        }}
                    ]
                }
            });
            break;
        case '6':
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Directors: {
                            [Op.like]: `%${a}%`
                        }},
                        {Genre: {
                            [Op.like]: `%${b}%`
                        }}
                    ]
                }
            });
            break;
        default:
            console.log("something went wrong!");
    }
    let total = fullData.length;
    let range = req.params.range.split('-');
    let movieData = [];
    let i = range[0] - 1;
    while(i < range[1] && i < fullData.length){
        movieData.push(fullData[i]);
        i++;
    }
    res.status(200).json({total, movieData});
});
//takes 3 search terms and a case to note what each term represents (4 possibilies)
router.get('/tripleSearch/:a/:b/:c/:case/:range', withAuth, async (req, res) => {
    const a = req.params.a.replaceAll('_', ' ');
    const b = req.params.b.replaceAll('_', ' ');
    const c = req.params.c.replaceAll('_', ' ');
    let fullData;
    switch(req.params.case){
        case '1':
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Title: {
                            [Op.like]: `%${a}%`
                        }},
                        {Stars: {
                            [Op.like]: `%${b}%`
                        }},
                        {Directors: {
                            [Op.like]: `%${c}%`
                        }}
                    ]
                }
            });
            break;
        case '2':
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Title: {
                            [Op.like]: `%${a}%`
                        }},
                        {Stars: {
                            [Op.like]: `%${b}%`
                        }},
                        {Genre: {
                            [Op.like]: `%${c}%`
                        }}
                    ]
                }
            });
            break;
        case '3':
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Title: {
                            [Op.like]: `%${a}%`
                        }},
                        {Directors: {
                            [Op.like]: `%${b}%`
                        }},
                        {Genre: {
                            [Op.like]: `%${c}%`
                        }}
                    ]
                }
            });
            break;
        case '4':
            fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Stars: {
                            [Op.like]: `%${a}%`
                        }},
                        {Directors: {
                            [Op.like]: `%${b}%`
                        }},
                        {Genre: {
                            [Op.like]: `%${c}%`
                        }}
                    ]
                }
            });
            break;
        default:
            console.log('something went wrong!');
            break;
    }
    let total = fullData.length;
    let range = req.params.range.split('-');
    let movieData = [];
    let i = range[0] - 1;
    while(i < range[1] && i < fullData.length){
        movieData.push(fullData[i]);
        i++;
    }
    res.status(200).json({total, movieData});
});
//takes in 4 search terms
router.get('/fullSearch/:title/:actor/:director/:genre/:range', withAuth, async (req, res) => {
    const title = req.params.title.replaceAll('_', ' ');
    const actor = req.params.actor.replaceAll('_', ' ');
    const director = req.params.director.replaceAll('_', ' ');
    const genre = req.params.genre.replaceAll('_', ' ');
    const fullData = await Movie.findAll({
                where:{
                    [Op.and]: [
                        {Title: {
                            [Op.like]: `%${title}%`
                        }},
                        {Stars: {
                            [Op.like]: `%${actor}%`
                        }},
                        {Directors: {
                            [Op.like]: `%${director}%`
                        }},
                        {Genre: {
                            [Op.like]: `%${genre}%`
                        }}
                    ]
                }
            });
    let total = fullData.length;
    let range = req.params.range.split('-');
    let movieData = [];
    let i = range[0] - 1;
    while(i < range[1] && i < fullData.length){
        movieData.push(fullData[i]);
        i++;
    }
    res.status(200).json({total, movieData});
});

module.exports = router;