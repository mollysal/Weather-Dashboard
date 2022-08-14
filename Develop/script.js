//Variables from Left Hand side
var searchFormEl = document.querySelector("#search-form");
var searchInputEl = document.querySelector('#cityInput');
var searchListEl = document.querySelector('.list-group');

//Variables from Right Hand side 
var rightSide = document.querySelector('#rightSide');
var currentWeatherEl = document.querySelector('#currentWeatherEl');
var currentCity = document.querySelector('#currentCity');
var currentDate = document.querySelector('#currentDate');
var currentWeatherIcon = document.querySelector('#currentWeatherIcon');
var cTemp = document.querySelector('#cTemp');
var cHum = document.querySelector('#cHum');
var cWind = document.querySelector('#cWind');
var lookAheadEl = document.querySelector('lookAhead');

//API Key
const apiKey = '64e8e895c4d71cf5e75c9837e6e88c15';

//Search from Local Storage
let search = JSON.parse(localStorage.getItem("search") || "[]");

// ---------------------------------------------FUNCTIONS BELOW------------------------------------------------------ //

//Take user input, City Name & Send cityName to get coordinates
let formSubmitHandler = function(event) {
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

//Take the city Name from above & convert to coordinates
let getCoords = function(cityName) {
    let apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName +'&limit=1&appid=' + apiKey;
    console.log("http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid="+apiKey);

    fetch(apiURL).then(function (res){
        return res.json();
    }).then(function(data) {
        let lat = (data[0].lat);
        let lon = (data[0].lon);
        console.log(lat + "," + lon);
        getWeather(lat,lon);
    })
    .catch(function(error){
        console.error("error");
        return;
    })
}

//From the above coordinates go get the Weather
let getWeather = function(lat, lon) {
    let apiURL = 'https://api.openweathermap.org/data/3.0/onecall?lat='+ lat +'&lon='+ lon +'&units=imperial}&appid=' + apiKey;
    console.log('https://api.openweathermap.org/data/3.0/onecall?lat='+ lat +'&lon='+ lon +'&units=imperial}&appid=' + apiKey);
    
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
let displayCurrentWeather = function(data) {
    //Unhide Right Side
    rightSide.style.visibility = "visible";

    let apiUrl = "http://api.openweathermap.org/geo/1.0/reverse?lat="+ data.lat + "&lon=" + data.lon + "&limit=1&appid=" + apiKey
    
    fetch(apiUrl).then(function(res){
        return res.json();
    }).then(function(data){
        currentCity.text = cityName + " " + currentDate.text(moment().format("M/D/YYYY"));
        currentWeatherIcon.attr("src", "https://openweathermap.org/img/w/" + res.weather[0].icon + ".png");
        //take the date & insert it into Save City Function
        saveCity(data[0].name);
    })
    cTemp.text = data.current.temp;
    cHum.text = data.current.humidity;
    cWind.text = data.current.wind_speed;
}

//Display 5 day Look Ahead (Bottom Area)
let displayLookAhead = function(data) {
    //Unhide Right Side
    rightSide.style.visibility = "visible";

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
    if (search.includes(cityName)){
        return;
    } else {
        search.push(cityName)
        localStorage.setItem("search", json.stringify(search));
        loadSearch();
    }
}

//Loading past City Searches from Local Storage
let loadSearch = function() {
    if(search.length>0){
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
let reRunSearch = function(event) {
    getCoords(event.target.innerHTML)
}

loadSearch();
searchFormEl.addEventListener("submit", formSubmitHandler);
searchListEl.addEventListener("click", reRunSearch);

