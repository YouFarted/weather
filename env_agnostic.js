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

function makeWeatherApiUrl(obj, baseUrl, openWeatherKey) {
    obj.appid = openWeatherKey;
    return baseUrl + "?" + getQueryize(obj);
}

function isNode() {
    return ((typeof process) === 'object');
}

function nodeMain() {
  console.log("Node is running.");
  
  play();
}

function tests() {
    console.log("I'm doing no tests - for now at least.");
    let make = makeWeatherApiUrl({ q: "San Fransisco" }, "http://fakeweatherapiurl.com", "fakeopenweatherkey");
    console.log(make);
}

function play() {
    let make = makeWeatherApiUrl({ q: "San Fransisco" }, "http://fakeweatherapiurl.com", "fakeopenweatherkey");
    console.log(make);
}

// main
if (!isNode()) {
    console.log("This code is running in the browser.");
}
else {
  nodeMain();
}
  
function deepArrayEquals(a, b) {
    if (Array.isArray(a)) {
      return (Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => deepArrayEquals(val, b[index])));
    }
    return a === b;
  }
  
  function tests() {
    testDeepArrayEquals();
  }
  
  function testDeepArrayEquals() {
    assert(deepArrayEquals(1, 1));
    assert(deepArrayEquals([], []));
    assert(!deepArrayEquals(1, []));
    assert(deepArrayEquals([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]));
    assert(!deepArrayEquals([1, 2, 3, 4, 5], [1, 2, 3, 4, 6]));
  }
  