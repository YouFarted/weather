"use strict"

const devMode_cachedData = false;
//const devMode_cachedData = true;
let openWeatherKey = "";
let latestSuccess = "";

const openWeatherUviBaseUrl = "http://api.openweathermap.org/data/2.5/uvi"
const openWeatherBaseUrl = "http://api.openweathermap.org/data/2.5/weather/";
const openWeatherForecastBaseUrl = "http://api.openweathermap.org/data/2.5/forecast/";


const jqInputText = $("#apikey-input-text");
const jqCurentTime = $("#current-time");
const jqError = $("#error-text");
const jqPrettyDropZone = $("#pretty-drop-zone");
const jqCityNameDropZone = $("#city-name");
const jqNowDropZone = $("#now-drop-zone");
const jqForecastDropZone = $("#forecast-drop-zone");
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

  if (devMode_cachedData) {
    const currentAndFuture = {
      current: exampleCurrentResponse,
      forecast: exampleForecast
    }
    renderSearchDataToPage(exampleCurrentResponse.name, currentAndFuture);
    return;
  }
  
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
  "cod": "200",
  "message": 0,
  "cnt": 40,
  "list": [
      {
          "dt": 1617321600,
          "main": {
              "temp": 43.03,
              "feels_like": 38.43,
              "temp_min": 40.21,
              "temp_max": 43.03,
              "pressure": 1024,
              "sea_level": 1024,
              "grnd_level": 1013,
              "humidity": 76,
              "temp_kf": 1.57
          },
          "weather": [
              {
                  "id": 801,
                  "main": "Clouds",
                  "description": "few clouds",
                  "icon": "02n"
              }
          ],
          "clouds": {
              "all": 17
          },
          "wind": {
              "speed": 7.72,
              "deg": 28
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-02 00:00:00"
      },
      {
          "dt": 1617332400,
          "main": {
              "temp": 39.33,
              "feels_like": 34.65,
              "temp_min": 37.56,
              "temp_max": 39.33,
              "pressure": 1025,
              "sea_level": 1025,
              "grnd_level": 1013,
              "humidity": 86,
              "temp_kf": 0.98
          },
          "weather": [
              {
                  "id": 801,
                  "main": "Clouds",
                  "description": "few clouds",
                  "icon": "02n"
              }
          ],
          "clouds": {
              "all": 11
          },
          "wind": {
              "speed": 6.49,
              "deg": 25
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-02 03:00:00"
      },
      {
          "dt": 1617343200,
          "main": {
              "temp": 37.81,
              "feels_like": 32.88,
              "temp_min": 37.27,
              "temp_max": 37.81,
              "pressure": 1025,
              "sea_level": 1025,
              "grnd_level": 1013,
              "humidity": 85,
              "temp_kf": 0.3
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01d"
              }
          ],
          "clouds": {
              "all": 10
          },
          "wind": {
              "speed": 6.4,
              "deg": 25
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-02 06:00:00"
      },
      {
          "dt": 1617354000,
          "main": {
              "temp": 45.81,
              "feels_like": 41,
              "temp_min": 45.81,
              "temp_max": 45.81,
              "pressure": 1025,
              "sea_level": 1025,
              "grnd_level": 1013,
              "humidity": 64,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01d"
              }
          ],
          "clouds": {
              "all": 6
          },
          "wind": {
              "speed": 9.6,
              "deg": 27
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-02 09:00:00"
      },
      {
          "dt": 1617364800,
          "main": {
              "temp": 51.89,
              "feels_like": 48.9,
              "temp_min": 51.89,
              "temp_max": 51.89,
              "pressure": 1024,
              "sea_level": 1024,
              "grnd_level": 1013,
              "humidity": 45,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01d"
              }
          ],
          "clouds": {
              "all": 5
          },
          "wind": {
              "speed": 10.02,
              "deg": 4
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-02 12:00:00"
      },
      {
          "dt": 1617375600,
          "main": {
              "temp": 52.93,
              "feels_like": 50.14,
              "temp_min": 52.93,
              "temp_max": 52.93,
              "pressure": 1023,
              "sea_level": 1023,
              "grnd_level": 1011,
              "humidity": 47,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01d"
              }
          ],
          "clouds": {
              "all": 2
          },
          "wind": {
              "speed": 13.13,
              "deg": 357
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-02 15:00:00"
      },
      {
          "dt": 1617386400,
          "main": {
              "temp": 44.29,
              "feels_like": 37.42,
              "temp_min": 44.29,
              "temp_max": 44.29,
              "pressure": 1025,
              "sea_level": 1025,
              "grnd_level": 1013,
              "humidity": 65,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01d"
              }
          ],
          "clouds": {
              "all": 6
          },
          "wind": {
              "speed": 14.67,
              "deg": 5
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-02 18:00:00"
      },
      {
          "dt": 1617397200,
          "main": {
              "temp": 43.11,
              "feels_like": 37.33,
              "temp_min": 43.11,
              "temp_max": 43.11,
              "pressure": 1025,
              "sea_level": 1025,
              "grnd_level": 1013,
              "humidity": 62,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 802,
                  "main": "Clouds",
                  "description": "scattered clouds",
                  "icon": "03n"
              }
          ],
          "clouds": {
              "all": 48
          },
          "wind": {
              "speed": 10.4,
              "deg": 346
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-02 21:00:00"
      },
      {
          "dt": 1617408000,
          "main": {
              "temp": 37.92,
              "feels_like": 30.92,
              "temp_min": 37.92,
              "temp_max": 37.92,
              "pressure": 1026,
              "sea_level": 1026,
              "grnd_level": 1014,
              "humidity": 86,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 802,
                  "main": "Clouds",
                  "description": "scattered clouds",
                  "icon": "03n"
              }
          ],
          "clouds": {
              "all": 35
          },
          "wind": {
              "speed": 10.31,
              "deg": 352
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-03 00:00:00"
      },
      {
          "dt": 1617418800,
          "main": {
              "temp": 38.1,
              "feels_like": 32.02,
              "temp_min": 38.1,
              "temp_max": 38.1,
              "pressure": 1026,
              "sea_level": 1026,
              "grnd_level": 1014,
              "humidity": 81,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 803,
                  "main": "Clouds",
                  "description": "broken clouds",
                  "icon": "04n"
              }
          ],
          "clouds": {
              "all": 70
          },
          "wind": {
              "speed": 8.5,
              "deg": 3
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-03 03:00:00"
      },
      {
          "dt": 1617429600,
          "main": {
              "temp": 36.82,
              "feels_like": 31.82,
              "temp_min": 36.82,
              "temp_max": 36.82,
              "pressure": 1027,
              "sea_level": 1027,
              "grnd_level": 1015,
              "humidity": 89,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 803,
                  "main": "Clouds",
                  "description": "broken clouds",
                  "icon": "04d"
              }
          ],
          "clouds": {
              "all": 75
          },
          "wind": {
              "speed": 6.22,
              "deg": 356
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-03 06:00:00"
      },
      {
          "dt": 1617440400,
          "main": {
              "temp": 43.3,
              "feels_like": 39.99,
              "temp_min": 43.3,
              "temp_max": 43.3,
              "pressure": 1028,
              "sea_level": 1028,
              "grnd_level": 1016,
              "humidity": 71,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 804,
                  "main": "Clouds",
                  "description": "overcast clouds",
                  "icon": "04d"
              }
          ],
          "clouds": {
              "all": 85
          },
          "wind": {
              "speed": 5.53,
              "deg": 13
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-03 09:00:00"
      },
      {
          "dt": 1617451200,
          "main": {
              "temp": 51.51,
              "feels_like": 48.67,
              "temp_min": 51.51,
              "temp_max": 51.51,
              "pressure": 1027,
              "sea_level": 1027,
              "grnd_level": 1015,
              "humidity": 49,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 803,
                  "main": "Clouds",
                  "description": "broken clouds",
                  "icon": "04d"
              }
          ],
          "clouds": {
              "all": 60
          },
          "wind": {
              "speed": 7.4,
              "deg": 353
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-03 12:00:00"
      },
      {
          "dt": 1617462000,
          "main": {
              "temp": 52.63,
              "feels_like": 49.75,
              "temp_min": 52.63,
              "temp_max": 52.63,
              "pressure": 1026,
              "sea_level": 1026,
              "grnd_level": 1014,
              "humidity": 46,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 804,
                  "main": "Clouds",
                  "description": "overcast clouds",
                  "icon": "04d"
              }
          ],
          "clouds": {
              "all": 87
          },
          "wind": {
              "speed": 11.12,
              "deg": 353
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-03 15:00:00"
      },
      {
          "dt": 1617472800,
          "main": {
              "temp": 44.55,
              "feels_like": 39.31,
              "temp_min": 44.55,
              "temp_max": 44.55,
              "pressure": 1027,
              "sea_level": 1027,
              "grnd_level": 1015,
              "humidity": 62,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 804,
                  "main": "Clouds",
                  "description": "overcast clouds",
                  "icon": "04d"
              }
          ],
          "clouds": {
              "all": 93
          },
          "wind": {
              "speed": 9.91,
              "deg": 357
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-03 18:00:00"
      },
      {
          "dt": 1617483600,
          "main": {
              "temp": 37.99,
              "feels_like": 33.19,
              "temp_min": 37.99,
              "temp_max": 37.99,
              "pressure": 1028,
              "sea_level": 1028,
              "grnd_level": 1016,
              "humidity": 79,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 802,
                  "main": "Clouds",
                  "description": "scattered clouds",
                  "icon": "03n"
              }
          ],
          "clouds": {
              "all": 44
          },
          "wind": {
              "speed": 6.26,
              "deg": 11
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-03 21:00:00"
      },
      {
          "dt": 1617494400,
          "main": {
              "temp": 35.62,
              "feels_like": 33.03,
              "temp_min": 35.62,
              "temp_max": 35.62,
              "pressure": 1027,
              "sea_level": 1027,
              "grnd_level": 1015,
              "humidity": 89,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 802,
                  "main": "Clouds",
                  "description": "scattered clouds",
                  "icon": "03n"
              }
          ],
          "clouds": {
              "all": 26
          },
          "wind": {
              "speed": 3.31,
              "deg": 5
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-04 00:00:00"
      },
      {
          "dt": 1617505200,
          "main": {
              "temp": 34.2,
              "feels_like": 34.2,
              "temp_min": 34.2,
              "temp_max": 34.2,
              "pressure": 1027,
              "sea_level": 1027,
              "grnd_level": 1014,
              "humidity": 92,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01n"
              }
          ],
          "clouds": {
              "all": 7
          },
          "wind": {
              "speed": 2.42,
              "deg": 5
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-04 03:00:00"
      },
      {
          "dt": 1617516000,
          "main": {
              "temp": 37.92,
              "feels_like": 37.92,
              "temp_min": 37.92,
              "temp_max": 37.92,
              "pressure": 1026,
              "sea_level": 1026,
              "grnd_level": 1013,
              "humidity": 85,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 802,
                  "main": "Clouds",
                  "description": "scattered clouds",
                  "icon": "03d"
              }
          ],
          "clouds": {
              "all": 43
          },
          "wind": {
              "speed": 2.51,
              "deg": 324
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-04 06:00:00"
      },
      {
          "dt": 1617526800,
          "main": {
              "temp": 44.58,
              "feels_like": 41.9,
              "temp_min": 44.58,
              "temp_max": 44.58,
              "pressure": 1024,
              "sea_level": 1024,
              "grnd_level": 1012,
              "humidity": 66,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 803,
                  "main": "Clouds",
                  "description": "broken clouds",
                  "icon": "04d"
              }
          ],
          "clouds": {
              "all": 64
          },
          "wind": {
              "speed": 4.92,
              "deg": 351
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-04 09:00:00"
      },
      {
          "dt": 1617537600,
          "main": {
              "temp": 50.74,
              "feels_like": 48.06,
              "temp_min": 50.74,
              "temp_max": 50.74,
              "pressure": 1022,
              "sea_level": 1022,
              "grnd_level": 1010,
              "humidity": 54,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 802,
                  "main": "Clouds",
                  "description": "scattered clouds",
                  "icon": "03d"
              }
          ],
          "clouds": {
              "all": 43
          },
          "wind": {
              "speed": 4.72,
              "deg": 318
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-04 12:00:00"
      },
      {
          "dt": 1617548400,
          "main": {
              "temp": 52.81,
              "feels_like": 50.29,
              "temp_min": 52.81,
              "temp_max": 52.81,
              "pressure": 1019,
              "sea_level": 1019,
              "grnd_level": 1007,
              "humidity": 53,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01d"
              }
          ],
          "clouds": {
              "all": 3
          },
          "wind": {
              "speed": 6.06,
              "deg": 291
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-04 15:00:00"
      },
      {
          "dt": 1617559200,
          "main": {
              "temp": 45.52,
              "feels_like": 43.2,
              "temp_min": 45.52,
              "temp_max": 45.52,
              "pressure": 1017,
              "sea_level": 1017,
              "grnd_level": 1005,
              "humidity": 71,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01d"
              }
          ],
          "clouds": {
              "all": 9
          },
          "wind": {
              "speed": 4.65,
              "deg": 256
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-04 18:00:00"
      },
      {
          "dt": 1617570000,
          "main": {
              "temp": 41.43,
              "feels_like": 36.73,
              "temp_min": 41.43,
              "temp_max": 41.43,
              "pressure": 1015,
              "sea_level": 1015,
              "grnd_level": 1003,
              "humidity": 79,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01n"
              }
          ],
          "clouds": {
              "all": 4
          },
          "wind": {
              "speed": 7.25,
              "deg": 208
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-04 21:00:00"
      },
      {
          "dt": 1617580800,
          "main": {
              "temp": 39.04,
              "feels_like": 33.33,
              "temp_min": 39.04,
              "temp_max": 39.04,
              "pressure": 1012,
              "sea_level": 1012,
              "grnd_level": 1000,
              "humidity": 87,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 800,
                  "main": "Clear",
                  "description": "clear sky",
                  "icon": "01n"
              }
          ],
          "clouds": {
              "all": 8
          },
          "wind": {
              "speed": 8.16,
              "deg": 214
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-05 00:00:00"
      },
      {
          "dt": 1617591600,
          "main": {
              "temp": 39.54,
              "feels_like": 31.77,
              "temp_min": 39.54,
              "temp_max": 39.54,
              "pressure": 1008,
              "sea_level": 1008,
              "grnd_level": 996,
              "humidity": 79,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 801,
                  "main": "Clouds",
                  "description": "few clouds",
                  "icon": "02n"
              }
          ],
          "clouds": {
              "all": 16
          },
          "wind": {
              "speed": 13.4,
              "deg": 219
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-05 03:00:00"
      },
      {
          "dt": 1617602400,
          "main": {
              "temp": 39.99,
              "feels_like": 31.24,
              "temp_min": 39.99,
              "temp_max": 39.99,
              "pressure": 1004,
              "sea_level": 1004,
              "grnd_level": 992,
              "humidity": 64,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 802,
                  "main": "Clouds",
                  "description": "scattered clouds",
                  "icon": "03d"
              }
          ],
          "clouds": {
              "all": 50
          },
          "wind": {
              "speed": 16.98,
              "deg": 216
          },
          "visibility": 10000,
          "pop": 0,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-05 06:00:00"
      },
      {
          "dt": 1617613200,
          "main": {
              "temp": 45.95,
              "feels_like": 38.57,
              "temp_min": 45.95,
              "temp_max": 45.95,
              "pressure": 1001,
              "sea_level": 1001,
              "grnd_level": 989,
              "humidity": 66,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 804,
                  "main": "Clouds",
                  "description": "overcast clouds",
                  "icon": "04d"
              }
          ],
          "clouds": {
              "all": 100
          },
          "wind": {
              "speed": 18.68,
              "deg": 228
          },
          "visibility": 10000,
          "pop": 0.01,
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-05 09:00:00"
      },
      {
          "dt": 1617624000,
          "main": {
              "temp": 45.39,
              "feels_like": 37.8,
              "temp_min": 45.39,
              "temp_max": 45.39,
              "pressure": 998,
              "sea_level": 998,
              "grnd_level": 986,
              "humidity": 80,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 500,
                  "main": "Rain",
                  "description": "light rain",
                  "icon": "10d"
              }
          ],
          "clouds": {
              "all": 100
          },
          "wind": {
              "speed": 18.86,
              "deg": 229
          },
          "visibility": 10000,
          "pop": 0.42,
          "rain": {
              "3h": 0.48
          },
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-05 12:00:00"
      },
      {
          "dt": 1617634800,
          "main": {
              "temp": 36.64,
              "feels_like": 29.53,
              "temp_min": 36.64,
              "temp_max": 36.64,
              "pressure": 998,
              "sea_level": 998,
              "grnd_level": 987,
              "humidity": 97,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 501,
                  "main": "Rain",
                  "description": "moderate rain",
                  "icon": "10d"
              }
          ],
          "clouds": {
              "all": 100
          },
          "wind": {
              "speed": 9.89,
              "deg": 303
          },
          "visibility": 51,
          "pop": 1,
          "rain": {
              "3h": 3.4
          },
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-05 15:00:00"
      },
      {
          "dt": 1617645600,
          "main": {
              "temp": 34.02,
              "feels_like": 25.88,
              "temp_min": 34.02,
              "temp_max": 34.02,
              "pressure": 1001,
              "sea_level": 1001,
              "grnd_level": 989,
              "humidity": 95,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 601,
                  "main": "Snow",
                  "description": "snow",
                  "icon": "13d"
              }
          ],
          "clouds": {
              "all": 100
          },
          "wind": {
              "speed": 10.71,
              "deg": 354
          },
          "visibility": 5974,
          "pop": 1,
          "snow": {
              "3h": 3.74
          },
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-05 18:00:00"
      },
      {
          "dt": 1617656400,
          "main": {
              "temp": 32.07,
              "feels_like": 24.78,
              "temp_min": 32.07,
              "temp_max": 32.07,
              "pressure": 1004,
              "sea_level": 1004,
              "grnd_level": 992,
              "humidity": 85,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 600,
                  "main": "Snow",
                  "description": "light snow",
                  "icon": "13n"
              }
          ],
          "clouds": {
              "all": 100
          },
          "wind": {
              "speed": 8.25,
              "deg": 303
          },
          "visibility": 10000,
          "pop": 0.63,
          "snow": {
              "3h": 0.43
          },
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-05 21:00:00"
      },
      {
          "dt": 1617667200,
          "main": {
              "temp": 28.98,
              "feels_like": 21.02,
              "temp_min": 28.98,
              "temp_max": 28.98,
              "pressure": 1005,
              "sea_level": 1005,
              "grnd_level": 993,
              "humidity": 91,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 803,
                  "main": "Clouds",
                  "description": "broken clouds",
                  "icon": "04n"
              }
          ],
          "clouds": {
              "all": 70
          },
          "wind": {
              "speed": 8.23,
              "deg": 253
          },
          "visibility": 10000,
          "pop": 0.4,
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-06 00:00:00"
      },
      {
          "dt": 1617678000,
          "main": {
              "temp": 29.93,
              "feels_like": 20.62,
              "temp_min": 29.93,
              "temp_max": 29.93,
              "pressure": 1007,
              "sea_level": 1007,
              "grnd_level": 995,
              "humidity": 95,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 600,
                  "main": "Snow",
                  "description": "light snow",
                  "icon": "13n"
              }
          ],
          "clouds": {
              "all": 52
          },
          "wind": {
              "speed": 11.07,
              "deg": 264
          },
          "visibility": 349,
          "pop": 0.42,
          "snow": {
              "3h": 0.34
          },
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-06 03:00:00"
      },
      {
          "dt": 1617688800,
          "main": {
              "temp": 32.52,
              "feels_like": 23.5,
              "temp_min": 32.52,
              "temp_max": 32.52,
              "pressure": 1009,
              "sea_level": 1009,
              "grnd_level": 996,
              "humidity": 95,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 600,
                  "main": "Snow",
                  "description": "light snow",
                  "icon": "13d"
              }
          ],
          "clouds": {
              "all": 75
          },
          "wind": {
              "speed": 11.86,
              "deg": 269
          },
          "visibility": 10000,
          "pop": 0.81,
          "snow": {
              "3h": 0.88
          },
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-06 06:00:00"
      },
      {
          "dt": 1617699600,
          "main": {
              "temp": 38.19,
              "feels_like": 30.74,
              "temp_min": 38.19,
              "temp_max": 38.19,
              "pressure": 1010,
              "sea_level": 1010,
              "grnd_level": 998,
              "humidity": 72,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 600,
                  "main": "Snow",
                  "description": "light snow",
                  "icon": "13d"
              }
          ],
          "clouds": {
              "all": 86
          },
          "wind": {
              "speed": 11.59,
              "deg": 286
          },
          "visibility": 10000,
          "pop": 0.88,
          "snow": {
              "3h": 0.35
          },
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-06 09:00:00"
      },
      {
          "dt": 1617710400,
          "main": {
              "temp": 39.7,
              "feels_like": 30.63,
              "temp_min": 39.7,
              "temp_max": 39.7,
              "pressure": 1010,
              "sea_level": 1010,
              "grnd_level": 998,
              "humidity": 69,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 600,
                  "main": "Snow",
                  "description": "light snow",
                  "icon": "13d"
              }
          ],
          "clouds": {
              "all": 81
          },
          "wind": {
              "speed": 17.9,
              "deg": 291
          },
          "visibility": 10000,
          "pop": 1,
          "snow": {
              "3h": 1.19
          },
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-06 12:00:00"
      },
      {
          "dt": 1617721200,
          "main": {
              "temp": 39.34,
              "feels_like": 30.43,
              "temp_min": 39.34,
              "temp_max": 39.34,
              "pressure": 1010,
              "sea_level": 1010,
              "grnd_level": 998,
              "humidity": 63,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 600,
                  "main": "Snow",
                  "description": "light snow",
                  "icon": "13d"
              }
          ],
          "clouds": {
              "all": 100
          },
          "wind": {
              "speed": 16.87,
              "deg": 278
          },
          "visibility": 10000,
          "pop": 0.6,
          "snow": {
              "3h": 0.38
          },
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-06 15:00:00"
      },
      {
          "dt": 1617732000,
          "main": {
              "temp": 33.75,
              "feels_like": 22.96,
              "temp_min": 33.75,
              "temp_max": 33.75,
              "pressure": 1010,
              "sea_level": 1010,
              "grnd_level": 998,
              "humidity": 73,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 600,
                  "main": "Snow",
                  "description": "light snow",
                  "icon": "13d"
              }
          ],
          "clouds": {
              "all": 100
          },
          "wind": {
              "speed": 17.65,
              "deg": 263
          },
          "visibility": 8712,
          "pop": 0.7,
          "snow": {
              "3h": 0.46
          },
          "sys": {
              "pod": "d"
          },
          "dt_txt": "2021-04-06 18:00:00"
      },
      {
          "dt": 1617742800,
          "main": {
              "temp": 32.95,
              "feels_like": 23.09,
              "temp_min": 32.95,
              "temp_max": 32.95,
              "pressure": 1010,
              "sea_level": 1010,
              "grnd_level": 998,
              "humidity": 95,
              "temp_kf": 0
          },
          "weather": [
              {
                  "id": 600,
                  "main": "Snow",
                  "description": "light snow",
                  "icon": "13n"
              }
          ],
          "clouds": {
              "all": 100
          },
          "wind": {
              "speed": 14.25,
              "deg": 276
          },
          "visibility": 303,
          "pop": 0.75,
          "snow": {
              "3h": 0.58
          },
          "sys": {
              "pod": "n"
          },
          "dt_txt": "2021-04-06 21:00:00"
      }
  ],
  "city": {
      "id": 2792413,
      "name": "Bolder",
      "coord": {
          "lat": 50.7954,
          "lon": 5.6111
      },
      "country": "BE",
      "population": 182597,
      "timezone": 7200,
      "sunrise": 1617340259,
      "sunset": 1617387052
  }
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

