const editFormHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#review-title').value.trim();
    const body = document.querySelector('#review-body').value.trim();
    const rate = document.querySelector('input[name="rateOptions"]:checked').value;
    const movieId = event.target.getAttribute('data-id');
  
    if (title && body && rate && movieId) {
        const response = await fetch(`/api/reviews`, {
            method: 'PUT',
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

const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');
    
        const response = await fetch(`/api/reviews/${id}`, {
            method: 'DELETE',
        });
  
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to delete review');
        }
    }
};