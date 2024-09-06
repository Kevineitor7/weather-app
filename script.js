const container = document.querySelector('.container')
const backgroundVideo = document.querySelector('.background-video')
const time = document.querySelector('.time')
const city = document.querySelector('.city')
const country = document.querySelector('.country')
const searchInput = document.getElementById('search')
const searchCityButton = document.querySelector('.btn-search')
const celsiusButton = document.querySelector('.celsius')
const fahrenheitButton = document.querySelector('.fahrenheit')
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
const facts = document.querySelector('.facts')
const activities = document.querySelector('.activities')
const hourTemp = document.querySelectorAll('.hour-temp')
let unit = 'c'

celsiusButton.classList.add('active')

function success(position) {
    const crd = position.coords;
    const latitude = crd.latitude
    const longitude = crd.longitude
    fetching(latitude,longitude)
}
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    time.innerHTML = 'Enter a location'
    celsiusButton.style = 'visibility: hidden'
    fahrenheitButton.style = 'visibility: hidden'
    hoursTab.style = 'visibility: hidden'
    forecast.style = 'visibility: hidden'
    facts.style = 'visibility: hidden'
    activities.style = 'visibility: hidden'
}
  
navigator.geolocation.getCurrentPosition(success, error);

searchCityButton.addEventListener('click', () => {
    unit = 'c'

    if (searchInput.value == '') {
        hours.innerHTML = ''
        forecastDays.innerHTML = ''
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        inputFetching(searchInput.value)
        
    }

    if (fahrenheitButton.classList.contains('active')) {
            fahrenheitButton.classList.remove('active')
            celsiusButton.classList.add('active')
    } else if (celsiusButton.classList.contains('active')) {
        return
    }
})