async function getCurrentWeatherData(location) {

  var url = makeWeatherApiUrl({ q: location, units: "imperial" }, openWeatherBaseUrl, openWeatherKey);
  
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

  var url = makeWeatherApiUrl({ q: location, units: "imperial" }, openWeatherForecastBaseUrl, openWeatherKey);

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
  let cityWeatherData = null;
  try {
    cityWeatherData = await ajaxWeather(city);

    console.log("server responded with: ", cityWeatherData);
  } catch (err) {
    // if my result came back successful, I will trust the apikey enough to
    // store it for use next time in localstorage.  Otherwise, I get here 
    // and will just log the failure

    console.log("network error: ", err);

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
      jqError.text(`The city '${city}' wasn't found.`);
    }

    console.log("server cried:", err)

    throw err;
  } // end catch

  console.log(`It worked, saving city ${city} to search history`);
  latestSuccess = city;
  ensureCityIsInSearchHistory(city);
  persistSearchHistory();
  console.log(`It worked, setting localstorage apikey to ${openWeatherKey}`);
  persistKey();

  return cityWeatherData;
}

function renderNow(current) {
  const retTable = $("<table>");

  const tempTd = renderTempToTd(current);
  const iconTd = renderIconToTd(current);
  const humidityTd = renderHumidityToTd(current);
  const windSpeedTd = renderWindSpeedToTd(current);
  const uvTd = renderUvToTd(current);

  const tempRow = $("<tr>");
  tempRow.append($("<td>").text("Temp"));
  tempRow.append(tempTd);
  retTable.append(tempRow);

  const iconTr = $("<tr>");
  iconTr.append($("<td>").text("Icon"));
  iconTr.append(iconTd);
  retTable.append(iconTr);

  const humidityTr = $("<tr>");
  humidityTr.append($("<td>").text("Humidity"));
  humidityTr.append(humidityTd);
  retTable.append(humidityTr);

  const windSpeedTr = $("<tr>");
  windSpeedTr.append($("<td>").text("Wind Speed"));
  windSpeedTr.append(windSpeedTd);
  retTable.append(windSpeedTr);

  const uvTr = $("<tr>");
  uvTr.append($("<td>").text("UV index"));
  uvTr.append(uvTd);
  retTable.append(uvTr);


  return retTable;
}

