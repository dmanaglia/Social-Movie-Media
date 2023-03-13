var range = [1, 10];
var pageNum = 1;
var lastPage = 200;
var lastSearch = '';
const genreList = [
	"Animation",
	"Comedy",
	"History",
	"Drama",
	"Horror",
	"Musical",
	"Crime",
	"Mystery",
	"Adventure",
	"War",
	"Music",
	"Sport",
	"Action",
	"Thriller",
	"Western",
	"Family",
	"Fantasy",
	"Biography",
	"Sci-Fi",
	"Romance"
]

async function loadPage(){
    const res = await fetch(`/api/movies/getAll/${range.join('-')}`);
    lastSearch = `/api/movies/getAll/`;
    const results = await res.json();
    renderResults(results);
}

async function loadAutoComplete(){
    const titleRes = await fetch(`/api/movies/allTitles`);
    const titleData = await titleRes.json();
    $( "#movieSearch" ).autocomplete({
        source: titleData,
        minLength: 4,
    });
    const actRes = await fetch(`/api/movies/allActors`);
    const actData = await actRes.json();
    $( "#actorSearch" ).autocomplete({
        source: actData,
        minLength: 3,
    });
    const directRes = await fetch(`/api/movies/allDirectors`);
    const directData = await directRes.json();
    $( "#directorSearch" ).autocomplete({
        source: directData,
        minLength: 3,
    });
    $( "#genreSearch" ).autocomplete({
        source: genreList
    });
}

function ignoreThe(){
    const term = $('#movieSearch').val().toLowerCase();
    if(term === 'the '){
        $( "#movieSearch" ).autocomplete( "disable" );
    } else {
        $( "#movieSearch" ).autocomplete( "enable" );
    }
}

async function renderResults({total, movieData}){
    if(total % 10 === 0){
        lastPage = total / 10;
    } else {
        lastPage = Math.floor(total / 10) + 1;
    }
    $('#result-count').text(total);
    let displayRange = [...range];
    if(displayRange[1] > total && total !== 0){
        displayRange[1] = total;
    } else if(total === 0){
        displayRange[0] = total;
        displayRange[1] = total;
    }
    $('#result-range').text(displayRange.join('-'));
    $('#list-container').empty();
    if(total !== 0){
        for(const movie of movieData){
            let imgCol = $('<div>');
            imgCol.attr('class', 'col-12 col-md-3');
            let imgContainer = $('<div>');
            imgContainer.attr('class', 'card');
            let img = $('<img>');
            if(movie.poster_link){
                img.attr('src', movie.poster_link);
                img.attr('class', 'card-img');
            } else{
                img.attr('class', 'card-img movie-poster');
            }
            img.attr('alt', movie.Title);
            imgContainer.append(img);
            imgCol.append(imgContainer);
            $('#list-container').append(imgCol);

            let infoCol = $('<div>');
            infoCol.attr('class', 'col-12 col-md-9');
            let infoContainer = $('<div>');
            infoContainer.attr('class', 'card h-100');
            let titleContainer = $('<div>');
            titleContainer.attr('class', 'card-title');
            let title = $('<h1>');
            title.text(movie.Title);
            titleContainer.append(title);
            infoContainer.append(titleContainer);

            let bodyContainer = $('<div>');
            bodyContainer.attr('class', 'card-body text-start');
            let director = $('<p>');
            director.text(`Director: ${movie.Directors}`);
            let stars = $('<p>');
            stars.text(`Stars: ${movie.Stars}`);
            let time = $('<p>');
            time.text(`Length: ${parseLength(movie.Runtime)}`);
            let year = $('<p>');
            year.text(`Release Year: ${movie.Year}`);
            let pg = $('<p>');
            pg.text(`Rated: ${movie.Certificate}`);
            let genre = $('<p>');
            genre.text(`Genre: ${movie.Genre}`);
            bodyContainer.append(director, stars, time, year, pg, genre);
            infoContainer.append(bodyContainer);

            let footerContainer = $('<div>');
            footerContainer.attr('class', 'card-footer d-flex flex-row-reverse');
            let viewMovie = $('<a>');
            viewMovie.attr('class', 'btn btn-primary m-2');
            viewMovie.attr('href', `/movie/${movie.id}`);
            viewMovie.text('View Movie');

            let viewReview = $('<a>');
            viewReview.attr('class', 'btn btn-primary m-2');

            let review = await hasReviewed(movie.id);
            if(review){
                viewReview.attr('href', `/editReview/${review.id}`);
                viewReview.text('Edit Review');
            } else{
                viewReview.attr('href', `/review/${movie.id}`);
                viewReview.text('Add Review');
            }
            footerContainer.append(viewMovie, viewReview);
            infoContainer.append(footerContainer);

            infoCol.append(infoContainer);
            $('#list-container').append(infoCol);
        }
    } else {
        let errContainer = $('<p>');
        errContainer.css('margin-bottom', '40vh');
        errContainer.text('Nothing Found!');
        $('#list-container').append(errContainer);
    }
}

function parseLength(movieLength){
    movieLength = movieLength * 1;
    const hours = Math.floor(movieLength/60);
    const minutes = movieLength % 60;
    return `${hours} hours ${minutes} minutes`
}

