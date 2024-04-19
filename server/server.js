import express from 'express'; // Import the express module
import cors from 'cors'; // Import the cors module
import fetch from 'node-fetch'; // Import the fetch module

const app = express(); // Create an instance of the express application
const port = 3000; // Set the port number for the server

app.use(cors()); // Enable CORS for the server

let weatherHistory = null; // Variable to store weather history temporarily

app.get('/', (_req, res) => { // Handle GET requests to the root endpoint
    const url = `http://api.weatherapi.com/v1/forecast.json?key=4e44dfbe320f4cb6b1725617241604&q=Ho Chi Minh City&days=5&aqi=no&alerts=no`; // Define the URL for weather API
    fetch(url) // Fetch weather data from the API
        .then(res => res.json()) // Parse the response as JSON
        .then(data => {
            weatherHistory = data; // Save weather data to the variable
            res.json(data); // Send weather data as response
        })
        .catch(error => res.json(error)); // Handle any errors that occur during the process
});

app.get('/:dynamic', (req, res) => { // Handle GET requests with dynamic route parameter
    const { dynamic } = req.params; // Get the dynamic parameter value
    let url = '';
    if (dynamic == "currentLocation") { // Check if dynamic parameter is "currentLocation"
        const { lat, long } = req.query; // Get latitude and longitude from query parameters
        url = `http://api.weatherapi.com/v1/forecast.json?key=4e44dfbe320f4cb6b1725617241604&q=${lat},${long}&days=5&aqi=no&alerts=no`; // Define the URL for weather API with latitude and longitude
    } else {
        url = `http://api.weatherapi.com/v1/forecast.json?key=4e44dfbe320f4cb6b1725617241604&q=${dynamic}&days=5&aqi=no&alerts=no`; // Define the URL for weather API with dynamic parameter
    }
    fetch(url) // Fetch weather data from the API
        .then(res => res.json()) // Parse the response as JSON
        .then(data => {
            weatherHistory = data; // Save weather data to the variable
            res.json(data); // Send weather data as response
        })
        .catch(error => res.json(error)); // Handle any errors that occur during the process
});

app.get('/history', (_req, res) => { // Handle GET requests to retrieve weather history
    if (weatherHistory) {
        res.json(weatherHistory); // Send weather history as response
    } else {
        res.json({ error: 'No weather history available' }); // Send error response if no weather history is available
    }
});

app.listen(port, () => { // Start the server and listen on the specified port
    console.log(`Weather server is listening on port ${port}`); // Log a message when the server starts
});