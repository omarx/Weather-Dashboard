const API_KEY='7634da25c1f920f7606e94c82b1cd774';
const API_URI=`https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`;
const GEO_CODE_API=`http://api.openweathermap.org/geo/1.0/direct?appid=${API_KEY}`;
const ICON_URL=`https://openweathermap.org/img/wn/`;
const search=document.getElementById('searchButton');
const searchInput=document.getElementById('searchCity');
const MAX_ITEMS = 8;

//TODO 
async function getGeoCodes(query){
    try {
        const response = await fetch(`${GEO_CODE_API}&q=${query}&limit=1`);
        const data = await response.json();
        let coords = [data[0].lat, data[0].lon];
        return coords;
    } catch (error) {
       Swal.fire({
        icon:'error',
        title:'Oops...',
        text:"Looks like this location doesn't exist"
       })
       return null;
    }
}

function kelvinToCelsius(kelvin) {
    return (parseInt(kelvin) - 273.15).toFixed(2);
}


function addItemToArrayInLocalStorage(key, item) {
  // Retrieve the current array from localStorage
  const storedArrayString = localStorage.getItem(key);
  let array = storedArrayString ? JSON.parse(storedArrayString) : [];

  // Check if the item already exists in the array
  if (!array.includes(item)) {
    // If not, add the new item
    array.push(item);

    // Limit the array to the max number of items
    array = array.slice(-MAX_ITEMS);

    // Store the updated array back in localStorage
    localStorage.setItem(key, JSON.stringify(array));

    // Update the buttons
    createButtonsFromArray(array);
  } else {
    console.log('Item already exists in the array.');
  }
}

function createButtonsFromArray(array) {
    // Clear existing buttons
    $('#buttons-container').empty();
  
    // Create a new button for each item in the array
    array.forEach((item) => {
      $('<button>')
        .text(item)
        .addClass('history')
        .click(function() {
          getForecast(item);
          get5DayForecast(item);
        })
        .appendTo('#buttons-container');
    });
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
        v++;
        let date=new Date(weatherData.list[i].dt*1000);
        let currentDate=date.toLocaleDateString("en-US")
        let temp=kelvinToCelsius(weatherData.list[i].main.temp);
        let wind=weatherData.list[i].wind.speed;
        let humid=weatherData.list[i].main.humidity;       
        let weatherIcon=weatherData.list[i].weather[0].icon;
        let icon=`${ICON_URL}${weatherIcon}@2x.png`;
        let image=document.querySelector(`#icon-day-${v}`);
        image.src=icon;
        $(`#day-${v} #Title-day-${v}`).text(`${currentDate}`)
        $(`#temp-day-${v}`).html(`Temp: ${temp}&deg;C`);
        $(`#wind-day-${v}`).html(`Wind: ${wind}m/s`);
        $(`#humid-day-${v}`).html(`Humidity: ${humid}%`);

    }
}

search.addEventListener('click', async function () {
  let searchItem = searchInput.value;
  let coords = await getGeoCodes(searchItem);
  if(coords !== null) {
    getForecast(searchItem);
    get5DayForecast(searchItem);
    addItemToArrayInLocalStorage('cities', searchItem);
    updateButtons(); // Update the buttons immediately
  }
});

// Event listener for the Enter key in the search input field
searchInput.addEventListener('keydown', async function (event) {
  if (event.key === 'Enter') {
    let searchItem = searchInput.value;
    let coords = await getGeoCodes(searchItem);
    if(coords !== null) {
      getForecast(searchItem);
      get5DayForecast(searchItem);
      addItemToArrayInLocalStorage('cities', searchItem);
      updateButtons(); // Update the buttons immediately
    }
  }
});

// Function to update the buttons based on local storage
function updateButtons() {
  const storedArrayString = localStorage.getItem('cities');
  const array = storedArrayString ? JSON.parse(storedArrayString) : [];
  createButtonsFromArray(array);
}

// Create initial buttons from localStorage on page load
updateButtons();
