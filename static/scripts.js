document.addEventListener('DOMContentLoaded', () => {
    // Initial authentication check when DOM is fully loaded
    checkAuthentication();

    // Retrieve elements for login and logout
    const loginForm = document.getElementById('login-form');
    const logoutLink = document.getElementById('logout-link');

    // If login form exists, attach event listener to handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await loginUser(email, password);
            } catch (error) {
                console.error('Error during login:', error);
                alert('Login failed: ' + error.message);
            }
        });
    }

    // If logout link exists, attach event listener to handle logout
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logoutUser();
        });
    }

    // Add event listener to the country filter dropdown for filtering places
    const countryFilter = document.getElementById('country-filter');
    if (countryFilter) {
        countryFilter.addEventListener('change', (event) => {
            filterPlaces(event.target.value);
        });
    }

    // Check if current page is place details page and fetch place details if true
    if (window.location.pathname.includes('place.html')) {
        const placeId = getPlaceIdFromURL();
        checkAuthenticationForPlaceDetails(placeId);
    }

    // Add event listener for the review form on the add_review.html page
    if (window.location.pathname.includes('add_review.html')) {
        const reviewForm = document.getElementById('review-form');
        const token = checkAuthentication();
        const placeId = getPlaceIdFromURL();

        if (reviewForm) {
            reviewForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const reviewText = document.getElementById('review-text').value;
                await submitReview(token, placeId, reviewText);
            });
        }
    }
});

// Function to submit a review
async function submitReview(token, placeId, reviewText) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ place_id: placeId, text: reviewText })
        });
        handleResponse(response);
    } catch (error) {
        alert('Failed to submit review');
    }
}

// Function to handle the response after submitting a review
function handleResponse(response) {
    if (response.ok) {
        alert('Review submitted successfully!');
        document.getElementById('review-form').reset();
        // Optionally, redirect to the place details page to see the new review
        const placeId = getPlaceIdFromURL();
        window.location.href = `place.html?place_id=${placeId}`;
    } else {
        alert('Failed to submit review');
    }
}

// Utility function to get place ID from URL
function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('place_id');
}

// Function to log in the user
async function loginUser(email, password) {
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.access_token}; path=/`;
        window.location.href = 'http://127.0.0.1:5000/';
    } else {
        const errorData = await response.json();
        alert('Login failed: ' + errorData.message);
    }
}

// Utility function to get a cookie value by name
function getCookie(name) {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    return null;
}

// Function to check user authentication status
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');

    if (!token) {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
    } else {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        fetchPlaces(token);
    }
    return token;
}

// Function to fetch the list of places from the server
async function fetchPlaces(token) {
    try {
        const response = await fetch('http://127.0.0.1:5000/places', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
            populateCountryFilter(places);
        } else {
            console.error('Failed to fetch places:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

// Function to display the fetched places on the index page
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';

        // Construct the image filename from the place ID
        const placeId = place.id.split('-')[1]; // Extract the numeric part of the ID
        const imageUrl = `static/place${placeId}.jpg`;

        placeCard.innerHTML = `
            <img src="${imageUrl}" class="place-image" alt="Place Image">
            <h3>${place.description}</h3>
            <p>Price per night: $${place.price_per_night}</p>
            <p>Location: ${place.city_name}, ${place.country_name}</p>
            <button class="details-button" data-id="${place.id}">View Details</button>
        `;
        placeCard.querySelector('.details-button').addEventListener('click', () => {
            window.location.href = `place.html?place_id=${place.id}`;
        });

        placesList.appendChild(placeCard);
    });
}

// Function to populate the country filter dropdown
function populateCountryFilter(places) {
    const countryFilter = document.getElementById('country-filter');
    const countries = [...new Set(places.map(place => place.country_name))];

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });
}

// Function to filter displayed places by selected country
function filterPlaces(selectedCountry) {
    const placeCards = document.querySelectorAll('.place-card');

    placeCards.forEach(card => {
        const location = card.querySelector('p').innerText.split(': ')[1];
        if (location.includes(selectedCountry) || selectedCountry === 'All') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to log out the user
function logoutUser() {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = 'login.html';
}

// Function to check authentication specifically for place details page
function checkAuthenticationForPlaceDetails(placeId) {
    const token = getCookie('token');
    const addReviewSection = document.querySelector('.review-button-div');

    if (!token) {
        if (addReviewSection) addReviewSection.style.display = 'none';
        fetchPlaceDetails(null, placeId);
    } else {
        if (addReviewSection) addReviewSection.style.display = 'block';
        fetchPlaceDetails(token, placeId);
    }
}

// Function to fetch place details from the server
async function fetchPlaceDetails(token, placeId) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, { headers });

    if (response.ok) {
        const place = await response.json();
        displayPlaceDetails(place);
    } else {
        console.error('Failed to fetch place details:', response.statusText);
    }
}

// Function to display detailed information about a place
function displayPlaceDetails(place) {
    const placeDetailsSection = document.getElementById('place-details');
    placeDetailsSection.innerHTML = `
        <img src="static/place${place.id.split('-')[1]}.jpg" alt="${place.name}" class="place-large-image">
        <div class="place-info">
            <p><strong>Host:</strong> ${place.host_name}</p>
            <p><strong>Price per night:</strong> $${place.price_per_night}</p>
            <p><strong>Location:</strong> ${place.city_name}, ${place.country_name}</p>
            <p><strong>Description:</strong> ${place.description}</p>
            <p><strong>Amenities:</strong> ${place.amenities.join(', ')}</p>
        </div>
    `;

    const reviewsSection = document.getElementById('reviews');
    reviewsSection.innerHTML = '<h3>Reviews</h3>';
    place.reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';

        reviewCard.innerHTML = `
            <h4>${review.user_name}</h4>
            <p>${review.comment}</p>
            <p>Rating: ${review.rating} stars</p>
        `;

        reviewsSection.appendChild(reviewCard);
    });
}
