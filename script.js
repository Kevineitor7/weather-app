const time = document.querySelector('.time')
const city = document.querySelector('.city')
const country = document.querySelector('.country')
const temperature = document.querySelector('.temp')
const feels = document.querySelector('.feels')
const condition = document.querySelector('.condition')
const hoursTab = document.querySelector('.hours-tab')
const hours = document.querySelector('.hours')

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
    condition.innerHTML += data.current.condition.text
    data.forecast.forecastday[0].hour.forEach( (element, i) => {
      hours.innerHTML += `<div class="hours-info">
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
