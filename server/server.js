const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
}

app.use(cors());

app.get('/:dynamic', (req, res) => {
    let { dynamic } = req.params;
    if (dynamic == "currentLocation") {
    }
    else url = `http://api.weatherapi.com/v1/forecast.json?key=4e44dfbe320f4cb6b1725617241604&q=${dynamic}&days=5&aqi=no&alerts=no`;
    fetch(url)
        .then(res => { return res.json() })
        .then(data => res.json(data))
        .catch(error => res.json(error))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})