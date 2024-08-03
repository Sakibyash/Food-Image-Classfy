const token = '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';

async function predict() {
    const fileInput = document.getElementById('imageUpload');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please upload an image.');
        return;
    }

    const formData = new FormData();
    formData.append('img', file);

    try {
        const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        document.getElementById('result').innerText = `Prediction: ${response.data.label}`;

        // Fetch dish details
        const detailsResponse = await axios.get(`http://127.0.0.1:5000/dish_details/${response.data.label}`);
        displayDishDetails(detailsResponse.data);
    } catch (error) {
        console.error('Error making prediction:', error);
        document.getElementById('result').innerText = 'Error making prediction';
    }
}

function displayDishDetails(details) {
    const detailsDiv = document.getElementById('dish-details');
    detailsDiv.innerHTML = `
        <h2>Dish Details</h2>
        <p><strong>Name:</strong> ${details.name}</p>
        <p><strong>Main Ingredients:</strong> ${details.ingredients.join(', ')}</p>
        <p><strong>Description:</strong> ${details.description}</p>
    `;
}
