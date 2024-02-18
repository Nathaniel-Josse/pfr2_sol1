'use strict';

const fs = require('fs');
const xlsx = require('node-xlsx');
const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    const film = xlsx.parse('../table/film.xlsx'); // on récupère le fichier excel
    //const film = xlsx.parse(fs.readFileSync('../table/film.xlsx'));

    const filmData = film[0].data; // on récupère les données du fichier excel
    console.log(filmData);
});