function renderForecast(forecastData) {
  const retTable = $("<table>");

  const dateTds = createDateForecastTds(forecastData);
  const tempTds = createTempForecastTds(forecastData);
  const iconTds = createIconForecastTds(forecastData);
  const humidityTds = createHumidityForecastTds(forecastData);
  const windSpeedTds = createWindSpeedForecastTds(forecastData);

  const dateTr = $("<tr>");
  dateTr.append($("<td>").text("Time"));
  dateTr.append(dateTds);
  retTable.append(dateTr);

  const tempTr = $("<tr>");
  tempTr.append($("<td>").text("Temp"));
  tempTr.append(tempTds);
  retTable.append(tempTr);

  const iconTr = $("<tr>");
  iconTr.append($("<td>").text("Icon"));
  iconTr.append(iconTds);
  retTable.append(iconTr);

  const humidityTr = $("<tr>");
  humidityTr.append($("<td>").text("Humidity"));
  humidityTr.append(humidityTds);
  retTable.append(humidityTr);

  const windSpeedTr = $("<tr>");
  windSpeedTr.append($("<td>").text("Wind Speed"));
  windSpeedTr.append(windSpeedTds);
  retTable.append(windSpeedTr);

  // Forecast does not contain the uv index

  return retTable;
}

function createJQueryNowPageDataFromOpenweatherResponse(current) {
  //const retDiv = $("<div>").text("NOW PLACEHOLDER");
  const retDiv = $("<div>");
  
  const renderedNowTable = renderNow(current);

  retDiv.append(renderedNowTable);
  return retDiv;
}

