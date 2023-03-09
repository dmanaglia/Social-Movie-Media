fetch(`/api/movies/allTitles`)
.then((res) => {
    return res.json();
})
.then((data) => {
    let titles = []
    for(const movie of data){
        titles.push({label: movie.Title, value: movie.id})
    }
    $( "#movieSearch" ).autocomplete({
        source: titles,
        minLength: 3,
        select: async function(event, ui) {
            const oneMovie = await fetch(`/api/movies/${ui.item.value}`);
            const response = await oneMovie.json();
            console.log(response);
            $(this).val(''); //resets the input element to an empty string
        }
    })
});


function renderResults(results){
    
}