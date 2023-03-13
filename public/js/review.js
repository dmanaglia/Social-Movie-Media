const newFormHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#review-title').value.trim();
    const body = document.querySelector('#review-body').value.trim();
    const rate = document.querySelector('input[name="rateOptions"]:checked').value;
    const currentUrl = window.location.toString().split('/');
    const movieId = currentUrl[currentUrl.length - 1];
  
    if (title && body && rate && movieId) {
        const response = await fetch(`/api/reviews`, {
            method: 'POST',
            body: JSON.stringify({ title, body, rate, movieId }),
            headers: {
                'Content-Type': 'application/json',
            },
         });
         console.log(response.status);
        if (response.status === 200) {
            document.location.replace(`/movie/${movieId}`);
        } else if(response.status === 300){
            let reviewData = await response.json();
            alert(`You have already reviewed this movie...redirecting to edit review page`);
            document.location.replace(`/editReview/${reviewData.id}`);
        } else{
            alert('Failed to create review');
        }
    } else {
        alert('You must fill out all fields');
    }
};

const goBack = (event) => {
    event.preventDefault();
    history.back();
}

document.querySelector('#go-back-btn').addEventListener('click', goBack);
document.querySelector('#submit-review').addEventListener('click', newFormHandler);