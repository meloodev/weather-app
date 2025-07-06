'use strict';
import { WeatherApp } from "../service/weatherServices.js";
document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();


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



    async function renderWeather(city = 'batumi') {
        loading();
        // app.getWeather().then(cleaned => {
        const cleaned = await app.getWeather(city);
        if (!cleaned) {
            console.log("data not found");
            done();
            return;
        }

        try {
            console.log(cleaned);
            const { humidityStatus, windStatus, pressureStatus } = app;
            const { temp, feelsLike, condition, icon, humidityTmp, windTmp, pressureTmp } = cleaned.current;

            /////////////////////
            weatherCity.textContent = cleaned.location;
            cityTemp.textContent = Math.round(temp);
            feels.textContent = feelsLike.toFixed(1);
            weatherSky.textContent = condition;
            weatherIcon.src = icon.replace('//', 'https://');
            weatherDate.textContent = cleaned.date;
            weatherDate.setAttribute('datetime', cleaned.dateattr);



            humidity.textContent = `${humidityTmp} %`;
            wind.textContent = `${windTmp} km/h`;
            pressure.textContent = `${pressureTmp} hPa`;
            humidityStatusVal.textContent = humidityStatus(humidityTmp);
            windStatusVal.textContent = windStatus(windTmp);
            pressureStatusVal.textContent = pressureStatus(pressureTmp);



            weatherDays.textContent = cleaned.forecast.length;

            let today = 'Today';
            const weatherItems = cleaned.forecast.map((item, i) => {
                if (i === 0) {
                    item.weekday = today;
                }

                return `<div class="weather__daily-item">
                                <div class="weather__daily-day">${item.weekday}</div>
                                <div class="weather__daily-status">
                                    <img src="${item.icon.replace('//', 'https://')}" alt="status">
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
            }).join('');

            weatherDailyItems.innerHTML = weatherItems;

        } catch (error) {
            console.error('Error processing weather data:', error);
        } finally {
            done();
        }
    };

    renderWeather();
});