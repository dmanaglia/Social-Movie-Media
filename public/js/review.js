// handler for posting new reviews
const newFormHandler = async (event) => {
    event.preventDefault();

    // pull title, body, and rate from user's inputs into form
    const title = document.querySelector('#review-title').value.trim();
    const body = document.querySelector('#review-body').value.trim();
    const rate = document.querySelector('input[name="rateOptions"]:checked').value;

    // pull movie id from location
    const currentUrl = window.location.toString().split('/');
    const movieId = currentUrl[currentUrl.length - 1];

    // if all necessary data exists...
    if (title && body && rate && movieId) {
        // send POST request to api/reviews with title, body, rate, and movieId in body; userId provided by session
        const response = await fetch(`/api/reviews`, {
            method: 'POST',
            body: JSON.stringify({ title, body, rate, movieId }),
            headers: {
                'Content-Type': 'application/json',
            },
         });
  
        // if review posted successfully, redirect to movie's page
        if (response.ok) {
            document.location.replace(`/movie/${movieId}`);
        } else {
            alert('Failed to create review');
        }
    }
};

const goBack = (event) => {
    event.preventDefault();
    history.back();
}

// add event listeners to buttons
document.querySelector('#go-back-btn').addEventListener('click', goBack);
document.querySelector('#submit-review').addEventListener('click', newFormHandler);