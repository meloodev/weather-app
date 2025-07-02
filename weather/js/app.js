'use strict';
document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.querySelector('.header__icon-cover.menu');
    const menu = document.querySelector('header .settings');

    const body = document.body;

    const weatherSettings = document.querySelector('header .weather__settings');

    menuBtn.addEventListener('click', () => {
        menu.classList.toggle('show');
    });

    body.addEventListener('click', (e) => {
        const target = e.target;

        if (!menuBtn.contains(target) && !menu.contains(target)) {
            menu.classList.remove('show');
        }
    });


    weatherSettings.addEventListener('click', () => {
        console.log('settings');
    });




});