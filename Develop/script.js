//Variables from Left Hand side
var searchFormEl = $('#search-form');
var searchInputEl = $('#cityInput');
var searchListEl = $('.list-group');

//Variables from Right Hand side 
var rightSide = $('#rightSide');
var currentWeatherEl = $('#currentWeatherEl');
var currentCity = $('#currentCity');
var currentDate = $('#currentDate').text(moment().format("M/D/YYYY"));
var currentWeatherIcon = $('#currentWeatherIcon');
var cTemp = $('#cTemp');
var cHum = $('#cHum');
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
        let lon = data.coord.lon;
        getWeather(lat,lon);
    })
    .catch(function(error){
        console.error(error);
        return;
    })
}

//From the above coordinates go get the Weather
var getWeather = function(lat, long) {
    let apiURL = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat+ "&lon=" + lon + "&appid=" + apiKey + "&units=imperial"
    //go to Weather API with Coordinates of the City
    fetch(apiURL).then(function(res){
        if(res.ok){
            return res.json();
        } else {
            alert("Enter a valid City");
        }
        //If the results are valid go display the weather of the city
    }) .then(function(data){
        displayCurrentWeather(data);
        displayLookAhead(data);
    })
}

//Display Current Weather (Top Area)
var displayCurrentWeather = function(data) {
    //Unhide Right Side
    rightSide.addClass("display");

    let apiUrl = "http://api.openweathermap.org/geo/1.0/reverse?lat="+ data.lat + "&lon=" + data.lon + "&limit=1&appid=" + apiKey
    
    fetch(apiUrl).then(function(res){
        return res.json();
    }).then(function(data){
        currentCity.text = cityName + " " + currentDate;
        currentWeatherIcon.attr("src", "https://openweathermap.org/img/w/" + res.weather[0].icon + ".png");
        //take the date & insert it into Save City Function
        saveCity(data[0].name);
    })
    cTemp.text = data.current.temp;
    cHum.text = data.current.humidity;
    cWind.text = data.current.wind_speed;
}

//Display 5 day Look Ahead (Bottom Area)
var displayLookAhead = function(data) {
    //Unhide Right Side
    rightSide.addClass("display");

    //Establish a info for each card
    for (i = 1; i<6; i++) {
        var lookAheadWeather = {
            date: moment().add(i, 'd').format('M/D/YYYY'),
            icon: "https://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png",
            temp: data.daily[i].temp.day.toFixed(1),
            hum: data.daily[i].humidity
        }
        var currentItem = "#day"+i;
        $(currentItem)[0].textContent = lookAheadWeather.date;
        //re-define currentItem variable
        currentItem = "#img"+i;
        $(currentItem)[0].src = lookAheadWeather.icon;
    
        currentItem = "#tem"+i;
        $(currentItem)[0].textContent = lookAheadWeather.temp;
    
        currentItem = "#hum"+i;
        $(currentItem)[0].textContent = lookAheadWeather.hum + "%";
    }
}

//Saving the City Info
let saveCity = function(cityName) {
    if (searchFormEl.includes(cityName)){
        return;
    } else {
        searchFormEl.push(cityName)
        localStorage.setItem("search", json.stringify(search));
        loadSearch();
    }
}

//Loading past City Searches from Local Storage
let loadSearch = function() {
    if(search.lenth>0){
        searchListEl.innerHTML = "";
        for (i=0; i<search.lenth; i++) {
            let searchBtn = document.createElement("button")
            //adding class from BootStrap
            searchBtn.className = "search-btn mb-2";
            searchBtn.textContent = search[i];
            searchListEl.appendChild(searchBtn); 
        }

    } else {
        searchListEl.innerHTML = "";
    }
}

//When you click a previously searched City - need to run through get coords again