function createJQueryForecastPageDataFromOpenweatherResponse(forecast) {
  
  const retDiv = $("<div>");
  const renderedForecastTable = renderForecast(forecast);

  retDiv.append(renderedForecastTable);
  return retDiv;
}

function renderDateToTd(weatherData) {
  const dateString    = moment.unix(weatherData.dt).format("hA");
  return $("<td>").text(dateString);
}

function renderIconToTd(weatherData) {
  const iconCode = weatherData.weather[0].icon;
  const iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
  const iconImg = $("<img>").attr("src", iconUrl);
  const tdForIcon = $("<td>");
  tdForIcon.append(iconImg);
  return tdForIcon;
}

function renderTempToTd(weatherData) {
  const preciseTemp = weatherData.main.temp;
  const temp = Math.floor(preciseTemp);

  return $("<td>").text(temp + "F")
}

function renderHumidityToTd(weatherData) {
  const humidity = weatherData.main.humidity;
  return $("<td>").text(humidity);
}

function renderWindSpeedToTd(weatherData) {
  const windSpeed = weatherData.wind.speed;
  return $("<td>").text(windSpeed)
}

function renderUvToTd(weatherData) {
  
  if(!weatherData.uv)
  {
    console.error("no uv index available.  Returning nothing");
    throw new Error("no uv index is available in the WeatherData.");
  }

  const uvIndex = weatherData.uv;
  const uvScaledTo255 = Math.floor(uvIndex * 255.0/7.0); // 7 is considered very high
  const uvRgb = uvScaledTo255.toString(16);
  const uvHtmlColor = `#${uvRgb}0000`;
  const uvIndexTd = $("<td>").text(uvIndex).attr("style", `color:${uvHtmlColor}`)
  return uvIndexTd;
}

