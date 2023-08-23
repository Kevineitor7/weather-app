const time = document.querySelector('.time')
const city = document.querySelector('.city')
const country = document.querySelector('.country')
const weather = document.querySelector('.weather')
const condition = document.querySelector('.condition')

const date = new Date() 
const hour = date.getHours() 
const minute = String(date.getMinutes()).padStart(2, "0");

function success(position) {
    const crd = position.coords;
    const latitude = crd.latitude
    const longitude = crd.longitude
  
    console.log("Your current position is:");
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
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=480bafb0e7094033b4b155606231408&q=${lat},${lon}`, {mode: 'cors'})
    const data = await response.json()
    console.log(data)
    time.innerHTML += date.toLocaleDateString("en-US") + ' ' + hour + ':' + minute
    city.innerHTML += data.location.name + ', ' + data.location.region
    country.innerHTML += data.location.country
    weather.innerHTML += Math.trunc(data.current.temp_c) + '&deg C' 
    condition.innerHTML += data.current.condition.text
    }
    catch(err) {
        console.log(err)
    }
}