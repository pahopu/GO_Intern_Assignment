const searchBtn = document.getElementById("search-btn"); // Get the search button element
const currLocationBtn = document.getElementById("my-location-btn"); // Get the current location button element
const input = document.getElementById("city-name"); // Get the input element for city name

const locate = document.getElementById("locate"); // Get the element to display location
const wtext = document.getElementById("wtext"); // Get the element to display weather text
const anounce = document.getElementById('error-anounce'); // Get the element to display error message

const dates = document.querySelectorAll(".date"); // Get all elements with class "date"
const temps = document.querySelectorAll(".temp"); // Get all elements with class "temp"
const winds = document.querySelectorAll(".wind"); // Get all elements with class "wind"
const humids = document.querySelectorAll(".humid"); // Get all elements with class "humid"
const icons = document.querySelectorAll(".icon"); // Get all elements with class "icon"

const coords = {
    lat: undefined,
    long: undefined
};
getLocation(); // Call the function to get user's location

function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition); // Get user's current position
}

function showPosition(position) {
    coords.lat = position.coords.latitude; // Store latitude in coords object
    coords.long = position.coords.longitude; // Store longitude in coords object
}

const baseURL = 'https://go-intern-assignment.onrender.com/'; // Base URL for API

fetch(baseURL) // Fetch data from the API
    .then(res => res.json()) // Convert response to JSON
    .then(data => {
        const loader = document.querySelector(".loader"); // Get the loader element
        loader.classList.remove("loader-hidden"); // Remove the "loader-hidden" class to show the loader

        getData(data); // Call the function to process the data

        loader.classList.add("loader-hidden"); // Add the "loader-hidden" class to hide the loader
        loader.addEventListener("transitionend", () => {
            document.body.removeChild("loader"); // Remove the loader element from the DOM
        });
    });

searchBtn.addEventListener("click", getInfo); // Add click event listener to search button

input.addEventListener("change", () => {
    anounce.style.display = "none"; // Hide the error message when input value changes
});

input.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        getInfo(e); // Call the function to get weather info when Enter key is pressed
    }
});

function getData(data) {
    if (data.hasOwnProperty('error')) {
        anounce.innerText = "The city name you just entered does not exist"; // Display error message if city name does not exist
        anounce.style.display = "block"; // Show the error message
    } else {
        locate.innerText = data["location"]["name"]; // Display the location name
        dates.forEach((date, i) => {
            date.innerText = data["forecast"]["forecastday"][i]["date"]; // Display the date for each forecast day
        });
        temps.forEach((temp, i) => {
            temp.innerText = data["forecast"]["forecastday"][i]["day"]["avgtemp_c"]; // Display the average temperature for each forecast day
        });
        winds.forEach((wind, i) => {
            wind.innerText = (data["forecast"]["forecastday"][i]["day"]["maxwind_kph"] / 3.6).toFixed(2); // Display the wind speed for each forecast day
        });
        humids.forEach((humid, i) => {
            humid.innerText = data["forecast"]["forecastday"][i]["day"]["avghumidity"]; // Display the average humidity for each forecast day
        });
        wtext.innerText = data["forecast"]["forecastday"][0]["day"]["condition"]["text"]; // Display the weather condition text for the current day
        icons.forEach((icon, i) => {
            icon.setAttribute("src", data["forecast"]["forecastday"][i]["day"]["condition"]["icon"]); // Set the source attribute of the icon image for each forecast day
        });
    }
}

async function getInfo(e) {
    const loader = document.querySelector(".loader"); // Get the loader element
    loader.classList.remove("loader-hidden"); // Remove the "loader-hidden" class to show the loader

    e.preventDefault(); // Prevent form submission
    anounce.style.display = "none"; // Hide the error message

    if (input.value == "") {
        anounce.innerText = "You have not entered a city name"; // Display error message if no city name is entered
        anounce.style.display = "block"; // Show the error message
    } else {
        const res = await fetch(baseURL + input.value); // Fetch data for the entered city name
        const data = await res.json(); // Convert response to JSON
        getData(data); // Call the function to process the data
    }

    loader.classList.add("loader-hidden"); // Add the "loader-hidden" class to hide the loader
    loader.addEventListener("transitionend", () => {
        document.body.removeChild("loader"); // Remove the loader element from the DOM
    });
}

currLocationBtn.addEventListener("click", getCurr); // Add click event listener to current location button

async function getCurr(e) {
    const loader = document.querySelector(".loader"); // Get the loader element
    loader.classList.remove("loader-hidden"); // Remove the "loader-hidden" class to show the loader

    e.preventDefault(); // Prevent form submission
    anounce.style.display = "none"; // Hide the error message

    getLocation(); // Get user's current location

    const res = await fetch(baseURL + `currentLocation?lat=${coords.lat}&long=${coords.long}`); // Fetch data for current location
    const data = await res.json(); // Convert response to JSON

    getData(data); // Call the function to process the data

    loader.classList.add("loader-hidden"); // Add the "loader-hidden" class to hide the loader
    loader.addEventListener("transitionend", () => {
        document.body.removeChild("loader"); // Remove the loader element from the DOM
    });
}