// noinspection DuplicatedCode,HttpUrlsUsage,JSUnresolvedReference

import { weatherConditions } from "../main/core.js";

$(() => {
  const $city = $("#city");
  const $temperature = $("#temperature");
  const $unit = $("#unit");
  const $weatherIcon = $("#weather-icon");
  const $weatherDescription = $("#weather-description");
  const $weatherContainer = $(".weather-container");
  const $datetime = $("#datetime");
  const $humidity = $("#humidity");

  setInterval(updateDateTime, 500);
  fetchWeather();

  function updateDateTime() {
    $datetime.text(new Date().toLocaleString());
  }

  function fetchWeather() {
    $.getJSON("https://ipinfo.io/json", (locationData) => {
      const city = locationData.city;
      const lat = locationData.loc.split(",")[0];
      const lon = locationData.loc.split(",")[1];

      $.ajax({
        url:
          `https://helium-weather.vercel.app/weather?lat=${lat}&lon=${lon}`,
        method: "GET",
        headers: {
          "Version": "Helium/1.0",
        },
        success: (weatherData) => {
          const temperature = Math.round(weatherData.main.temp);
          const humidity = weatherData.main.humidity;
          const weatherCode = weatherData.weather[0].id;
          const { description, iconUrl } = getWeatherConditionDescription(
            weatherCode,
          );
          const unit = "°F";

          $city.text(city);
          $temperature.text(`${temperature}`);
          $unit.text(`${unit}`);
          $weatherIcon.attr("src", iconUrl);
          $weatherDescription.text(description);
          $humidity.text(humidity);

          $weatherContainer.css({ "display": "flex" });
          $weatherDescription.show();
        },
        error: () =>
          alert("Error loading weather data. Please try again later."),
      });
    }).fail(() => alert("Error retrieving location information."));
  }

  function getWeatherConditionDescription(weatherCode) {
    return weatherConditions[weatherCode] ||
      { description: "Unknown weather condition", iconUrl: "" };
  }
});
