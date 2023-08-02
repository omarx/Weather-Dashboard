const API_KEY='7634da25c1f920f7606e94c82b1cd774';
const API_URI=`https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`;
const GEO_CODE_API=`http://api.openweathermap.org/geo/1.0/direct?appid=${API_KEY}`;
const ICON_URL=`https://openweathermap.org/img/wn/`;
const search=document.getElementById('searchButton');
const searchInput=document.getElementById('searchCity');

async function getGeoCodes(query){
    try {
        const response = await fetch(`${GEO_CODE_API}&q=${query}&limit=1`);
        const data = await response.json();
        let coords = [data[0].lat, data[0].lon];
        return coords;
    } catch (error) {
        console.error('Error:', error);
    }
}

function kelvinToCelsius(kelvin) {
    return (parseInt(kelvin) - 273.15).toFixed(2);
}

async function getForecast(query) {
        try {
        coords=await getGeoCodes(query);
        const weather = await fetch(`${API_URI}&lat=${coords[0]}&lon=${coords[1]}`);
        const weatherData = await weather.json();
        let date=new Date(weatherData.list[0].dt*1000);
        let formattedDate = date.toLocaleDateString("en-US"); 
        let weatherIcon=weatherData.list[0].weather[0].icon; 
        let icon=`${ICON_URL}${weatherIcon}@2x.png`
        document.getElementById("Title").textContent=`${query} (${formattedDate})`;
        let image=document.querySelector('#icon');
        image.src = icon;
        let temp=kelvinToCelsius(weatherData.list[0].main.temp);
        let wind=weatherData.list[0].wind.speed;
        let humid=weatherData.list[0].main.humidity;
        document.getElementById("Temp").innerHTML=`Temp: ${temp}&deg;C`;
        document.getElementById("Wind").innerHTML=`Wind: ${wind}m/s`;
        document.getElementById("Humid").innerHTML=`Humidity: ${humid}%`;
        console.log(weatherData);
    } catch (error) {
        console.error('Error:', error);
    }
}
async function get5DayForecast(query){
    coords=await getGeoCodes(query);
    const weather = await fetch(`${API_URI}&lat=${coords[0]}&lon=${coords[1]}`);
    const weatherData=await weather.json();
    const weatherInfo=weatherData.list;
    let v=0;
    for (let i=8;i<weatherInfo.length;i=i+7){
        v++
        let date=new Date(weatherData.list[i].dt*1000);
        console.log(weatherData.list[i].dt*1000)
        let currentDate=date.toLocaleDateString("en-US")
        let temp=kelvinToCelsius(weatherData.list[i].main.temp);
        let wind=weatherData.list[i].wind.speed;
        let humid=weatherData.list[i].main.humidity;
        console.log(weatherData.list[i].weather[0].icon)
        let weatherIcon=weatherData.list[i].weather[0].icon;
        let icon=`${ICON_URL}${weatherIcon}@2x.png`;
        let image=document.querySelector(`#icon-day-${v}`);
        console.log(image)
        image.src=icon;
        console.log(icon);
        $(`#day-${v} #Title-day-${v}`).text(`${currentDate}`)
        $(`#temp-day-${v}`).html(`Temp: ${temp}&deg;C`);
        $(`#wind-day-${v}`).html(`Wind: ${wind}m/s`);
        $(`#humid-day-${v}`).html(`Humidity: ${humid}%`);
        
        //console.log(weatherData.list[i],v);
    }
}

search.addEventListener('click',function(){
    let searchItem=document.getElementById("searchCity").value;
    getForecast(searchItem);
    get5DayForecast(searchItem);
})
// getForecast(`San Diego`);


searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') { // Check if Enter key was pressed
    let searchItem = searchInput.value;
    getForecast(searchItem);
    get5DayForecast(searchItem);
  }
});

// getForecast(`San Diego`);

