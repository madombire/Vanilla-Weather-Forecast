function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let humidityElement = document.querySelector("#humidity");
  let descriptionElement = document.querySelector("#weather-description");
  let windElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#day-and-time");
  let iconElement = document.querySelector("#icon");

  let temperature = response.data.temperature.current;
  let city = response.data.city;
  let humidity = response.data.temperature.humidity;
  let description = response.data.condition.description;
  let windSpeed = response.data.wind.speed;
  let timestamp = response.data.time * 1000;
  let date = new Date(timestamp);

  cityElement.innerHTML = city;
  temperatureElement.innerHTML = Math.round(temperature);
  humidityElement.innerHTML = `${humidity}%`;
  descriptionElement.innerHTML = description;
  windElement.innerHTML = `${Math.round(windSpeed)} km/h`;
  timeElement.innerHTML = formatDate(date);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

  getForecast(city);
}

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;
  if (hours < 10) hours = `0${hours}`;

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "4a2o4dfc38a1eb57a0teddf3b6b7f240";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then(displayForecast)
    .catch((error) => {
      console.error("Error fetching forecast:", error);
      alert("Unable to fetch the weather forecast. Please try again later.");
    });
}

function searchCity(city) {
  let apiKey = "4a2o4dfc38a1eb57a0teddf3b6b7f240";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then(refreshWeather)
    .catch((error) => {
      console.error("Error fetching city weather:", error);
      alert("City not found. Please try another city.");
    });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input-form");
  if (searchInput.value.trim()) {
    searchCity(searchInput.value);
  } else {
    alert("Please enter a valid city name!");
  }
}

function displayForecast(response) {
  let forecastHtml = "";
  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>
        <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <strong>${Math.round(day.temperature.maximum)}º</strong> / 
          ${Math.round(day.temperature.minimum)}º
        </div>
      </div>
    `;
    }
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Accra"); // Optional default city
