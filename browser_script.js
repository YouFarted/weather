"use strict"

const devMode = false;
//const devMode = true;
let openWeatherKey = "";
let latestSuccess = "";

const openWeatherUviBaseUrl = "http://api.openweathermap.org/data/2.5/uvi"
const openWeatherBaseUrl = "http://api.openweathermap.org/data/2.5/weather/";
const openWeatherForecastBaseUrl = "http://api.openweathermap.org/data/2.5/forecast/";


const jqInputText = $("#apikey-input-text");
const jqError = $("#error-text");
const jqDevDropZone = $("#dev-drop-zone");
const jqPrettyDropZone = $("#pretty-drop-zone");
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

  localStorage.setItem("latestSuccess", latestSuccess);

  const citySearchHistoryArray = Array.from(citySearchHistory);

  const stringifiedCitySearchHistoryArray = JSON.stringify(citySearchHistoryArray);

  localStorage.setItem("searchHistory", stringifiedCitySearchHistoryArray);
}

function loadPageHistory() {
  latestSuccess = localStorage.getItem("latestSuccess");



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
  if (numCitiesInHistory !== numCitiesInHistoryAfterAdd) {
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
$(async () => {

  loadApikey();
  loadPageHistory();
  rebuildDropdown();

  if (devMode) {
    const currentAndFuture = {
      current: exampleCurrentResponse,
      future: exampleForecast
    }
    renderSearchDataToPage(exampleCurrentResponse.name, currentAndFuture);
    return;
  }
  // load latestSuccess !!!!
  console.log("latestSuccess:" + latestSuccess);
  if (latestSuccess) {
    const pageData = await loadPageDataForCity(latestSuccess);
    renderSearchDataToPage(latestSuccess, pageData)
  }

  jqInputText.on('change', function (e) {
    console.log("on change");
    openWeatherKey = e.target.value;
    console.log(`setting apikey to ${openWeatherKey}`);
  });
});

const exampleForecast = { 
  coord: {
  lon: -93.5005,
   lat: 42.0003
  },
  weather: [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01n" }],
  base: "stations",
  main: {
    temp: 268.32,
    feels_like: 265.81,
    temp_min: 268.15, 
    temp_max: 268.71,
    pressure: 1033,
    humidity: 63
  },
  visibility: 10000,
  wind: {
    speed: 1.54,
    deg: 330
  },
  clouds: {
    all: 1
  },
  dt: 1617261356,
  sys: {
    type: 1,
    id: 3289,
    country: "US",
    sunrise: 1617278162,
    sunset: 1617323949
  },
  timezone: -18000,
  id: 4862182,
  name: "Iowa",
  cod: 200
}

const exampleCurrentResponse = {
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
  cod: 200,
  uv: 4.35
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


// TODO include forecast AND current !!!!
async function getCurrentWeatherData(location) {

  var url = makeWeatherApiUrl({ q: location }, openWeatherBaseUrl, openWeatherKey);
  //var url = makeWeatherApiUrl({ q: location }, openWeatherForecastBaseUrl, openWeatherKey);

  console.log(`get weather using url: ${url}`);

  const current = await $.get(url);
  const lat = current.coord.lat;
  const lon = current.coord.lon;

  var uvUrl = makeWeatherApiUrl({ lat: lat, lon: lon }, openWeatherUviBaseUrl, openWeatherKey);

  const uv = await $.get(uvUrl);

  current.uv = uv.value;

  return current;
}

function getForecastWeatherData(location) {

  var url = makeWeatherApiUrl({ q: location }, openWeatherForecastBaseUrl, openWeatherKey);

  console.log(`get weather using url: ${url}`);

  return $.get(url);
}

async function ajaxWeather(city) {
  const current = await getCurrentWeatherData(city);
  const forecast = await getForecastWeatherData(city);
  return { current: current, forecast: forecast }
}

function createTableFromObject(obj) {
  const t = $("<table>");

  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    let val = obj[key];
    
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
  const searchText = jqCitySearchText.val();
  console.log(`search text = ${searchText}`);
  return searchText || "Austin";
}

async function loadPageDataForCity(city) {
  let cityWeatherData = "";
  try {
    cityWeatherData = await ajaxWeather(city);

    console.log("server responded with: ", cityWeatherData);
  } catch (err) {
    // if my result came back successful, I will trust the apikey enough to
    // store it for use next time in localstorage.  Otherwise, I get here 
    // and will just log the failure

    console.error("network error: ", err);
    const responseJSON = err.responseJSON;
    if ((err.status == 401)
      && err.responseJSON
      && err.responseJSON.message
      && err.responseJSON.message.startsWith("Invalid API key.")
    ) {
      jqError.text("Invalid API key.");
    }
    if ((err.status == 404)
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
  latestSuccess = city;
  ensureCityIsInSearchHistory(city);
  persistSearchHistory();
  console.log(`It worked, setting localstorage apikey to ${openWeatherKey}`);
  persistKey();

  return cityWeatherData;
}

function createJQueryPageDataFromOpenweatherResponse(currentAndFutureCityWeatherData) {

  const current = currentAndFutureCityWeatherData.current;
  const future = currentAndFutureCityWeatherData.future;

  // pull and convert the data I want to put in the table:
  const dateString    = moment.unix(current.dt).format("MM/DD/YYYY");
  const cityName      = current.name;

  const currentMainWeather = current.weather.main;
  const currentTemp = current.main.temp;
  const currentHumidity = current.main.humidity;
  const currentWindSpeed = current.wind.speed;
  const currentUvIndex = current.uv;
  const uvScaledTo255 = Math.floor(currentUvIndex * 255.0/7.0); // 7 is considered very high
  const uvRgb = uvScaledTo255.toString(16);
  const uvHtmlColor = `#${uvRgb}0000`;

  const iconCode = current.weather[0].icon;
  const iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
      
  // now for the table:
  const retTable = $("<table>");
  const nameRow = $("<tr>")
  nameRow.append($("<td>").text("city name"));
  nameRow.append($("<td>").text(cityName));
  const dateRow = $("<tr>");
  dateRow.append($("<td>").text("date"));
  dateRow.append($("<td>").text(dateString));

  const iconRow = $("<tr>");
  iconRow.append($("<td>").text("icon"));
  const iconImg = $("<img>").attr("src", iconUrl);
  const tdForIcon = $("<td>");
  tdForIcon.append(iconImg);
  iconRow.append(tdForIcon);

  const uvRow = $("<tr>");
  uvRow.append($("<td>").text("UV"));

  const uvIndexTd = $("<td>").text(currentUvIndex).attr("style", `color:${uvHtmlColor}`)
  uvRow.append(uvIndexTd);

  retTable.append(nameRow, dateRow, iconRow, uvRow);

  return retTable;
}

function renderSearchDataToPage(city, currentAndFutureCityWeatherData) {

  console.log("renderSearchDataToPage:", city);
  console.log("rsd2p:", currentAndFutureCityWeatherData);
  try {
    const stringifiedJsonCityWeatherData = JSON.stringify(currentAndFutureCityWeatherData);
    const t = createTableFromObject(currentAndFutureCityWeatherData);
    //const t = $("<div>");
    const prettyPage = createJQueryPageDataFromOpenweatherResponse(currentAndFutureCityWeatherData);

    jqPrettyDropZone.html("");
    jqPrettyDropZone.append(prettyPage);


    jqDevDropZone.html(""); // clear it
    jqDevDropZone.append(t);
  }
  catch (err) {
    // if my result came back successful, I will trust the apikey enough to
    // store it for use next time in localstorage.  Otherwise, I get here 
    // and will just log the failure and return

    console.error("network error: ", err);
    const responseJSON = err.responseJSON;
    if ((err.status == 401)
      && err.responseJSON
      && err.responseJSON.message
      && err.responseJSON.message.startsWith("Invalid API key.")
    ) {
      jqError.text("Invalid API key.");
    }
    if ((err.status == 404)
      && err.responseJSON
      && err.responseJSON.message
      && err.responseJSON.message.startsWith("city not found")
    ) {
      jqError.text("That city wasn't found.");
    }


    console.error("server cried:", err)
    return;
  } // end catch

  return;
}

function registerEvents() {
  // text area
  jqCitySearchText.on("change", async function (e) {
    const city = getCurrentlySelectedCity();
    const loadedData = await loadPageDataForCity(city);
    renderSearchDataToPage(city, loadedData);
  });

  // dropdown
  jqSearchSelector.on("change", async function (e) {
    const changedVal = jqSearchSelector.val();
    console.log(`changedVal: ${changedVal}`);
    //const city = getCurrentlySelectedCityFromDropDown();
    // we know it's a good value because we added it already and we only add cities that check out.
    const loadedData = await loadPageDataForCity(changedVal);
    renderSearchDataToPage(changedVal, loadedData);
  });
}

function browserMain() {
  registerEvents();
}

browserMain();