const searchBtn = document.getElementById("search-btn");
const currLocationBtn = document.getElementById("my-location-btn");
const input = document.getElementById("city-name");

const locate = document.getElementById("locate");
const dates = document.querySelectorAll(".date");
const temps = document.querySelectorAll(".temp");
const winds = document.querySelectorAll(".wind");
const humids = document.querySelectorAll(".humid");
const wtext = document.getElementById("wtext")
const icons = document.querySelectorAll(".icon")

baseURL = 'http://localhost:3000/'

searchBtn.addEventListener("click", getInfo);

function getData(data) {
    locate.innerText = data["location"]["name"];
    dates.forEach((date, i) => {
        date.innerText = data["forecast"]["forecastday"][i]["date"];
    })
    temps.forEach((temp, i) => {
        temp.innerText = data["forecast"]["forecastday"][i]["day"]["avgtemp_c"];
    })
    winds.forEach((wind, i) => {
        wind.innerText = (data["forecast"]["forecastday"][i]["day"]["maxwind_kph"] / 3.6).toFixed(2);
    })
    humids.forEach((humid, i) => {
        humid.innerText = data["forecast"]["forecastday"][i]["day"]["avghumidity"];
    })
    wtext.innerText = data["forecast"]["forecastday"][0]["day"]["condition"]["text"];
    icons.forEach((icon, i) => {
        icon.setAttribute("src", data["forecast"]["forecastday"][i]["day"]["condition"]["icon"])
    })
}

async function getInfo(e) {
    e.preventDefault();
    const res = await fetch(baseURL + input.value);
    const data = await res.json();
    getData(data);
}

coords = {
    'lat': undefined,
    'long': undefined
}
getLocation();

currLocationBtn.addEventListener("click", getCurr);

function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
    coords.lat = position.coords.latitude;
    coords.long = position.coords.longitude;
}

async function getCurr(e) {
    e.preventDefault();
    getLocation();
    const res = await fetch(baseURL + `currentLocation?lat=${coords.lat}&long=${coords.long}`);
    const data = await res.json();
}