//Variables from Left Hand side
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector('#cityInput');
var searchListEl = document.querySelector('.list-group');

//Variables from Right Hand side 
var rightSide = document.querySelector('#rightSide');
var currentWeatherEl = document.querySelector('#currentWeatherEl');
var currentCity = document.querySelector('#currentCity');
var currentDate = document.querySelector('#currentDate');
var currentIconEl = document.querySelector('#current-icon');
var cTemp = document.querySelector('#cTemp');
var cHum = document.querySelector('#cHum');
var cWind = document.querySelector('#cWind');
var lookAheadEl = document.querySelector('#lookAhead');

//API Key
const apiKey = '64e8e895c4d71cf5e75c9837e6e88c15';

//Search from Local Storage
let search = JSON.parse(localStorage.getItem("search") || "[]");

// ---------------------------------------------FUNCTIONS BELOW------------------------------------------------------ //

//Take user input, City Name & Send cityName to get coordinates
let formSubmitHandler = function (event) {
    event.preventDefault();
    let cityName = searchInputEl.value.trim();
    searchInputEl.value = "";

    if (cityName) {
        getCoords(cityName);
        console.log(cityName);
    } else {
        alert("Enter valid City Name!");
        return;
    }
}

let cityName = searchInputEl.value;

//Take the city Name from above & convert to coordinates
function getCoords(cityName) {
    let apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + apiKey;
    //Print City Name in Current Weather Card
    currentCity.textContent = cityName;

    fetch(apiURL).then(function (res) {
        return res.json();
    }).then(function (data) {
        let lat = (data[0].lat);
        let lon = (data[0].lon);
        console.log(lat + "," + lon);

         //go to Weather API with Coordinates of the City
        let apiURL1 = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + apiKey;

        fetch(apiURL1).then(function (res) {
            if (res.ok) {
                return res.json();
            } else {
                alert("Enter a valid City");
            }
        //If the results are valid go display the weather of the city
        }).then(function (data) {
            displayCurrentWeather(data);
            displayLookAhead(data);
        })
    })
        .catch(function (error) {
            console.error("error");
            return;
        })
}

//From the above coordinates go get the Weather
//function getWeather() {
//}

//Display Current Weather (Top Area)
function displayCurrentWeather(data) {
    //Unhide Right Side
    rightSide.style.visibility = "visible";

    let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + data.lat + '&lon=' + data.lon + '&appid=' + apiKey + '&units=imperial'
    //let iconLink = "https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png"

    fetch(apiUrl).then(function (res) {
        return res.json();
    }).then(function (data) {
        //currentIconEl.innerHTML = "<img src" + iconLink + ">";
        //save Info was here ____________________________________
        /* saveSearch(coord);
        console.log(coord) */
    })
    cTemp.textContent = data.current.temp;
    cHum.textContent = data.current.humidity;
    cWind.textContent = data.current.wind_speed;
}

//Display 5 day Look Ahead (Bottom Area)
function displayLookAhead(data) {
    //Unhide Right Side
    rightSide.style.visibility = "visible";

    //adding future Dates
    for (i = 1; i < 6; i++) {
        let currentDay = document.querySelector("#day" + i);
        currentDay.textContent = moment().add(i, 'd').format('M/D/YYYY');
    }

    //adding Weather Info
    for (j = 1; j < 6; j++) {
        let currentData = data.daily[j];
        let iconLink = "https://openweathermap.org/img/w/" + currentData.weather[0].icon + ".png";

        let icon = document.querySelector("#img" + j);
        icon.src = iconLink;
        let temp = document.querySelector('#temp' + j);
        temp.textContent = currentData.temp.day;
        let humid = document.querySelector('#hum' + j);
        humid.textContent = currentData.humidity + "%";
    }
}

//Saving the City Info
let saveCity = function (cityName) {
    if (search.includes(cityName)) {
        return;
    } else {
        search.push(cityName)
        localStorage.setItem("search", json.stringify(search));
        loadSearch();
    }
}

//Loading past City Searches from Local Storage
let loadSearch = function () {
    if (search.length > 0) {
        searchListEl.innerHTML = "";
        for (i = 0; i < search.lenth; i++) {
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
let reRunSearch = function (event) {
    getCoords(event.target.innerHTML)
}

loadSearch();
searchFormEl.addEventListener("submit", formSubmitHandler);
searchListEl.addEventListener("click", reRunSearch);

