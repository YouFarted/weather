"use strict"


// I really need to not store this in the clear
//let openWeatherKey = "151b4f3c3ea2c7894242b9a6df78cdf5"
let openWeatherKey = "";
const openWeatherBaseUrl = "http://api.openweathermap.org/data/2.5/weather/";


const jqInputText = $("#apikey-input-text");
const jqError = $("#error-text");
const jqDropZone = $("#drop-zone");
const jqSearchSelector = $("#search-selector");
const jqCitySearchText = $("#city-input-text");

const citySearchHistory = new Set();

function loadApikey() {
  const localStoreApiKey = localStorage.getItem("apikey");
  if (localStoreApiKey) {
    jqInputText.val(localStoreApiKey);
    jqInputText.attr("readonly", true);
    jqInputText.attr("disabled", true);
    openWeatherKey = localStoreApiKey;
  }
}

function persistKey() {
  localStorage.setItem("apikey", openWeatherKey);
}

function persistSearchHistory() {
  const citySearchHistoryArray = Array.from(citySearchHistory);

  const stringifiedCitySearchHistoryArray = JSON.stringify(citySearchHistoryArray);

  localStorage.setItem("searchHistory", stringifiedCitySearchHistoryArray);
}

function loadPageHistory() {
  const citySearchHistoryString = localStorage.getItem("searchHistory");

  let citySearchHistoryArray = [];

  if (citySearchHistoryString) {
    citySearchHistoryArray = JSON.parse(citySearchHistoryString)
  }

  citySearchHistoryArray.forEach(item => citySearchHistory.add(item))
}

function ensureCityIsInSearchHistory(city) {
  const numCitiesInHistory = citySearchHistory.size;
  citySearchHistory.add(city);
  const numCitiesInHistoryAfterAdd = citySearchHistory.size;
  // only add it if it isn't already there
  if(numCitiesInHistory !== numCitiesInHistoryAfterAdd) {
    addCityToDropdown(city);
  }  
}

function rebuildDropdown() {
  citySearchHistory.forEach(city => {
    addCityToDropdown(city);
  });
}

function addCityToDropdown(city) {
  const domOption = $("<option>");
  domOption.text(city);
  domOption.attr("value", city);
  jqSearchSelector.append(domOption);
}

// on Page Load
$(() => {

  loadApikey();

  loadPageHistory();

  rebuildDropdown();

  jqInputText.on('change', function (e) {
    console.log("on change");
    openWeatherKey = e.target.value;
    console.log(`setting apikey to ${openWeatherKey}`);
  });
});

var exampleResponse = {
  coord: {
    lon: -97.74,
    lat: 30.27
  },
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01n" }],
  base: "stations",
  main: {
    temp: 284.48,
    feels_like: 279.7,
    temp_min: 283.15,
    temp_max: 286.15,
    pressure: 1026,
    humidity: 32
  },
  visibility: 10000,
  wind: {
    speed:
      3.13,
    deg: 42
  },
  clouds: {
    all: 1
  },
  dt: 1605500109,
  sys: {
    type: 1,
    id: 3344,
    country: "US",
    sunrise: 1605445028,
    sunset: 1605483266
  },
  timezone: -21600,
  id: 4671654,
  name: "Austin",
  cod: 200
};

function getQueryize(obj) {
  var keys = Object.keys(obj);
  var ret = "";
  for (let i = 0; i < keys.length; ++i) {
    let key = keys[i];
    let val = obj[key];
    //console.log(`${key}: ${val}`);
    ret += (key + '=' + encodeURI(val))
    if (i != (keys.length - 1)) {
      ret += "&";
    }
  }
  return ret;
}

function kelvinToCelsius(kelvin) {
  const kelvinAtZeroCelsius = 273.15;
  return kelvin - kelvinAtZeroCelsius;
}

function kelvinToFahrenheit(k) {
  var celsius = kelvinToCelsius(k);
  return celsius * 9 / 5 + 32;
}

function getWeatherData(location) {

  var url = makeWeatherApiUrl({ q: location }, openWeatherBaseUrl, openWeatherKey);

  console.log(`get weather using url: ${url}`);

  return $.get(url);
}

// Browser non-ui stuff goes here
function ajaxWeather(city) {
  return getWeatherData(city);
}

function createTableFromObject(obj) {
  const t = $("<table>");

  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    let val = obj[key];
    //console.log("typeof(val) = " + typeof(val));

    if (Array.isArray(val)) {
      if (val.length !== 1) {
        console.log("holy smacks, an array is the data is not of size 1");
      }
      val = createTableFromObject(val[0])
    }
    else if (typeof (val) == "object") {
      val = createTableFromObject(val);
    }
    t.append($("<tr>").append($("<td>").html(key)).append($("<td>").html(val)));
  }

  return t;
}

function getCurrentlySelectedCity() {
  const searchText =  jqCitySearchText.val();
  console.log(`search text = ${searchText}`);
  return searchText || "Austin";
}

async function doSearchCityInResponseToClick(city) {
  try {
    const cityWeatherData = await ajaxWeather(city);

    console.log("server responded with: ", cityWeatherData);

    const stringifiedJsonCityWeatherData = JSON.stringify(cityWeatherData);
    const t = createTableFromObject(cityWeatherData);

    jqDropZone.html(""); // clear it
    //clearDropzone();
    jqDropZone.append(t);
  }
  catch (err) {
    // if my result came back successful, I will trust the apikey enough to
    // store it for use next time in localstorage.  Otherwise, I get here 
    // and will just log the failure

    // TODO use a set.  Preserving order is unimportant
    // but avoiding duplication is
    //citySearchHistory.push(city);

    console.error("network error: ", err);
    const responseJSON = err.responseJSON;
    if ((err.status == 401)
      && err.responseJSON
      && err.responseJSON.message
      && err.responseJSON.message.startsWith("Invalid API key.")
    ) {
      jqError.text("Invalid API key.");
    }
    if((err.status == 404)
      && err.responseJSON
      && err.responseJSON.message
      && err.responseJSON.message.startsWith("city not found")
    ) {
      jqError.text("That city wasn't found.");
    }


    console.error("server cried:", err)
    return;
  } // end catch

  console.log(`It worked, saving city ${city} to search history`);
  ensureCityIsInSearchHistory(city);
  persistSearchHistory();
  console.log(`It worked, setting localstorage apikey to ${openWeatherKey}`);
  persistKey();
}

function registerEvents() {
  // text area
  jqCitySearchText.on("change", async function(e){
    const city = getCurrentlySelectedCity();
    doSearchCityInResponseToClick(city);
  });

  // dropdown
  jqSearchSelector.on("change", async function(e){
    const changedVal = jqSearchSelector.val();
    console.log(`changedVal: ${changedVal}`);
    //const city = getCurrentlySelectedCityFromDropDown();
    // we know it's a good value because we added it already and we only add cities that check out.
    doSearchCityInResponseToClick(changedVal);
  });
}

function browserMain() {
  registerEvents();
}

browserMain();