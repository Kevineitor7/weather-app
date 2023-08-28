const container = document.querySelector('.container')
const time = document.querySelector('.time')
const city = document.querySelector('.city')
const country = document.querySelector('.country')
const searchInput = document.getElementById('search')
const searchCityButton = document.querySelector('.btn-search')
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
const visibility = document.querySelector('.visib')
const uvIndex = document.querySelector('.uv')
const moonPhase = document.querySelector('.moon-phase')
const hottestHour = document.querySelector('.hottest-hour')
const coldestHour = document.querySelector('.coldest-hour')
const runningConditions = document.querySelector('.running')
const fishingConditions = document.querySelector('.fishing')
const bikingConditions = document.querySelector('.biking')
const beachConditions = document.querySelector('.beach')

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

  searchCityButton.addEventListener('click', () => {
    inputFetching(searchInput.value)
  })

  async function inputFetching(value) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=480bafb0e7094033b4b155606231408&q=${value}&days=3`, {mode: 'cors'})
        const data = await response.json()
        console.log(data)
        hours.innerHTML = ''
        forecastDays.innerHTML = ''
        doIt(data)
    }
    catch(err) {
            console.log(err)
    }
  }

  async function fetching(lat,lon) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=480bafb0e7094033b4b155606231408&q=${lat},${lon}&days=3`, {mode: 'cors'})
        const data = await response.json()
        console.log(data)
        doIt(data)
    }
    catch(err) {
        console.log(err)
    }
}

