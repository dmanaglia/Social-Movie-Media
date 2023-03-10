var range = [1, 10];
var pageNum = 1;
var lastPage = 200;
var lastSearch = '';

async function loadPage(){
    const res = await fetch(`/api/movies/get/all/${range.join('-')}`);
    lastSearch = `/api/movies/get/all/`;
    const results = await res.json();
    renderResults(results);
}

async function loadAutoComplete(){
    let titles = [];
    const res = await fetch(`/api/movies/allTitles`);
    const data = await res.json();
    for(const movie of data){
        titles.push({label: movie.Title, value: movie.id});
    }
    $( "#movieSearch" ).autocomplete({
        source: titles,
        minLength: 4,
        select: async function(event, ui) {
            const response = await fetch(`/api/movies/get/one/${ui.item.value}`);
            const oneMovie = await response.json();
            let movieData = [];
            movieData.push(oneMovie)
            renderResults({total:1, movieData});
            $(this).val(''); //resets the input element to an empty string
        }
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

async function searchTerm(event){
    event.preventDefault();
    range = [1, 10];
    pageNum = 1;
    const term = $('#movieSearch').val().replaceAll(' ', '_');
    const response = await fetch(`/api/movies/${term}/${range.join('-')}`);
    lastSearch = `/api/movies/${term}/`;
    const results = await response.json();
    renderResults(results);
}

async function renderResults({total, movieData}){
    if(total % 10 === 0){
        lastPage = total / 10;
    } else {
        lastPage = Math.floor(total / 10) + 1;
    }
    $('#result-count').text(total);
    let displayRange = [...range];
    if(displayRange[1] > total){
        displayRange[1] = total;
    }
    $('#result-range').text(displayRange.join('-'));
    $('#list-container').empty();
    if(movieData){
        for(const movie of movieData){
            let imgCol = $('<div>');
            imgCol.attr('class', 'col-3');
            let imgContainer = $('<div>');
            imgContainer.attr('class', 'card h-100');
            let img = $('<img>');
            img.attr('class', 'card-img movie-poster');
            img.attr('alt', movie.Title);
            imgContainer.append(img);
            imgCol.append(imgContainer);
            $('#list-container').append(imgCol);

            let infoCol = $('<div>');
            infoCol.attr('class', 'col-9');
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
            footerContainer.attr('class', 'card-footer text-end');
            let movieLink = $('<a>');
            movieLink.attr('class', 'btn btn-primary');
            movieLink.attr('href', `/movie/${movie.id}`);
            let reviewed = await hasReviewed(movie.id);
            if(reviewed){
                movieLink.text('Edit Review');
            } else{
                movieLink.text('Add Review');
            }
            footerContainer.append(movieLink);
            infoContainer.append(footerContainer);

            infoCol.append(infoContainer);
            $('#list-container').append(infoCol);
        }
    }else {
        let errContainer = $('<div>');
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

loadPage();
loadAutoComplete();
$('#movieSearch').keyup(ignoreThe);
$('#submitSearch').click(searchTerm);
$('#next-page-top').click(nextPage)
$('#next-page-bottom').click(nextPage)
$('#previous-page-top').click(prevPage)
$('#previous-page-bottom').click(prevPage)