async function inputFetching(value) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=480bafb0e7094033b4b155606231408&q=${value}&days=3`, {mode: 'cors'})
        const inputData = await response.json()
        console.log(inputData)
        hours.innerHTML = ''
        forecastDays.innerHTML = ''
        
        doIt(inputData)
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
    celsiusButton.style = 'visibility: visible'
    fahrenheitButton.style = 'visibility: visible'
    time.innerHTML = data.location.localtime
    city.innerHTML = data.location.name + ', ' + data.location.region
    country.innerHTML = data.location.country
    if (unit == 'c') {
        temperature.innerHTML = Math.trunc(data.current.temp_c) + '&degC' 
        feels.innerHTML = 'Feels like ' + Math.trunc(data.current.feelslike_c) + '&degC'
    } else if (unit == 'f') {
        temperature.innerHTML = Math.trunc(data.current.temp_f) + '&degF' 
        feels.innerHTML = 'Feels like ' + Math.trunc(data.current.feelslike_f) + '&degF'
    }
    humidity.innerHTML = 'Humidity: ' + data.current.humidity + '%'
    condition.innerHTML = data.current.condition.text
    fillHours(data, unit)
    fillDays(data, unit)
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
    switch(moonPhase.innerHTML) {
        case 'Full Moon':
            moonPhase.innerHTML += ' 🌕';
            break;
        case 'New Moon':
            moonPhase.innerHTML += ' 🌑';
            break;
        case 'Waxing Crescent':
            moonPhase.innerHTML += ' 🌒';
            break;
        case 'Waning Crescent':
            moonPhase.innerHTML += ' 🌘';
            break;
        case 'Waxing Gibbous':
            moonPhase.innerHTML += ' 🌔';
            break;
        case 'Waning Gibbous':
            moonPhase.innerHTML += ' 🌖';
            break;
        case 'First Quarter':
            moonPhase.innerHTML += ' 🌓';
            break;
        case 'Last Quarter':
            moonPhase.innerHTML += ' 🌗';
            break;
    }
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
        runningScore += 0
    } else {
        runningScore -= 3
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
        fishingScore += 0
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
        bikingScore += 0
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
        beachPoolScore += 0
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
        runningScore -= 1
        bikingScore -= 1
        beachPoolScore -= 1
    }

    // --- wind for running, fishing, biking and beach/pool --- // 
    if (Math.trunc(data.current.wind_mph) <= 10) {
        runningScore += 2
        fishingScore += 3
        bikingScore += 3
        beachPoolScore += 2
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
        runningScore += 0
        fishingScore += 0
        bikingScore += 0
        beachPoolScore += 0
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
    } else if (data.current.pressure_in >= 28.00 && data.current.pressure_in <= 29.59 ||
        data.current.pressure_in >= 31.01 && data.current.pressure_in <= 32.00) {
        fishingScore += 0
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

    // --- running at night --- //
    if (data.current.is_day == 0) {
        runningScore += 1
    }

    if (data.current.condition.text.includes('snow') ||
        data.current.condition.text.includes('rain') ||
        data.current.condition.text.includes('Blizzard') ||
        data.current.condition.text.includes('ice') ||
        data.current.condition.text.includes('Ice') ||
        data.current.condition.text.includes('thunder') ||
        data.current.condition.text.includes('thundery') ||
        data.current.condition.text.includes('Thundery')) {
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
    } else if (runningScore == 4 || runningScore == 5) {
        runningConditions.style = 'border: 4px groove yellow'
        runningConditions.innerHTML = 'Good'
    } else if (runningScore == 2 || runningScore == 3) {
        runningConditions.style = 'border: 4px groove orange'
        runningConditions.innerHTML = 'Bad'
    } else if (runningScore <= 1) {
        runningConditions.style = 'border: 4px groove crimson'
        runningConditions.innerHTML = 'Avoid'
    }
    
    if (fishingScore >= 8) {
        fishingConditions.style = 'border: 4px groove aqua'
        fishingConditions.innerHTML = 'Ideal'
    } else if (fishingScore == 6 || fishingScore == 7) {
        fishingConditions.style = 'border: 4px groove greenyellow'
        fishingConditions.innerHTML = 'Great'
    } else if (fishingScore == 4 || fishingScore == 5) {
        fishingConditions.style = 'border: 4px groove yellow'
        fishingConditions.innerHTML = 'Good'
    } else if (fishingScore == 2 || fishingScore == 3) {
        fishingConditions.style = 'border: 4px groove orange'
        fishingConditions.innerHTML = 'Bad'
    } else if (fishingScore <= 1) {
        fishingConditions.style = 'border: 4px groove crimson'
        fishingConditions.innerHTML = 'Avoid'
    } 

    if (bikingScore >= 8) {
        bikingConditions.style = 'border: 4px groove aqua'
        bikingConditions.innerHTML = 'Ideal'
    } else if (bikingScore == 6 || bikingScore == 7) {
        bikingConditions.style = 'border: 4px groove greenyellow'
        bikingConditions.innerHTML = 'Great'
    } else if (bikingScore == 4 || bikingScore == 5) {
        bikingConditions.style = 'border: 4px groove yellow'
        bikingConditions.innerHTML = 'Good'
    } else if (bikingScore == 2 || bikingScore == 3) {
        bikingConditions.style = 'border: 4px groove orange'
        bikingConditions.innerHTML = 'Bad'
    } else if (bikingScore <= 1) {
        bikingConditions.style = 'border: 4px groove crimson'
        bikingConditions.innerHTML = 'Avoid'
    } 

    if (beachPoolScore >= 8) {
        beachConditions.style = 'border: 4px groove aqua'
        beachConditions.innerHTML = 'Ideal'
    } else if (beachPoolScore == 6 || beachPoolScore == 7) {
        beachConditions.style = 'border: 4px groove greenyellow'
        beachConditions.innerHTML = 'Great'
    } else if (beachPoolScore == 4 || beachPoolScore == 5) {
        beachConditions.style = 'border: 4px groove yellow'
        beachConditions.innerHTML = 'Good'
    } else if (beachPoolScore == 2 || beachPoolScore == 3) {
        beachConditions.style = 'border: 4px groove orange'
        beachConditions.innerHTML = 'Bad'
    } else if (beachPoolScore <= 1) {
        beachConditions.style = 'border: 4px groove crimson'
        beachConditions.innerHTML = 'Avoid'
    }
    // --- set background video per weather condition --- //
    if (data.current.is_day == 1) {
        hoursTab.style = 'background: rgba(0, 0, 0, 0.8);'
        forecast.style = 'background: rgba(0, 0, 0, 0.8);'
        facts.style = 'background: rgba(0, 0, 0, 0.8);'
        activities.style = 'background: rgba(0, 0, 0, 0.8);'
        if (data.current.condition.code == 1000 || data.current.condition.code == 1003) {
        /* SUNNY */     backgroundVideo.src = 'https://cdn.pixabay.com/video/2022/05/29/118555-715426774_large.mp4'
        } else if (data.current.condition.code == 1006 || data.current.condition.code == 1009) {
        /* CLOUDY */    backgroundVideo.src = 'https://cdn.pixabay.com/video/2021/02/10/64759-510850877_large.mp4'
        } else if (data.current.condition.code == 1030 || data.current.condition.code == 1135) {
        /* FOG */       backgroundVideo.src = 'https://cdn.pixabay.com/video/2022/01/08/103840-664507395_large.mp4'
        } else if (data.current.condition.code == 1063 || data.current.condition.code == 1150 ||
                   data.current.condition.code == 1153 || data.current.condition.code == 1180 ||
                   data.current.condition.code == 1183 || data.current.condition.code == 1186 ||
                   data.current.condition.code == 1189 || data.current.condition.code == 1192 ||
                   data.current.condition.code == 1195 || data.current.condition.code == 1198 ||
                   data.current.condition.code == 1201 || data.current.condition.code == 1240 ||
                   data.current.condition.code == 1243 || data.current.condition.code == 1246) {
        /* RAIN */      backgroundVideo.src = 'https://cdn.pixabay.com/video/2023/02/22/151744-801455851_large.mp4'
        } else if (data.current.condition.code == 1087 || data.current.condition.code == 1273 ||
                   data.current.condition.code == 1276 || data.current.condition.code == 1279 ||
                   data.current.condition.code == 1282) {
        /* THUNDER */   backgroundVideo.src = 'https://cdn.pixabay.com/video/2024/07/21/222308_large.mp4'
        } else if (data.current.condition.code == 1066 || data.current.condition.code == 1069 ||
                   data.current.condition.code == 1072 || data.current.condition.code == 1114 ||
                   data.current.condition.code == 1117 || data.current.condition.code == 1147 ||
                   data.current.condition.code == 1168 || data.current.condition.code == 1171 ||
                   data.current.condition.code == 1204 || data.current.condition.code == 1207 ||
                   data.current.condition.code == 1210 || data.current.condition.code == 1213 ||
                   data.current.condition.code == 1216 || data.current.condition.code == 1219 ||
                   data.current.condition.code == 1222 || data.current.condition.code == 1225 ||
                   data.current.condition.code == 1237 || data.current.condition.code == 1249 ||
                   data.current.condition.code == 1252 || data.current.condition.code == 1255 ||
                   data.current.condition.code == 1258 || data.current.condition.code == 1261 ||
                   data.current.condition.code == 1264) {
        /* SNOW */      backgroundVideo.src = 'https://cdn.pixabay.com/video/2023/11/30/191443-890121806_large.mp4'
        }
    } 
    else if (data.current.is_day == 0) {
        hoursTab.style = 'background: rgba(60, 60, 60, 0.8);'
        forecast.style = 'background: rgba(60, 60, 60, 0.8);'
        facts.style = 'background: rgba(60, 60, 60, 0.8);'
        activities.style = 'background: rgba(60, 60, 60, 0.8);'
        if (data.current.condition.code == 1063 || data.current.condition.code == 1150 ||
            data.current.condition.code == 1153 || data.current.condition.code == 1180 ||
            data.current.condition.code == 1183 || data.current.condition.code == 1186 ||
            data.current.condition.code == 1189 || data.current.condition.code == 1192 ||
            data.current.condition.code == 1195 || data.current.condition.code == 1198 ||
            data.current.condition.code == 1201 || data.current.condition.code == 1240 ||
            data.current.condition.code == 1243 || data.current.condition.code == 1246) {
        /* NIGHT RAIN */    backgroundVideo.src = 'https://cdn.pixabay.com/video/2023/03/09/153978-806571981_large.mp4'
        } else if (data.current.condition.code == 1066 || data.current.condition.code == 1069 ||
                   data.current.condition.code == 1072 || data.current.condition.code == 1114 ||
                   data.current.condition.code == 1117 || data.current.condition.code == 1147 ||
                   data.current.condition.code == 1168 || data.current.condition.code == 1171 ||
                   data.current.condition.code == 1204 || data.current.condition.code == 1207 ||
                   data.current.condition.code == 1210 || data.current.condition.code == 1213 ||
                   data.current.condition.code == 1216 || data.current.condition.code == 1219 ||
                   data.current.condition.code == 1222 || data.current.condition.code == 1225 ||
                   data.current.condition.code == 1237 || data.current.condition.code == 1249 ||
                   data.current.condition.code == 1252 || data.current.condition.code == 1255 ||
                   data.current.condition.code == 1258 || data.current.condition.code == 1261 ||
                   data.current.condition.code == 1264) {
        /* NIGHT SNOW */    backgroundVideo.src = 'https://cdn.pixabay.com/video/2021/10/01/90453-626004965_large.mp4'     
        } else if (data.current.condition.code == 1087 || data.current.condition.code == 1273 ||
                   data.current.condition.code == 1276 || data.current.condition.code == 1279 ||
                   data.current.condition.code == 1282) {
        /* NIGHTTHUNDER */  backgroundVideo.src = 'https://cdn.pixabay.com/video/2021/09/13/88491-606079589_large.mp4'    
        } else {
        /* NIGHT CLEAR */   backgroundVideo.src = 'https://cdn.pixabay.com/video/2022/11/03/137617-767056247_large.mp4'
        }
    }
    
    fahrenheitButton.addEventListener('click', () => {
        if (fahrenheitButton.classList.contains('active')) {
            return 
        } else {
            unit = 'f'
            celsiusButton.classList.remove('active')
            fahrenheitButton.classList.add('active')
            hours.innerHTML = ''
            forecastDays.innerHTML = ''
            inputFetching(city.innerHTML)
            console.log(unit)
        }
    })

    celsiusButton.addEventListener('click', () => {
        if (celsiusButton.classList.contains('active')) {
            return 
        } else {
            unit = 'c'
            fahrenheitButton.classList.remove('active')
            celsiusButton.classList.add('active')
            hours.innerHTML = ''
            forecastDays.innerHTML = ''
            inputFetching(city.innerHTML)
            console.log(unit)
        }
    })
}

function fillHours(data, type) {
    if (type == 'c') {
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
    } else if (type == 'f') {
        data.forecast.forecastday[0].hour.forEach( (element, i) => {
            hours.innerHTML += `
            <div class="hours-info">
                <div class="hour">${data.forecast.forecastday[0].hour[i].time.slice(10)}</div>
                <div class="hour-icon"><img src="${data.forecast.forecastday[0].hour[i].condition.icon}" alt="no"></div>
                <div class="hour-temp">${Math.trunc(data.forecast.forecastday[0].hour[i].temp_f)}&degF</div>
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
}

function fillDays(data, type) {
    if (type == 'c') {
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
    } else if (type == 'f') {
        data.forecast.forecastday.forEach((element, i) => {
            forecastDays.innerHTML += `
            <div class="day-info">
                <div class="day">${data.forecast.forecastday[i].date}</div>
                <div class="day-icon"><img src="${data.forecast.forecastday[i].day.condition.icon}" alt="no"></div>
                <div class="day-temp">
                    <div class="max-temp">↑${Math.trunc(data.forecast.forecastday[i].day.maxtemp_f)}&degF</div>
                    <div class="min-temp">↓${Math.trunc(data.forecast.forecastday[i].day.mintemp_f)}&degF</div>
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
    }
}

// -- updates page every 2 minutes -- //
setTimeout(() => {
    document.location.reload();
  }, 120000);