async function hasReviewed(movieId){
    let response = await fetch(`/api/reviews/${movieId}`);
    return await response.json();
}

async function nextPage(){
    if(pageNum !== lastPage){
        pageNum++;
        range = range.map(x => x + 10)
        const res = await fetch(lastSearch + range.join('-'));
        const data = await res.json();
        renderResults(data);
    }
}

async function prevPage(){
    if(pageNum !== 1){
        pageNum--;
        range = range.map(x => x - 10)
        const res = await fetch(lastSearch + range.join('-'));
        const data = await res.json();
        renderResults(data);
    }
}

function decideSearch(event){
    event.preventDefault();
    let title = $('#movieSearch').val();
    let actor = $('#actorSearch').val();
    let director = $('#directorSearch').val();
    let genre = $('#genreSearch').val();

    range = [1, 10];
    pageNum = 1;
    $('#movieSearch').autocomplete('close');
    $('#actorSearch').autocomplete('close');
    $('#directorSearch').autocomplete('close');
    $('#genreSearch').autocomplete('close');
    $('#movieSearch').val('');
    $('#actorSearch').val('');
    $('#directorSearch').val('');
    $('#genreSearch').val('');

    if(title && !actor && !director && !genre){
        //title
        singleSearch('1', title);
    } else if(!title && actor && !director && !genre){
        //actor
        singleSearch('2', actor);
    } else if(!title && !actor && director && !genre){
        //director
        singleSearch('3', director);
    } else if(!title && !actor && !director && genre){
        //genre
        singleSearch('4', genre);
    } else if(title && actor && !director && !genre){
        //title, actor
        doubleSearch('1', title, actor);
    } else if(title && !actor && director && !genre){
        //title, director
        doubleSearch('2', title, director);
    } else if(title && !actor && !director && genre){
        //title, genre
        doubleSearch('3', title, genre);
    } else if(!title && actor && director && !genre){
        //actor, director
        doubleSearch('4', actor, director);
    } else if(!title && actor && !director && genre){
        //actor, genre
        doubleSearch('5', actor, genre);
    } else if(!title && !actor && director && genre){
        //director, genre
        doubleSearch('6', director, genre);
    } else if(title && actor && director && !genre){
        //case 1: title, actor, director
        tripleSearch('1', title, actor, director);
    } else if(title && actor && !director && genre){
        //case 2: title, actor, genre
        tripleSearch('2', title, actor, genre);
    } else if(title && !actor && director && genre){
        //case 3: title, director, genre
        tripleSearch('3', title, director, genre);
    } else if(!title && actor && director && genre){
        //case 4: actor, director, genre
        tripleSearch('4', actor, director, genre);
    } else if(title && actor && director && genre){
        //actor, actor, director, genre
        fullSearch(title, actor, director, genre)
    } else {
        console.log("something went wrong! (unless everything was empty!)");
    }
}

async function singleSearch(caseStr, param){
    const term = param.replaceAll(' ', '_');
    const response = await fetch(`/api/movies/singleSearch/${term}/${caseStr}/${range.join('-')}`);
    lastSearch = `/api/movies/singleSearch/${term}/${caseStr}/`;
    const results = await response.json();
    renderResults(results);
}

async function doubleSearch(caseStr, paramOne, paramTwo){
    const term1 = paramOne.replaceAll(' ', '_');
    const term2 = paramTwo.replaceAll(' ', '_');
    const response = await fetch(`/api/movies/doubleSearch/${term1}/${term2}/${caseStr}/${range.join('-')}`);
    lastSearch = `/api/movies/doubleSearch/${term1}/${term2}/${caseStr}/`;
    const results = await response.json();
    renderResults(results);
}

async function tripleSearch(caseStr, paramOne, paramTwo, paramThree){
    const term1 = paramOne.replaceAll(' ', '_');
    const term2 = paramTwo.replaceAll(' ', '_');
    const term3 = paramThree.replaceAll(' ', '_');
    const response = await fetch(`/api/movies/tripleSearch/${term1}/${term2}/${term3}/${caseStr}/${range.join('-')}`);
    lastSearch = `/api/movies/tripleSearch/${term1}/${term2}/${term3}/${caseStr}/`;
    const results = await response.json();
    renderResults(results);
}

async function fullSearch(title, actor, director, genre){
    const titleParam = title.replaceAll(' ', '_');
    const actorParam = actor.replaceAll(' ', '_');
    const directorParam = director.replaceAll(' ', '_');
    const genreParam = genre.replaceAll(' ', '_');
    const response = await fetch(`/api/movies/fullSearch/${titleParam}/${actorParam}/${directorParam}/${genreParam}/${range.join('-')}`);
    lastSearch = `/api/movies/fullSearch/${titleParam}/${actorParam}/${directorParam}/${genreParam}/`;
    const results = await response.json();
    renderResults(results);
}

loadPage();
loadAutoComplete();
$('#movieSearch').keyup(ignoreThe);
$('#submitSearch').click(decideSearch);
$('#next-page-top').click(nextPage)
$('#next-page-bottom').click(nextPage)
$('#previous-page-top').click(prevPage)
$('#previous-page-bottom').click(prevPage)