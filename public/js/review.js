const newFormHandler = async (event) => {
    event.preventDefault();
  
    // adjust id names as necessary based on what's used in the form
    const title = document.querySelector('#review-title').value.trim();
    const body = document.querySelector('#review-body').value.trim();
    const rate = document.querySelector('#review-rate').value.trim();
    const movieId = 1; // pull from window.location 
  
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

// adjust class name as necessary based on what's used in the form
document.querySelector('.review-form').addEventListener('submit', newFormHandler);