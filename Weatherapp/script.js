const API_KEY = '2f82ab00abae9cdf0bc1f2770f5cd3de'; // Avoid exposing API keys in client-side code.
const fetchWeatherButton = document.getElementById('fetch-weather');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');

fetchWeatherButton.addEventListener('click', async () => {
  const city = cityInput.value.trim();
  if (!city) {
    weatherResult.innerHTML = '<p>Please enter a city name.</p>';
    return;
  }

  weatherResult.innerHTML = '<p>Loading...</p>';
  fetchWeatherButton.disabled = true; // Disable button to prevent multiple clicks

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Set a 10-second timeout

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId); // Clear timeout if the request completes

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || 'Something went wrong. Please try again.';
      throw new Error(errorMessage);
    }

    const data = await response.json();

    weatherResult.innerHTML = `
      <p><strong>City:</strong> ${data.name}</p>
      <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
      <p><strong>Weather:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    `;
  } catch (error) {
    if (error.name === 'AbortError') {
      weatherResult.innerHTML = '<p>Error: Request timed out. Please try again.</p>';
    } else {
      weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  } finally {
    fetchWeatherButton.disabled = false; // Re-enable button after request
  }
});
