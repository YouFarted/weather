"use strict"

var openWeatherKey = "151b4f3c3ea2c7894242b9a6df78cdf5"
var openWeatherUrl = "http://api.openweathermap.org/data/2.5/weather/";
var exampleResponse = {
  coord :{
    lon: -97.74,
    lat: 30.27
  },
  weather: [{id: 800, main:"Clear",description:"clear sky",icon:"01n"}],
  base:"stations",
  main:{
    temp:284.48,
    feels_like:279.7,
    temp_min:283.15,
    temp_max:286.15,
    pressure:1026,
    humidity:32
  },
  visibility:10000,
  wind:{
    speed:
    3.13,
    deg:42
  },
  clouds:{
    all:1
  },
  dt: 1605500109,
  sys:{
    type:1,
    id:3344,
    country:"US",
    sunrise:1605445028,
    sunset:1605483266
  },
  timezone:-21600,
  id:4671654,
  name:"Austin",
  cod:200
};

function getQueryize(obj)
{
  var keys = Object.keys(obj);
  var ret = "";
  for (let i=0; i<keys.length; ++i) {
    let key = keys[i];
    let val = obj[key];
    //console.log(`${key}: ${val}`);
    ret += (key + '=' + encodeURI(val))
    if (i!=(keys.length-1)) {
      ret += "&";
    }
  }
  return ret;
}

function makeWeatherApiUrl(obj)
{
  obj.appid = openWeatherKey;
  return openWeatherUrl + "?" + getQueryize(obj);
}

function kelvinToCelsius(kelvin) {
  const kelvinAtZeroCelsius = 273.15;
  return kelvin - kelvinAtZeroCelsius;
}

function kelvinToFahrenheit(k) {
  var celsius = kelvinToCelsius(k);
  return celsius * 9/5 + 32;
}

function getWeatherData(location, callback)
{
  var url = makeWeatherApiUrl({q: location});

  //console.log("URL: " + url);

  $.get(url, callback);
}

// Browser non-ui stuff goes here
function ajaxAustin(callback)
{
  getWeatherData("Austin", callback);
}

//////////////////////////////////////
// Browser UI stuff goes below here //
//////////////////////////////////////

var jSearchAustonButton             = null;
var jDropZone                       = null;

function grabPageElements()
{
  jSearchAustonButton = $("#search-austin");
  jDropZone          = $("#drop-zone");
}

function createTableFromObject(obj)
{
  var t = $("<table>");

  var keys = Object.keys(obj);

  for (let i=0; i<keys.length; ++i) {
    let key = keys[i];
    let val = obj[key];
    //console.log("typeof(val) = " + typeof(val));

    if (Array.isArray(val))
    {
      if(val.length !== 1) {
        console.log("holy smacks, an array is the data is not of size 1");
      }
      val = createTableFromObject(val[0])
    }
    else if(typeof(val) == "object")
    {
      val = createTableFromObject(val);
    }
    t.append($("<tr>").append($("<td>").html(key)).append($("<td>").html(val)));
  }

  return t;
}

function registerEvents()
{
  jSearchAustonButton.on("click", function(e){
    ajaxAustin(function(austinWeather){
      //console.log("got: " + JSON.stringify(austinWeather));
      var jsonAustinWeather = JSON.stringify(austinWeather);
      let t = createTableFromObject(austinWeather);
      //jDropZone.append($("<p>").html(jsonAustinWeather));
      jDropZone.append(t);
    });
  });
}

function browserMain()
{
  grabPageElements();
  registerEvents();
}

///////////////////////////////////////////////////////
// Straight non-Browser non-UI stuff goes below here //
///////////////////////////////////////////////////////


function isNode()
{
  return ((typeof process) === 'object');
}

function assert(x)
{
  if(!x)
  {
    throw "FAIL: " + x + " isn't true.  And UR ugly.";
  }
}

// main
if(!isNode()) {
  browserMain();
}
else {
  nodeMain();
}

function nodeMain()
{
  console.log("Node is running.  If the script just completes silently then nothing below blew up.");
  
  play();
  //tests();
}

function play()
{
  let make = makeWeatherApiUrl({q: "San Fransisco"});
  //console.log(make);
}

function deepArrayEquals(a, b)
{
  if (Array.isArray(a)){
    return (Array.isArray(b) && 
    a.length === b.length &&
    a.every((val, index) => deepArrayEquals(val, b[index])) );
  }
  return a === b;
}

function tests()
{
  testDeepArrayEquals();
}

function testDeepArrayEquals()
{
  assert(deepArrayEquals(1,1));
  assert(deepArrayEquals([],[]));
  assert(!deepArrayEquals(1,[]));
  assert(deepArrayEquals([1,2,3,4,5],[1,2,3,4,5]));
  assert(!deepArrayEquals([1,2,3,4,5],[1,2,3,4,6]));
}
