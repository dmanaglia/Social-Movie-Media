// handler for editing reviews
const editFormHandler = async (event) => {
    event.preventDefault();

    // pull review id from location
    const currentUrl = window.location.toString().split('/');
    const reviewId = currentUrl[currentUrl.length - 1];

    // pull title, body, and rate from user's inputs into form
    const title = document.querySelector('#review-title').value.trim();
    const body = document.querySelector('#review-body').value.trim();
    const rate = document.querySelector('input[name="rateOptions"]:checked').value;

    // pull movie id from submit button's data-id attribute
    const movieId = event.target.getAttribute('data-id');

    // if user has provided all the data necessary to update a review...
    if (reviewId && title && body && rate && movieId) {
        // send PUT request to /api/reviews/:reviewId with title, body, and rate in body
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify({ title, body, rate }),
            headers: {
                'Content-Type': 'application/json',
            },
         });
  
        // if update was successful, redirect to that movie's page
        if (response.ok) {
            document.location.replace(`/movie/${movieId}`);
        } else {
            alert('Failed to edit review');
        }
    }
};

// handler for deleting reviews
const delButtonHandler = async (event) => {
    
    // delete button should have data-id attribute with value == review id
    if (event.target.hasAttribute('data-id')) {
        const reviewId = event.target.getAttribute('data-id');
    
        // send DELETE request to api/reviews/:reviewId
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE',
        });
  
        // if delete was successful, redirect to dashboard
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to delete review');
        }
    }
};

const goBack = (event) => {
    event.preventDefault();
    history.back();
}

// selects a radio option corresponding to what rating was previously selected in the review
const fillRadio = () => {
    const oldRating = document.querySelector('#review-rate').getAttribute('data-id');
    const oldRadio = document.querySelector(`#rate${oldRating}`);
    oldRadio.setAttribute('checked', "");
}

// run fillRadio function when page starts
fillRadio();

// add event listeners to the buttons
document.querySelector('#go-back-btn').addEventListener('click', goBack);
document.querySelector('#edit-review').addEventListener('click', editFormHandler);
document.querySelector('#delete-review').addEventListener('click', delButtonHandler);