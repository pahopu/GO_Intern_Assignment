import express from 'express'; // Import the express module
import cors from 'cors'; // Import the cors module
import nodemailer from 'nodemailer'; // Import the nodemailer module

const app = express(); // Create an instance of the express application
const port = 3000; // Set the port number for the server

app.use(cors()); // Enable CORS for the server
app.use(express.json()); // for parsing application/json

let weatherHistory = null; // Variable to store weather history temporarily
let nameOfCity = null;

app.get('/', (_req, res) => { // Handle GET requests to the root endpoint
    const url = `http://api.weatherapi.com/v1/forecast.json?key=4e44dfbe320f4cb6b1725617241604&q=Ho Chi Minh City&days=5&aqi=no&alerts=no`; // Define the URL for weather API
    fetch(url) // Fetch weather data from the API
        .then(res => res.json()) // Parse the response as JSON
        .then(data => {
            weatherHistory = data; // Save weather data to the variable
            res.json(data); // Send weather data as response
            nameOfCity = data.location.name;
        })
        .catch(error => res.json(error)); // Handle any errors that occur during the process
});

app.get('/:dynamic', (req, res) => { // Handle GET requests with dynamic route parameter
    const { dynamic } = req.params; // Get the dynamic parameter value
    if (dynamic == nameOfCity) {
        res.json(weatherHistory);
    } else {
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
                nameOfCity = data.location.name;
            })
            .catch(error => res.json(error)); // Handle any errors that occur during the process
    }
});

app.post('/send-email', async (req, res) => {
    let { email, subject, text } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'weatherforecast172@gmail.com',
            pass: 'WeatherGo123'
        }
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ status: 'Email sent' });
    } catch (error) {
        res.json({ status: 'Failed to send email', error: error.toString() });
    }
});

app.listen(port, () => { // Start the server and listen on the specified port
    console.log(`Weather server is listening on port ${port}`); // Log a message when the server starts
});
