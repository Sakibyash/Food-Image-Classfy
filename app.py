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
        <p><strong>Name:</strong> ${details.label}</p>
        <p><strong>Description:</strong> ${details.description}</p>
    `;
}
