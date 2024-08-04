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
        const response = await axios.post('https://hf.space/embed/Sakibrumu/Food_Image_Classification/api/predict/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Display prediction result
        const label = response.data[0].label;
        document.getElementById('result').innerText = `Prediction: ${label}`;

        // Fetch dish details
        const detailsResponse = await fetchDishDetails(label);
        displayDishDetails(detailsResponse);
    } catch (error) {
        console.error('Error making prediction:', error);
        document.getElementById('result').innerText = 'Error making prediction';
    }
}

async function fetchDishDetails(label) {
    try {
        const response = await fetch('dish_details.json');
        const data = await response.json();

        // Find the matching dish detail
        for (const key in data) {
            if (data[key].label === label) {
                return data[key];
            }
        }

        return null;
    } catch (error) {
        console.error('Error fetching dish details:', error);
        return null;
    }
}

function displayDishDetails(details) {
    if (!details) {
        document.getElementById('dish-details').innerText = 'No details available for this dish.';
        return;
    }
    
    const detailsDiv = document.getElementById('dish-details');
    detailsDiv.innerHTML = `
        <h2>Dish Details</h2>
        <p><strong>Name:</strong> ${details.label}</p>
        <p><strong>Description:</strong> ${details.description}</p>
    `;
}