/* REDUNDANT  why?!?!??
function renderTempToTd(weatherData) {
  const temp = weatherData.main.temp;
  return $("<td>").text(temp + "F");
}
*/

function renderHumidityToTd(weatherData) {
  const humidity = weatherData.main.humidity;
  return $("<td>").text(humidity);
}

function renderWindSpeedToTd(weatherData) {
  const windSpeed = weatherData.wind.speed;
  return ($("<td>").text(windSpeed));
}


// Forecast iteration functions - date, temp, icon, ...
function createDateForecastTds(forecast) {
  const ret = new Array();
  
  for(let i=0; i<forecast.list.length; ++i) {
    ret.push(renderDateToTd(forecast.list[i]));
  }

  return ret;
}

function createTempForecastTds(forecast) {
  const ret = new Array();
  
  for(let i=0; i<forecast.list.length; ++i) {
    ret.push(renderTempToTd(forecast.list[i]));
  }

  return ret;
}

function createIconForecastTds(forecast) {
  const ret = new Array();
  
  for(let i=0; i<forecast.list.length; ++i) {
    ret.push(renderIconToTd(forecast.list[i]));
  }

  return ret;
}

function createHumidityForecastTds(forecast) {
  const ret = new Array();
  
  for(let i=0; i<forecast.list.length; ++i) {
    ret.push(renderHumidityToTd(forecast.list[i]));
  }

  return ret;
}

