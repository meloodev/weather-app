'use strict';
document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.querySelector('.header__icon-cover.menu');
    const menu = document.querySelector('header .settings');
    const modal = document.querySelector('body .modal');
    const modalCancel = document.querySelector('body .modal .modal__cancel');


    const submenu = document.querySelector('.submenu');
    const darkTheme = document.querySelector('.submenu .dark');
    const lightTheme = document.querySelector('.submenu .light');

    const darkIcon = document.querySelector('.submenu .dark i');
    const lightIcon = document.querySelector('.submenu .light i');

    const body = document.body;

    const weatherSettings = document.querySelector('header .weather__settings');
    const weatherTheme = document.querySelector('header .weather__theme');

    ///////////
    const weatherCity = document.querySelector('.weather__city h2');
    const cityTemp = document.querySelector('h1');
    const feels = document.querySelector('.weather__feels-temp');
    const weatherSky = document.querySelector('.weather__sky');
    const weatherIcon = document.querySelector('.weather__status img');
    const weatherDate = document.querySelector('.weather__status time');


    const humidity = document.querySelector('.details__item-humidity span');
    const wind = document.querySelector('.details__item-wind span');
    const pressure = document.querySelector('.details__item-pressure span');

    const humidityStatusVal = document.querySelector('.details__item-humidity .status');
    const windStatusVal = document.querySelector('.details__item-wind .status');
    const pressureStatusVal = document.querySelector('.details__item-pressure .status');

    ///////////
    const weatherDays = document.querySelector('.weather__daily .weather__days');
    const weatherDailyItems = document.querySelector('.weather__daily .weather__daily-items');
    ///////////

    const weatherLoader = document.querySelector('.weather__loader');

    function loading() {
        weatherLoader.classList.add('show');
    }

    function done() {
        weatherLoader.classList.add('done');
        setTimeout(() => {
            weatherLoader.classList.remove('show');
            weatherLoader.classList.remove('done');
        }, 1100);
    }

    menuBtn.addEventListener('click', () => {
        menu.classList.add('show');
    });

    body.addEventListener('click', (e) => {
        const target = e.target;

        if (!menuBtn.contains(target) && !menu.contains(target)) {
            menu.classList.remove('show');
            submenu.classList.remove('show');
        }
    });


    weatherSettings.addEventListener('click', () => {
        body.classList.add('lock');
        modal.classList.add('reveal');
    });

    modalCancel.addEventListener('click', () => {
        body.classList.remove('lock');
        modal.classList.remove('reveal');
    });

    weatherTheme.addEventListener('click', () => {
        submenu.classList.toggle('show');
    });


    submenu.addEventListener('click', (e) => {
        const target = e.target;
        if (darkTheme.contains(target)) {
            darkIcon.classList.add('fa-check');
            lightIcon.classList.remove('fa-check');
        }

        if (lightTheme.contains(target)) {
            lightIcon.classList.add('fa-check');
            darkIcon.classList.remove('fa-check');
        }
    });

    const apiKey = "3f9cf34620e14463966140028250507";
    const city = "Batumi";
    const days = 7;

    function humidityStatus(value) {
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

    function windStatus(kph) {
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

    function pressureStatus(hPa) {
        switch (true) {
            case (hPa < 1000):
                return "Low";
            case (hPa <= 1020):
                return "Normal";
            default:
                return "High";
        }
    }

    async function getData() {
        loading();
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=no&alerts=no`);

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

    getData().then(data => {
        if (!data) {
            console.log("data not found");
            return;
        }
        done();
        const cleaned = {
            location: data.location.name,
            date: new Date(data.location.localtime).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }),
            dateattr: data.location.localtime.split(' ')[0],

            current: {
                temp: data.current.temp_c,
                feelsLike: data.current.feelslike_c,
                condition: data.current.condition.text,
                icon: data.current.condition.icon,
                humidity: data.current.humidity,
                wind: data.current.wind_kph,
                pressure: data.current.pressure_mb
            },

            forecast: data.forecast.forecastday.map(day => ({
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
        };



        /////////////////////
        weatherCity.textContent = cleaned.location;
        cityTemp.textContent = Math.round(cleaned.current.temp);
        feels.textContent = cleaned.current.feelsLike.toFixed(1);
        weatherSky.textContent = cleaned.current.condition;
        weatherIcon.src = cleaned.current.icon;
        weatherDate.textContent = cleaned.date;
        weatherDate.setAttribute('datetime', cleaned.dateattr);


        humidity.textContent = `${cleaned.current.humidity} %`;
        wind.textContent = `${cleaned.current.wind} km/h`;
        pressure.textContent = `${cleaned.current.pressure} hPa`;
        humidityStatusVal.textContent = humidityStatus(cleaned.current.humidity);
        windStatusVal.textContent = windStatus(cleaned.current.wind);
        pressureStatusVal.textContent = pressureStatus(cleaned.current.pressure);



        weatherDays.textContent = cleaned.forecast.length;

        let weatherItems = '';
        let today = 'Today';
        cleaned.forecast.forEach((item, i) => {
            if (i === 0) {
                item.weekday = today;
            }

            weatherItems += `<div class="weather__daily-item">
                                <div class="weather__daily-day">${item.weekday}</div>
                                <div class="weather__daily-status">
                                    <img src="${item.icon}" alt="status">
                                    <span>${item.condition}</span>
                                </div>
                                <div class="weather__daily-temp">
                                    <img class="weather__temp-direction" src="./img/arrow-down.svg"
                                        alt="temp-direction">
                                    <h4 class="weather__temp-degree">
                                        <span class="degree__temp">${Math.round(item.maxTemp)}</span>
                                        <span>°</span>
                                    </h4>
                                    <h4 class="weather__temp-feels">
                                        <span class="feels__temp">${Math.round(item.minTemp)}</span>
                                        <span>°</span>
                                    </h4>
                                </div>
                            </div>`;
        });

        weatherDailyItems.innerHTML = weatherItems;
        // console.log(weatherItems);
        // console.log(cleaned);
    });


});