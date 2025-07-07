class WeatherApp {
    _apiKey = "3f9cf34620e14463966140028250507";
    _city = "Batumi";
    _days = 7;

    getResource = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('An error occurred:', error);
            return null;
        }
    }

    getWeather = async (city = this._city) => {
        const res = await this.getResource(`http://api.weatherapi.com/v1/forecast.json?key=${this._apiKey}&q=${city}&days=${this._days}&aqi=no&alerts=no`);
        return this._weatherItems(res);
    }


    _weatherItems = (item) => {
        return {
            location: item.location.name,
            date: new Date(item.location.localtime).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }),
            dateattr: item.location.localtime.split(' ')[0],

            current: {
                tempC: item.current.temp_c,
                tempF: item.current.temp_f,
                feelsLike: item.current.feelslike_c,
                condition: item.current.condition.text,
                icon: item.current.condition.icon,
                humidityTmp: item.current.humidity,
                windTmp: item.current.wind_kph,
                pressureTmp: item.current.pressure_mb
            },

            forecast: item.forecast.forecastday.map(day => ({
                date: day.date,
                weekday: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
                formattedDate: new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                }),
                maxTemp: day.day.maxtemp_c,
                minTemp: day.day.mintemp_c,
                condition: day.day.condition.text,
                icon: day.day.condition.icon
            }))

        }
    }

    humidityStatus = (value) => {
        switch (true) {
            case (value <= 30):
                return "Dry";
            case (value <= 60):
                return "Comfortable";
            case (value <= 80):
                return "Humid";
            default:
                return "Very Humid";
        }
    }

    windStatus = (kph) => {
        switch (true) {
            case (kph <= 5):
                return "Calm";
            case (kph <= 19):
                return "Moderate";
            case (kph <= 38):
                return "Fresh";
            case (kph <= 61):
                return "Strong";
            case (kph <= 88):
                return "Gale";
            default:
                return "Storm";
        }
    }

    pressureStatus = (hPa) => {
        switch (true) {
            case (hPa < 1000):
                return "Low";
            case (hPa <= 1020):
                return "Normal";
            default:
                return "High";
        }
    }
}

export { WeatherApp };