'use strict';

//Set up API Key and Endpoint URL for use later.
const apiKey = 'YcCgHpUnyd25F85bfr3pCNKRfEJKKgBeg11qZYaU'
const searchURL = 'https://developer.nps.gov/api/v1/parks';

//Converts the params object into URL format.
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//Displays the results in the DOM.
function displayResults(responseJson, maxResults) {
    console.log(responseJson);

    //Requirement: Removes any previous results.
    $('#js-results-list').empty();
    for(let i=0; i < responseJson.data.length & i<maxResults; i++) {
        
        //Requirement: Displays park names, hyperlinked to their websites, and description.
        $('#js-results-list').append(
            `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].name}</a></h3>
            <p>${responseJson.data[i].description}</p></li>`
        )};
    $('#results').removeClass('hidden');
}

//GET request to the API.
function getParks(query, maxResults=10) {
 
    const params = {
        api_key: apiKey, 
        q: query,
    };

    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch (url)
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults (responseJson, maxResults))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

//Required: Form submission triggers GET request to NPS API.
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchState = $('#js-search-state').val();
        const maxResults = $('#js-max-results').val();
        getParks(searchState, maxResults);
    });
}

$(watchForm);