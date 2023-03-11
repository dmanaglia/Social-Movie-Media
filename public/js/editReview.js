const editFormHandler = async (event) => {
    event.preventDefault();

    const currentUrl = window.location.toString().split('/');
    const reviewId = currentUrl[currentUrl.length - 1];

    const title = document.querySelector('#review-title').value.trim();
    const body = document.querySelector('#review-body').value.trim();
    const rate = document.querySelector('input[name="rateOptions"]:checked').value;

    const movieId = event.target.getAttribute('data-id');

    if (reviewId && title && body && rate) {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify({ title, body, rate }),
            headers: {
                'Content-Type': 'application/json',
            },
         });
  
        if (response.ok) {
            document.location.replace(`/movie/${movieId}`);
        } else {
            alert('Failed to edit review');
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

document.querySelector('#edit-review').addEventListener('click', editFormHandler);
document.querySelector('#delete-review').addEventListener('click', delButtonHandler);