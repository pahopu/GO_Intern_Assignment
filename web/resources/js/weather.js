const searchBtn = document.getElementById("search-btn");
const currLocationBtn = document.getElementById("my-location-btn");
const input = document.getElementById("city-name");

const location = document.getElementById("location");

const baseURL = 'http://api.weatherapi.com/v1/current.json?key=4e44dfbe320f4cb6b1725617241604&q=' + input.value;