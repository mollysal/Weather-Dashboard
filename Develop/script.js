//Variables from Left Hand side
var searchFormEl = $('#search-form');
var searchInputEl = $('#cityInput');
var searchListEl = $('.list-group');

//Variables from Right Hand side 
var currentWeatherEl = $('#currentWeatherEl');
var currentCity = $('#currentCity');
var currentDate = $('#currentDate').text(moment().format("M/D/YYYY"));
var currentWeatherIcon = $('#currentWeatherIcon');
var cTemp = $('#cTemp');
var cHum = $('#cHum');
var cWind = $('#cWind');
var cWind = $('#cWind');
var cWind = $('#cWind');
var lookAheadEl = $('lookAhead');

//API Key
const apiKey = '64e8e895c4d71cf5e75c9837e6e88c15';

//Take user input, City Name & Send cityName to get coordinates
function handleSearchFormSubmit(event) {
    event.preventDefault();
    let cityName = searchInputEl.value.trim();

    if (cityName) {
        getCoords(cityName);
    } else {
        console.log("Enter valid City Name!");
        alert("Enter valid City Name!");
        return;
    }
}

//Take the city Name from above & convert to coordinates
var getCoords = function(cityName) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&appid=' + apiKey;

    fetch(apiURL).then(function (res){
        return res.json();
    }).then(function(data) {
        let lat = data.coord.lat;
        let long = data.coord.lon;
        getWeather(lat,long);
    })
    .catch(function(error){
        console.error(error);
        return;
    })
}

//From the above coordinates go get the Weather
var getWeather = function(lat, long) {
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat+ "&lon=" + long + "&appid=" + apiKey + "&units=imperial"
    //go to Weather API with Coordinates of the City
    fetch(apiURL).then(function(res){
        if(res.ok){
            return res.json();
        } else {
            alert("Enter a valid City");
        }
        //If the results are valid go display the weather of the city
    }) .then(function(data){
        displayWeather(data);
        displayLookAhead(data);
    })
}