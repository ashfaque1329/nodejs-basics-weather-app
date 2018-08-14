const yargs = require("yargs");
const axios = require("axios");

//const geocode = require("./geocode/geocode");
//const weather = require("./weather/weather");

const argv = yargs
  .options({
    a: {
      demandOption: true,
      alias: "address",
      describe: "Address to fetch weather for",
      string: true
    }
  })
  .help()
  .alias("help", "h").argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios
  .get(geocodeUrl)
  .then(response => {
    if (response.data.status === "ZERO_RESULTS") {
      throw new Error("Unable to find that address.");
    }

    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/45fc7c41df6686b8b5b66297d08df104/${lat},${lng}`;

    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
  })
  .then(response => {
    var temperature = response.data.currently.temperature;
    var apparentTemperature = response.data.currently.apparentTemperature;
    console.log(
      `It's currently ${temperature}. It feels like ${apparentTemperature}`
    );
  })
  .catch(error => {
    if (error.code === "ENOTFOUND") {
      console.log("Unable to connect to API servers.");
    } else {
      console.log(error.message);
    }
  });