function createWindSpeedForecastTds(forecast) {
  const ret = new Array();
  
  for(let i=0; i<forecast.list.length; ++i) {
    ret.push(renderWindSpeedToTd(forecast.list[i]));
  }

  return ret;
}

function createUvForecastTds(forecast) {
  const ret = new Array();
  
  for(let i=0; i<forecast.list.length; ++i) {
    let uvTd = renderUvToTd(forecast.list[i]);
    if(!uvTd) {
      uvTd = $("<td>").text("NOTHING");
    }
    ret.push(uvTd);
  }

  return ret;
}

/*
function DoIUseThisrenderDayToTable(weatherData) {
  // pull and convert the data I want to put in the table:
  //const dateString    = moment.unix(weatherData.dt).format("MM/DD/YYYY HH:MM:SS.ss");
  const dateString    = moment.unix(weatherData.dt).format("HH:MM:SS.ss");
  const cityName      = weatherData.name;

  // now for the table:
  const retTable = $("<table>");
  
  TODO add city name to the top of all days
  const nameRow = $("<tr>")
  nameRow.append($("<td>").text("city name"));
  nameRow.append($("<td>").text(cityName));
  
  const dateRow = $("<tr>");
  dateRow.append($("<td>").text("date"));
  dateRow.append(renderDateToTd(weatherData));

  const iconRow = $("<tr>");
  iconRow.append($("<td>").text("icon"));
  iconRow.append(renderIconToTd(weatherData));

  let uvRow = null;

  const uvTd = renderUvToTd(weatherData);
  if(uvTd) {
    uvRow = $("<tr>");
    uvRow.append($("<td>").text("UV"));
    uvRow.append(uvTd);
  }

  const temperatureRow = $("<tr>");
  temperatureRow.append($("<td>").text("Temp"));
  temperatureRow.append(renderTempToTd(weatherData));

  // currentHumidity
  const humidityRow = $("<tr>");
  humidityRow.append($("<td>").text("Humidity"));
  humidityRow.append(renderHumidityToTd(weatherData));

  const windSpeedRow = $("<tr>");
  windSpeedRow.append($("<td>").text("Wind Speed"));
  windSpeedRow.append(renderHumidityToTd(weatherData));

  retTable.append(
    dateRow,
    iconRow);

  if(uvRow) {
    retTable.append(uvRow);
  }
  retTable.append(
    temperatureRow,
    humidityRow,
    windSpeedRow);

  return retTable;
}
*/
function renderSearchDataToPage(city, currentAndFutureCityWeatherData) {
  const dateString    = moment.unix(currentAndFutureCityWeatherData.current.dt).format("MM/DD/YYYY hh:MM A");
  jqCurentTime.text(dateString);
  jqCityNameDropZone.text(city);
  
  try {
    const stringifiedJsonCityWeatherData = JSON.stringify(currentAndFutureCityWeatherData);
    
    const forecastPage = createJQueryForecastPageDataFromOpenweatherResponse(currentAndFutureCityWeatherData.forecast);
    const nowPage = createJQueryNowPageDataFromOpenweatherResponse(currentAndFutureCityWeatherData.current);

    jqNowDropZone.html("");
    jqNowDropZone.append(nowPage);

    jqForecastDropZone.html("");
    jqForecastDropZone.append(forecastPage);
  }
  catch (err) {
    // if my result came back successfully, I will trust the apikey enough to
    // store it for use next time in localstorage.  Otherwise, I get here 
    // and will just log the failure and return

    console.error("network error: ", err);
    
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
      jqError.text(`The city '${city}' wasn't found.`);
    }

    // I don't understand what happened.  Rethrow.
    throw err;
  }

  return;
}

function registerEvents() {
  // text area
  jqCitySearchText.on("change", async function (e) {
    try {
    const city = getCurrentlySelectedCity();
    const loadedData = await loadPageDataForCity(city);
    renderSearchDataToPage(city, loadedData);
    } catch (e) {
      console.log("search text change event caught:", e);
    }
  });

  // dropdown
  jqSearchSelector.on("change", async function (e) {
    const changedVal = jqSearchSelector.val();
    console.log(`changedVal: ${changedVal}`);
    // we know it's a good value because we added it already and we only add cities that check out.
    const loadedData = await loadPageDataForCity(changedVal);
    renderSearchDataToPage(changedVal, loadedData);
  });
}

function browserMain() {
  registerEvents();
}

browserMain();