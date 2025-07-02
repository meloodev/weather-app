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
        body.classList.add('lock');
        modal.classList.add('reveal');
    });

    modalCancel.addEventListener('click', () => {
        body.classList.remove('lock');
        modal.classList.remove('reveal');
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


});