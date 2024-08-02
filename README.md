# HBnB Client

## Overview

HBnB Client is a dynamic web application project designed to provide users with the ability to browse and review various places. The project involves both front-end and back-end development, using HTML5, CSS3, JavaScript ES6, and Python with Flask for the API.

## Objectives

- Develop a user-friendly interface following provided design specifications.
- Implement client-side functionality to interact with the back-end API.
- Ensure secure and efficient data handling using JavaScript.
- Apply modern web development practices to create a dynamic web application.

## Learning Goals

- Understand and apply HTML5, CSS3, and JavaScript ES6 in a real-world project.
- Learn to interact with back-end services using AJAX/Fetch API.
- Implement authentication mechanisms and manage user sessions.
- Use client-side scripting to enhance user experience without page reloads.

## Features

- **Login/Logout**: Secure authentication system to manage user sessions.
- **List of Places**: View a list of places with details like description, price, and location.
- **Place Details**: Detailed view of each place, including images, description, and amenities.
- **Add Review**: Authenticated users can add reviews for places.
- **Client-Side Filtering**: Filter places by country without reloading the page.

## Getting Started

### Prerequisites

- Python 3.6+
- Flask
- JavaScript ES6
- HTML5 and CSS3

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kryssbm99/hbnb-client.git
   ```

2. Navigate to the project directory:
   ```bash
   cd hbnb-client
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open your browser and go to:
   ```bash
   http://127.0.0.1:5000/
   ```

### Usage

- **Login:** Navigate to the login page and enter your credentials.
- **Browse Places:** View the list of available places on the main page.
- **View Details:** Click on a place to see detailed information.
- **Add Review:** If logged in, you can add reviews to places.

### Project Structure

- **app.py:** Main Flask application file.
- **static/:** Directory containing static files like CSS, JavaScript, and images.
  - **styles.css:** Main stylesheet.
  - **scripts.js:** Main JavaScript file.
- **templates/:** Directory containing HTML templates.
  - **index.html:** Main page listing all places.
  - **login.html:** Login page.
  - **place.html:** Detailed view of a place.
  - **add_review.html:** Form to add a review.

### Authors

- **Kryss Babilonia** - [kryssbm99](https://github.com/kryssbm99)

Special thanks to all contributors and the Holberton School community for their support and guidance.
