const time = document.querySelector('.time')
const city = document.querySelector('.city')
const country = document.querySelector('.country')
const temperature = document.querySelector('.temp')
const feels = document.querySelector('.feels')
const humidity = document.querySelector('.humidity')
const condition = document.querySelector('.condition')
const hoursTab = document.querySelector('.hours-tab')
const hours = document.querySelector('.hours')
const forecast = document.querySelector('.forecast')
const forecastDays = document.querySelector('.days')
const sunrise = document.querySelector('.sunrise')
const sunset = document.querySelector('.sunset')
const windSpeed = document.querySelector('.wind-speed')
const windDirection = document.querySelector('.wind-direction')
const precipitation = document.querySelector('.precip')
const uvIndex = document.querySelector('.uv')
const moonPhase = document.querySelector('.moon-phase')
const hottestHour = document.querySelector('.hottest-hour')
const coldestHour = document.querySelector('.coldest-hour')

function success(position) {
    const crd = position.coords;
    const latitude = crd.latitude
    const longitude = crd.longitude
  
    console.log(`Latitude : ${latitude}`);
    console.log(`Longitude: ${longitude}`);

    fetching(latitude,longitude)
}
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
  
  navigator.geolocation.getCurrentPosition(success, error);

  async function fetching(lat,lon) {
    try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=480bafb0e7094033b4b155606231408&q=${lat},${lon}&days=3`, {mode: 'cors'})
    const data = await response.json()
    console.log(data)
    time.innerHTML += data.location.localtime
    city.innerHTML += data.location.name + ', ' + data.location.region
    country.innerHTML += data.location.country
    temperature.innerHTML += Math.trunc(data.current.temp_c) + '&degC' 
    feels.innerHTML += 'Feels like ' + Math.trunc(data.current.feelslike_c) + '&degC'
    humidity.innerHTML += 'Humidity: ' + data.current.humidity + '%'
    condition.innerHTML += data.current.condition.text
    data.forecast.forecastday[0].hour.forEach( (element, i) => {
        hours.innerHTML += `
        <div class="hours-info">
            <div class="hour">${data.forecast.forecastday[0].hour[i].time.slice(10)}</div>
            <div class="hour-icon"><img src="${data.forecast.forecastday[0].hour[i].condition.icon}" alt="no"></div>
            <div class="hour-temp">${Math.trunc(data.forecast.forecastday[0].hour[i].temp_c)}&degC</div>
            <div class="hour-humidity">Humidity: ${data.forecast.forecastday[0].hour[i].humidity}%</div>
            <div class="hour-rain-snow">
                <div class="hour-rain">
                    <div class="hour-rain-icon"><img src='https://www.iconarchive.com/download/i95046/custom-icon-design/lovely-weather-2/Humidity.ico' alt='no'></div>
                    <div class="hour-rain-chance">${data.forecast.forecastday[0].hour[i].chance_of_rain}%</div>
                </div>
                <div class="hour-snow">
                    <div class="hour-snow-icon"><img src='https://www.freeiconspng.com/thumbs/snow-icon/blue-snow-icon-8.png' alt='no'></div>
                    <div class="hour-snow-chance">${data.forecast.forecastday[0].hour[i].chance_of_snow}%</div>
                </div>
            </div>
        </div>`
    })
    data.forecast.forecastday.forEach((element, i) => {
        forecastDays.innerHTML += `
        <div class="day-info">
            <div class="day">${data.forecast.forecastday[i].date}</div>
            <div class="day-icon"><img src="${data.forecast.forecastday[i].day.condition.icon}" alt="no"></div>
            <div class="day-temp">
                <div class="max-temp">↑${Math.trunc(data.forecast.forecastday[i].day.maxtemp_c)}&degC</div>
                <div class="min-temp">↓${Math.trunc(data.forecast.forecastday[i].day.mintemp_c)}&degC</div>
            </div>
            <div class="day-rain-snow">
                <div class="day-rain">
                    <div class="day-rain-icon"><img src="https://www.iconarchive.com/download/i95046/custom-icon-design/lovely-weather-2/Humidity.ico" alt="no"></div>
                    <div class="day-rain-chance">${data.forecast.forecastday[i].day.daily_chance_of_rain}%</div>
                </div>
                <div class="day-snow">
                    <div class="day-snow-icon"><img src="https://www.freeiconspng.com/thumbs/snow-icon/blue-snow-icon-8.png" alt="no"></div>
                    <div class="day-snow-chance">${data.forecast.forecastday[i].day.daily_chance_of_snow}%</div>
                </div>
            </div>
        </div>`
    })
    sunrise.innerHTML += data.forecast.forecastday[0].astro.sunrise
    sunset.innerHTML += data.forecast.forecastday[0].astro.sunset
    windSpeed.innerHTML += Math.trunc(data.current.wind_kph) + ' kph'
    switch(data.current.wind_dir) {
        case 'N':
        case 'NNW':
        case 'NNE':
            windDirection.innerHTML += '↑';
            break;
        case 'NE':
            windDirection.innerHTML += '↗';
            break;
        case 'ENE':
        case 'E':
        case 'ESE':
            windDirection.innerHTML += '→';
            break;
        case 'SE':
            windDirection.innerHTML += '↘';
            break;
        case 'SSE':
        case 'S':
        case 'SSW':
            windDirection.innerHTML += '↓';
            break;
        case 'SW':
            windDirection.innerHTML += '↙';
            break;
        case 'WSW':
        case 'W':
        case 'WNW':
            windDirection.innerHTML += '←';
            break;
        case 'NW':
            windDirection.innerHTML += '↖';
            break;
    }
    precipitation.innerHTML += data.current.precip_in + ' in'
    uvIndex.innerHTML += data.current.uv
    moonPhase.innerHTML += data.forecast.forecastday[0].astro.moon_phase
    let highest = 0
    let lowest = 150
    let hottestTime
    let coldestTime 
    for (let i = 0; i < data.forecast.forecastday[0].hour.length; i++) {
        if (data.forecast.forecastday[0].hour[i].temp_c > highest) {
            highest = data.forecast.forecastday[0].hour[i].temp_c
            hottestTime = data.forecast.forecastday[0].hour[i].time.slice(10)
        }
        if (data.forecast.forecastday[0].hour[i].temp_c < lowest) {
            lowest = data.forecast.forecastday[0].hour[i].temp_c
            coldestTime = data.forecast.forecastday[0].hour[i].time.slice(10)
        }
        hottestHour.innerHTML = hottestTime
        coldestHour.innerHTML = coldestTime
        }
    }
    catch(err) {
        console.log(err)
    }
}

/*function addHourInfo(data, index) {
  hours.innerHTML += `<div class="hours-info">
  <div class="hour">${data.forecast.forecastday[0].hour[index].time.slice(10)}</div>
  <div class="hour-icon">sol</div>
  <div class="hour-temp">41&degC</div>
  <div class="hour-humidity">40%</div>
  <div class="hour-rain-snow">
      <div class="hour-rain">
          <div class="hour-rain-icon">llu</div>
          <div class="hour-rain-chance">0%</div>
      </div>
      <div class="hour-snow">
          <div class="hour-snow-icon">sno</div>
          <div class="hour-snow-chance">0%</div>
      </div>
  </div>
</div>`
}*/
