async function init(){
    const currentUrl = window.location.toString().split('/');
    const movieId = currentUrl[currentUrl.length - 1];
    let response = await fetch(`/api/reviews/${movieId}`);
    let review = await response.json();
    let reviewLink = document.getElementById('edit-or-add-review');
    console.log(reviewLink);
    if(review){
        console.log('reviewed');
       reviewLink.setAttribute('href', `/editReview/${review.id}`);
       reviewLink.innerHTML = 'Edit Review';
    } else{
        console.log('not reviewed');
        reviewLink.setAttribute('href', `/review/${movieId}`);
        reviewLink.innerHTML = 'Add Review';
    }
}

init()