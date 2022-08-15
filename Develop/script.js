//Variables from Left Hand side
var searchFormEl = document.querySelector('#search-form');
var searchInputEl = document.querySelector('#cityInput');
var searchListEl = document.querySelector('#search-container');

//Variables from Right Hand side 
var rightSide = document.querySelector('#rightSide');
var currentWeatherEl = document.querySelector('#currentWeatherEl');
var currentCity = document.querySelector('#currentCity');
var currentDate = document.querySelector('#currentDate');
var currentimgEl = document.querySelector('#currentimg');
var cTemp = document.querySelector('#cTemp');
var cHum = document.querySelector('#cHum');
var cWind = document.querySelector('#cWind');
var lookAheadEl = document.querySelector('#lookAhead');

//API Key
const apiKey = '64e8e895c4d71cf5e75c9837e6e88c15';

//Search from Local Storage
var search = JSON.parse(localStorage.getItem("search") || "[]");

// ---------------------------------------------FUNCTIONS BELOW------------------------------------------------------ //

//Take user input, City Name & Send cityName to get coordinates
let formSubmitHandler = function (event) {
    event.preventDefault();
    let cityName = searchInputEl.value.trim();
    searchInputEl.value = "";

    if (cityName) {
        getCoords(cityName);
    } else {
        alert("Enter valid City Name!");
        return;
    }
}
//city name is = to the input value
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

//Display Current Weather (Top Area)
function displayCurrentWeather(data) {
    //Unhide Right Side
    rightSide.style.visibility = "visible";
    //API Url taking in the city's lat & long to get the city Name from the lat & lon
    let apiUrl = "https://api.openweathermap.org/geo/1.0/reverse?lat=" + data.lat + "&lon=" + data.lon + "&limit=1&appid=" + apiKey + '&units=imperial'
    //Current Weather Icon
    let iconLink = "https://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";

    fetch(apiUrl).then(function (res) {
        return res.json();
    }).then(function (data) {
        let cIcon = document.querySelector("#currentimg");
        cIcon.src = iconLink;
        console.log(data[0].name);
        //Pushing the city Name to the SaveSearch Function which goes to local storage
        cityName=data[0].name;
        saveSeach(cityName);
    })
    //print the current weather to top card 
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
        //print look-ahead weather to each card
        let icon = document.querySelector("#img" + j);
        icon.src = iconLink;
        let temp = document.querySelector('#temp' + j);
        temp.textContent = currentData.temp.day;
        let humid = document.querySelector('#hum' + j);
        humid.textContent = currentData.humidity + "%";
    }
}

//Saving the City Info
function saveSeach(cityName) {
    if (search.includes(cityName)) {
        return;
    } else {
        //previously searched city names go to local storage in an array with the name of "search"
        search.push(cityName)
        localStorage.setItem("search", JSON.stringify(search));
        var cityList = localStorage.getItem("search", JSON.stringify(search));
        loadSearch();
        console.log(cityList);
    }
}

//Loading past City Searches from Local Storage
function loadSearch() {
    if (search.length > 0) {
        searchListEl.innerHTML = "";
        //Creating Button for each City Name saved in Local Storage
        for (i = 0; i < search.length; i++) {
            let searchBtn = document.createElement("button");
            searchBtn.className = "search-btn w-100 m-0 mb-2 pe-auto";
            searchBtn.textContent = search[i];
            //add button to SeachListEl (area below search button)
            searchListEl.appendChild(searchBtn);
        }
    } else {
        searchListEl.innerHTML = "";
    }
}

//When you click a previously searched City - need to run through get coords again
function reRunSearch(event) {
    //when you click a button of previous city, re-run event to search coordinates for city's weather
    getCoords(event.target.innerHTML)
}

//Load the search on startup
loadSearch();
//When user clicks submit, run through function formSubmitHandler
searchFormEl.addEventListener("submit", formSubmitHandler);
//When user clicks a button, run through reRunSearch function 
searchListEl.addEventListener("click", reRunSearch);