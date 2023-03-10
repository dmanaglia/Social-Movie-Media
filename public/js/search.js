async function init(){
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
            const oneMovie = await fetch(`/api/movies/id/${ui.item.value}`);
            const response = await oneMovie.json();
            let results = [];
            results.push(response)
            renderResults(results);
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

async function searchTerm(){
    const term = $('#movieSearch').val().replaceAll(' ', '_');
    const response = await fetch(`/api/movies/${term}`);
    const results = await response.json();
    renderResults(results);
}

function renderResults(results){
    $('#list-container').empty();
    for(const movie of results){
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
        movieLink.text('View Movie')
        footerContainer.append(movieLink);
        infoContainer.append(footerContainer);

        infoCol.append(infoContainer);
        $('#list-container').append(infoCol);
    }
}

function parseLength(movieLength){
    movieLength = movieLength * 1;
    const hours = Math.floor(movieLength/60);
    const minutes = movieLength % 60;
    return `${hours} hours ${minutes} minutes`
}

$('#submitSearch').click(searchTerm);
init();
$('#movieSearch').keyup(ignoreThe);