function doIt(data) {
    time.innerHTML = data.location.localtime
    city.innerHTML = data.location.name + ', ' + data.location.region
    country.innerHTML = data.location.country
    temperature.innerHTML = Math.trunc(data.current.temp_c) + '&degC' 
    feels.innerHTML = 'Feels like ' + Math.trunc(data.current.feelslike_c) + '&degC'
    humidity.innerHTML = 'Humidity: ' + data.current.humidity + '%'
    condition.innerHTML = data.current.condition.text
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
    sunrise.innerHTML = data.forecast.forecastday[0].astro.sunrise
    sunset.innerHTML = data.forecast.forecastday[0].astro.sunset
    windSpeed.innerHTML = Math.trunc(data.current.wind_kph) + ' kph / ' + Math.trunc(data.current.wind_mph) + ' mph'
    switch(data.current.wind_dir) {
        case 'N':
        case 'NNW':
        case 'NNE':
            windDirection.innerHTML = '↑';
            break;
        case 'NE':
            windDirection.innerHTML = '↗';
            break;
        case 'ENE':
        case 'E':
        case 'ESE':
            windDirection.innerHTML = '→';
            break;
        case 'SE':
            windDirection.innerHTML = '↘';
            break;
        case 'SSE':
        case 'S':
        case 'SSW':
            windDirection.innerHTML = '↓';
            break;
        case 'SW':
            windDirection.innerHTML = '↙';
            break;
        case 'WSW':
        case 'W':
        case 'WNW':
            windDirection.innerHTML = '←';
            break;
        case 'NW':
            windDirection.innerHTML = '↖';
            break;
    }
    precipitation.innerHTML = data.current.precip_in + ' in'
    visibility.innerHTML = data.current.vis_km + ' km / ' + data.current.vis_miles + ' mi'
    uvIndex.innerHTML = data.current.uv
    moonPhase.innerHTML = data.forecast.forecastday[0].astro.moon_phase
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

    let runningScore = 0
    let fishingScore = 0
    let bikingScore = 0
    let beachPoolScore = 0

    // --- temperature for running --- //
    if (Math.trunc(data.current.temp_c) >= 10 && Math.trunc(data.current.temp_c) <= 21) {
        runningScore += 3
    } else if (Math.trunc(data.current.temp_c) >= 4 && Math.trunc(data.current.temp_c)<= 9 ||
    Math.trunc(data.current.temp_c) >= 22 && Math.trunc(data.current.temp_c) <= 27) {
        runningScore += 2
    } else if (Math.trunc(data.current.temp_c) >= 2 && Math.trunc(data.current.temp_c) <= 3 ||
    Math.trunc(data.current.temp_c) >= 28 && Math.trunc(data.current.temp_c) <= 29) {
        runningScore += 1
    } else if (Math.trunc(data.current.temp_c) >= -5 && Math.trunc(data.current.temp_c) <= 1 ||
    Math.trunc(data.current.temp_c) >= 30 && Math.trunc(data.current.temp_c) <= 37) {
        runningScore += 0.5
    } else {
        runningScore -= 2
    }

    // --- temperature for fishing --- //
    if (Math.trunc(data.current.temp_c) >= 10 && Math.trunc(data.current.temp_c) <= 24) {
        fishingScore += 3
    } else if (Math.trunc(data.current.temp_c) >= 4 && Math.trunc(data.current.temp_c) <= 9 ||
    Math.trunc(data.current.temp_c) >= 25 && Math.trunc(data.current.temp_c) <= 29) {
        fishingScore += 2
    } else if (Math.trunc(data.current.temp_c) >= 2 && Math.trunc(data.current.temp_c) <= 3 ||
    Math.trunc(data.current.temp_c) >= 30 && Math.trunc(data.current.temp_c) <= 32) {
        fishingScore += 1
    } else if (Math.trunc(data.current.temp_c) >= -5 && Math.trunc(data.current.temp_c) <= 1 ||
    Math.trunc(data.current.temp_c) >= 33 && Math.trunc(data.current.temp_c) <= 37) {
        fishingScore += 0.5
    } else {
        fishingScore -= 2
    }

    // --- temperature for biking --- //
    if (Math.trunc(data.current.temp_c) >= 16 && Math.trunc(data.current.temp_c) <= 24) {
        bikingScore += 3
    } else if (Math.trunc(data.current.temp_c) >= 10 && Math.trunc(data.current.temp_c) <= 15 ||
    Math.trunc(data.current.temp_c) >= 25 && Math.trunc(data.current.temp_c) <= 29) {
        bikingScore += 2
    } else if (Math.trunc(data.current.temp_c) >= 4 && Math.trunc(data.current.temp_c) <= 9 ||
    Math.trunc(data.current.temp_c) >= 30 && Math.trunc(data.current.temp_c) <= 32) {
        bikingScore += 1
    } else if (Math.trunc(data.current.temp_c) >= -5 && Math.trunc(data.current.temp_c) <= 3 ||
    Math.trunc(data.current.temp_c) >= 33 && Math.trunc(data.current.temp_c) <= 37) {
        bikingScore += 0.5
    } else {
        bikingScore -= 2
    }

    // --- temperature for beach/pool --- //
    if (Math.trunc(data.current.temp_c) >= 24 && Math.trunc(data.current.temp_c) <= 29) {
        beachPoolScore += 3
    } else if (Math.trunc(data.current.temp_c) >= 21 && Math.trunc(data.current.temp_c) <= 23 ||
    Math.trunc(data.current.temp_c) >= 30 && Math.trunc(data.current.temp_c) <= 32) {
        beachPoolScore += 2
    } else if (Math.trunc(data.current.temp_c) >= 18 && Math.trunc(data.current.temp_c) <= 20 ||
    Math.trunc(data.current.temp_c) >= 33 && Math.trunc(data.current.temp_c) <= 35) {
        beachPoolScore += 1
    } else if (Math.trunc(data.current.temp_c) >= 10 && Math.trunc(data.current.temp_c) <= 17 ||
    Math.trunc(data.current.temp_c) >= 36 && Math.trunc(data.current.temp_c) <= 43) {
        beachPoolScore += 0.5
    } else {
        beachPoolScore -= 2
    }

    // --- humidity for running, biking and beach/pool --- //
    if (data.current.humidity <= 50) {
        runningScore += 3
        bikingScore += 3
        beachPoolScore += 3
    } else if (data.current.humidity >= 51 && data.current.humidity <= 70) {
        runningScore += 2
        bikingScore += 2
        beachPoolScore += 2
    } else if (data.current.humidity >= 71 && data.current.humidity <= 80) {
        runningScore += 1
        bikingScore += 1
        beachPoolScore += 1
    } else {
        runningScore -= 2
        bikingScore -= 1
        beachPoolScore -= 1
    }

    // --- wind for running, fishing, biking and beach/pool --- // 
    if (Math.trunc(data.current.wind_mph) <= 10) {
        runningScore += 3
        fishingScore += 3
        bikingScore += 3
        beachPoolScore += 3
    } else if (Math.trunc(data.current.wind_mph) >= 11 && Math.trunc(data.current.wind_mph) <= 15) {
        runningScore += 2
        fishingScore += 2
        bikingScore += 2
        beachPoolScore += 2
    } else if (Math.trunc(data.current.wind_mph) >= 16 && Math.trunc(data.current.wind_mph) <= 20) {
        runningScore += 1
        fishingScore += 1
        bikingScore += 1
        beachPoolScore += 1
    } else if (Math.trunc(data.current.wind_mph) >= 21 && Math.trunc(data.current.wind_mph) <= 30) {
        runningScore += 0.5
        fishingScore += 0.5
        bikingScore += 0.5
        beachPoolScore += 0.5
    } else {
        runningScore -= 2
        fishingScore -= 3
        bikingScore -= 3
        beachPoolScore -= 3
    }

    // --- pressure for fishing --- //
    if (data.current.pressure_in >= 30.00 && data.current.pressure_in <= 30.50) {
        fishingScore += 3
    } else if (data.current.pressure_in >= 29.80 && data.current.pressure_in <= 29.99 ||
        data.current.pressure_in >= 30.51 && data.current.pressure_in <= 30.80) {
        fishingScore += 2
    } else if (data.current.pressure_in >= 29.60 && data.current.pressure_in <= 29.79 ||
        data.current.pressure_in >= 30.81 && data.current.pressure_in <= 31.00) {
        fishingScore += 1
    } else {
        fishingScore -= 2
    }

    // --- visibility for biking --- //
    if (data.current.vis_km <= 6) {
        bikingScore -= 1
        beachPoolScore -= 1
    } else if (data.current.vis_km <= 3) {
        bikingScore -= 2
        beachPoolScore -= 2 
    }

    // --- uv index for beach/pool --- //
    if (data.current.uv >= 0 && data.current.uv <= 7) {
        beachPoolScore += 3 
    } else if (data.current.uv >= 8 && data.current.uv <= 9) {
        beachPoolScore += 2 
    } else if (data.current.uv == 10) {
        beachPoolScore += 1 
    } else if (data.current.uv >= 11) {
        beachPoolScore -= 1
    }

    if (data.current.condition.text.includes('snow') ||
        data.current.condition.text.includes('rain') ||
        data.current.condition.text.includes('Blizzard') ||
        data.current.condition.text.includes('ice') ||
        data.current.condition.text.includes('Ice') ||
        data.current.condition.text.includes('thunder') ||
        data.current.condition.text.includes('thundery')) {
            runningScore = 0
            fishingScore = 0
            bikingScore = 0
            beachPoolScore = 0
    }

    if (runningScore >= 8) {
        runningConditions.style = 'border: 4px groove aqua'
        runningConditions.innerHTML = 'Ideal'
    } else if (runningScore == 6 || runningScore == 7) {
        runningConditions.style = 'border: 4px groove greenyellow'
        runningConditions.innerHTML = 'Great'
    } else if (runningScore >= 4 || runningScore == 5) {
        runningConditions.style = 'border: 4px groove yellow'
        runningConditions.innerHTML = 'Good'
    } else if (runningScore >= 2 || runningScore == 3) {
        runningConditions.style = 'border: 4px groove orange'
        runningConditions.innerHTML = 'Bad'
    } else if (runningScore == 1 || runningScore == 0) {
        runningConditions.style = 'border: 4px groove crimson'
        runningConditions.innerHTML = 'Avoid'
    }
    
    if (fishingScore >= 8) {
        fishingConditions.style = 'border: 4px groove aqua'
        fishingConditions.innerHTML = 'Ideal'
    } else if (fishingScore == 6 || fishingScore == 7) {
        fishingConditions.style = 'border: 4px groove greenyellow'
        fishingConditions.innerHTML = 'Great'
    } else if (fishingScore >= 4 || fishingScore == 5) {
        fishingConditions.style = 'border: 4px groove yellow'
        fishingConditions.innerHTML = 'Good'
    } else if (fishingScore >= 2 || fishingScore == 3) {
        fishingConditions.style = 'border: 4px groove orange'
        fishingConditions.innerHTML = 'Bad'
    } else if (fishingScore == 1 || fishingScore == 0) {
        fishingConditions.style = 'border: 4px groove crimson'
        fishingConditions.innerHTML = 'Avoid'
    } 

    if (bikingScore >= 8) {
        bikingConditions.style = 'border: 4px groove aqua'
        bikingConditions.innerHTML = 'Ideal'
    } else if (bikingScore == 6 || bikingScore == 7) {
        bikingConditions.style = 'border: 4px groove greenyellow'
        bikingConditions.innerHTML = 'Great'
    } else if (bikingScore >= 4 || bikingScore == 5) {
        bikingConditions.style = 'border: 4px groove yellow'
        bikingConditions.innerHTML = 'Good'
    } else if (bikingScore >= 2 || bikingScore == 3) {
        bikingConditions.style = 'border: 4px groove orange'
        bikingConditions.innerHTML = 'Bad'
    } else if (bikingScore == 1 || bikingScore == 0) {
        bikingConditions.style = 'border: 4px groove crimson'
        bikingConditions.innerHTML = 'Avoid'
    } 

    if (beachPoolScore >= 8) {
        beachConditions.style = 'border: 4px groove aqua'
        beachConditions.innerHTML = 'Ideal'
    } else if (beachPoolScore == 6 || beachPoolScore == 7) {
        beachConditions.style = 'border: 4px groove greenyellow'
        beachConditions.innerHTML = 'Great'
    } else if (beachPoolScore >= 4 || beachPoolScore == 5) {
        beachConditions.style = 'border: 4px groove yellow'
        beachConditions.innerHTML = 'Good'
    } else if (beachPoolScore >= 2 || beachPoolScore == 3) {
        beachConditions.style = 'border: 4px groove orange'
        beachConditions.innerHTML = 'Bad'
    } else if (beachPoolScore == 1 || beachPoolScore == 0) {
        beachConditions.style = 'border: 4px groove crimson'
        beachConditions.innerHTML = 'Avoid'
    }
}
