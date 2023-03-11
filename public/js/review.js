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
  
        if (response.ok) {
            document.location.replace(`/movie/${movieId}`);
        } else {
            alert('Failed to create review');
        }
    }
};

const goBack = (event) => {
    event.preventDefault();
    console.log('workingish');
    history.back();
}

document.querySelector('#go-back-btn').addEventListener('click', goBack);
document.querySelector('#submit-review').addEventListener('click', newFormHandler);