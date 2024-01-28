async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value;


    let weatherData;  // Declare the variable outside the try block

    try {
        const response = await fetch(`http://localhost:3000/weather?city=${cityName}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        weatherData = await response.json();  // Assign the value

        const weatherInfo = document.getElementById('weatherInfo');

        var map = L.map('map').setView([weatherData.coordinates.lat, weatherData.coordinates.lon], 10);

        var marker = L.marker([weatherData.coordinates.lat, weatherData.coordinates.lon]).addTo(map);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var circle = L.circle([weatherData.coordinates.lat, weatherData.coordinates.lon], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 10000
        }).addTo(map);

        weatherInfo.innerHTML = `
        <p>Temperature: ${weatherData.temperature-273.15}°C</p>
        <p>Description: ${weatherData.description}</p>
        <p>Coordinates: ${weatherData.coordinates.lat}, ${weatherData.coordinates.lon}</p>
        <p>Feels Like: ${weatherData.feelsLike}</p>
        <p>Humidity: ${weatherData.humidity}%</p>
        <p>Pressure: ${weatherData.pressure} hPa</p>
        <p>Wind Speed: ${weatherData.windSpeed} m/s</p>
        ${weatherData.rainVolume !== null ? `<p>Rain Volume (last 3 hours): ${weatherData.rainVolume} mm</p>` : '<p>Rain Volume (last 3 hours): N/A</p>'}
        <!-- Add other weather data here -->
        `;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        // Handle the error or display an error message to the user
    }

    // Move the second try block outside the first one
    try {
        const response = await fetch(`http://localhost:3000/airquality?lat=${weatherData.coordinates.lat}&lon=${weatherData.coordinates.lon}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const airQualityData = await response.json();

        // Update the UI to display air quality data
        const airQualityInfo = document.getElementById('airQualityInfo');
        airQualityInfo.innerHTML = `
        <p>AIR QUALITY IFORMATION</p>
          <p>AQI: ${airQualityData.aqi}</p>
          <p>PM2.5: ${airQualityData.pm25}</p>
          <p>PM10: ${airQualityData.pm10}</p>
          <p>CO: ${airQualityData.co}</p>
          <p>SO2: ${airQualityData.so2}</p>
          <p>NO2: ${airQualityData.no2}</p>
          <p>O3: ${airQualityData.o3}</p>
        `;
    } catch (error) {
        console.error('Error fetching air quality data:', error.message);
        // Handle the error or display an error message to the user
    }


    try {
        // New request to fetch APOD data
        const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=tnInpiOG1zFmVhyHO3bYyJEZKyxCPZXDox3uZbMH&date=${today}`;
    
    const response = await axios.get(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const apodData = await response.json();

        // Update the UI to display APOD data
        const apodInfo = document.getElementById('apodInfo');
        apodInfo.innerHTML = `
            <h2>${apodData.title}</h2>
            <p>Date: ${apodData.date}</p>
            <p>${apodData.explanation}</p>
            <img src="${apodData.hdurl}" alt="APOD Image">
            <!-- Add other APOD data here -->
        `;
    } catch (error) {
        console.error('Error fetching APOD data:', error.message);
        // Handle the error or display an error message to the user
    }
    const container = document.getElementById('cont');
    container.style.display = 'block';
}
