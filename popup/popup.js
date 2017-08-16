function getLocation() {
  return new Promise(function (resolve, reject) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject({error: 'Sorry, geolocation request forbidden.'})
    }
  });
}


function getWeatherByLocation(location) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    let apiId = '18e4799a71cd2e45611a7cc22bf57c34';
    let params = `?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${apiId}`;
    let url = `http://api.openweathermap.org/data/2.5/weather${params}`;

    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject({error: xhr.statusText})
      }
    };
    xhr.send();
  });
}


function showWeatherInPopup(weatherObject) {
  if (!weatherObject.error) {
    const absoluteZero = 273;
    city.innerText = weatherObject.name;
    icon.src = `http://openweathermap.org/img/w/${weatherObject.weather[0].icon}.png`;
    temperature.innerText = `${parseInt(weatherObject.main.temp - absoluteZero)} \u00B0C`;
    clouds.innerText = `Clouds: ${weatherObject.clouds.all}%`;
    wind.innerText = `Wind: ${weatherObject.wind.speed}m/s`;
    weatherBlock.classList.remove('invisible');
    spinner.classList.add('invisible');
  } else {
    error.innerText = 'Oops, something went wrong!';
    error.classList.remove('invisible');
    spinner.classList.add('invisible');
  }
}


getLocation()
  .then(location => getWeatherByLocation(location))
  .then(weather => showWeatherInPopup(weather));