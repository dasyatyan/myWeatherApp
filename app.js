// Подключение необходимых модулей и библиотек
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

//=======================
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

//=========================

// Роут для получения данных о погоде
app.get('/weather', async (req, res) => {
    try {
        const apiKey = '88f733381150b5b84cc91c913476c4b9';
        const city = req.query.city; // Получение города из запроса
        const weatherData = await getWeatherData(apiKey, city);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Роут для получения данных о геолокации и карт
// Добавьте обработку для интеграции с картами и геолокацией
app.get('/airquality', async (req, res) => {
    try {
        const apiKey = '385503ccf9ef4f5582ad1c727e7936bc'; // Weatherbit API key
        const { lat, lon } = req.query;
        const airQualityData = await getAirQualityData(apiKey, lat, lon);
        res.json(airQualityData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/apod', async (req, res) => {
    try {
        const apiKey = 'tnInpiOG1zFmVhyHO3bYyJEZKyxCPZXDox3uZbMH';
        const date = req.query.date || 'today'; // Get the date parameter from the request, default to 'today'
        const apodData = await getAPODData(apiKey, date);
        res.json(apodData);
    } catch (error) {
        console.error('Error in /apod route:', error); // Log the detailed error

        if (error.response) {
            console.error('API Response Data:', error.response.data);
            console.error('API Response Status:', error.response.status);
            console.error('API Response Headers:', error.response.headers);
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Запуск сервера на порту 3000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Функция для получения данных о погоде от OpenWeatherAPI
async function getWeatherData(apiKey, city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await axios.get(weatherUrl);
    const weatherData = response.data;

    const rainVolume = weatherData.rain && weatherData.rain['3h'] ? weatherData.rain['3h'] : 0;

    return {
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        coordinates: {
            lat: weatherData.coord.lat,
            lon: weatherData.coord.lon
        },
        feelsLike: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        windSpeed: weatherData.wind.speed,
        countryCode: weatherData.sys.country,
        rainVolume: rainVolume, // Corrected rainVolume calculation
        // Add other necessary weather data
    };
}

async function getAirQualityData(apiKey, lat, lon) {
    const airQualityUrl = `https://api.weatherbit.io/v2.0/current/airquality?lat=${lat}&lon=${lon}&key=${apiKey}`;
    const response = await axios.get(airQualityUrl);
    const airQualityData = response.data.data[0]; // Assuming you want the data for the first result

    return {
        aqi: airQualityData.aqi,
        pm25: airQualityData.pm25,
        pm10: airQualityData.pm10,
        co: airQualityData.co,
        so2: airQualityData.so2,
        no2: airQualityData.no2,
        o3: airQualityData.o3,
    };
}


async function getAPODData(apiKey, date) {
    const apodUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;
    const response = await axios.get(apodUrl);
    const apodData = response.data;

    

    return {
        title: apodData.title,
        date: apodData.date,
        explanation: apodData.explanation,
        hdurl: apodData.hdurl,
        // Add other necessary APOD data
    };

}
