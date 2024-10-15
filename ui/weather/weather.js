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
        url: `https://purrooser-weather.vercel.app/weather?lat=${lat}&lon=${lon}`,
        method: "GET",
        headers: {
          "Version": "Purrooser/1.0",
        },
        success: (weatherData) => {
          const temperature = Math.round(weatherData.main.temp);
          const weatherCode = weatherData.weather[0].id;
          const { description, iconUrl } = getWeatherConditionDescription(weatherCode);
          const unit = "°F";

          $city.text(city);
          $temperature.text(`${temperature}`);
          $unit.text(`${unit}`);
          $weatherIcon.attr("src", iconUrl);
          $weatherDescription.text(description);

          $weatherContainer.css({ "display": "flex" });
          $weatherDescription.show();
        },
        error: () => alert("Error loading weather"),
      });
    }).fail(() => alert("Error getting IP"));
  }

  function getWeatherConditionDescription(weatherCode) {
    return weatherConditions[weatherCode] || { description: "Unknown weather condition", iconUrl: "" };
  }
});