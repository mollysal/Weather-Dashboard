var results = $('#result-content');
var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
const apiKey = '64e8e895c4d71cf5e75c9837e6e88c15';

function getParams() {
    var searchParamsArr = document.location.search.split('&');

    var query = searchParamsArr[0].split('=').pop();
    var format = searchParamsArr[1].split('=').pop();

    searchAPI(query, format);
}

var getCurrentWeather = function(cityName) {
    var apiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey;

    fetch(apiURL).then(function(response){
        if(response.ok) {
            
        }
    })

}








// If user doesn't enter Location - Console Log will error
function handleSearchFormSubmit(event) {
    event.preventDefault();

    var searchInputVal = document.querySelector('#search-input').value;

    if(!searchInputVal) {
        console.error('You need a search input value!');
        return;
    }
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);


