'use strict';

const xlsx = require('node-xlsx');
const http = require('http');
const fs = require('fs');
const jsdom = require('jsdom');
const JSDOM = jsdom.JSDOM;
//const document = new JSDOM(`../../index.html`).window.document;
const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
const mongoose = require('mongoose');
mongoose
    .connect('mongodb://localhost:27017/pfr')
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.log("Connexion à MongoDB échouée !", err));

let pageUpdate;
try{
    pageUpdate = fs.readFileSync('../../index.html');
} catch(e){
    console.log("Page d'accueil non trouvée : " + e);
}


const film = xlsx.parse('../table/film.xlsx'); // on récupère le fichier excel
//const film = xlsx.parse(fs.readFileSync('../table/film.xlsx'));

const filmData = film[0].data; // on récupère les données du fichier excel
console.log(filmData);

//Lien à MongoDB, et update

app.get('/', async (req, res) => {
    try{
        const livres = await Livre.find();
        res.render('index', { livres: livres });
    }
    catch(err){
        console.log("Erreur lors de la récupération des données : " + err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
});


const serveur = http.createServer((req, res) => {
    if(req.url === '/'){
        res.writeHead(STATUS_OK, {'Content-Type': 'text/html'});
        res.end(pageUpdate);
        /*
        const btn = document.getElementById('btn');

        btn.addEventListener('click', () => {
            const film = xlsx.parse('../table/film.xlsx'); // on récupère le fichier excel
            //const film = xlsx.parse(fs.readFileSync('../table/film.xlsx'));

            const filmData = film[0].data; // on récupère les données du fichier excel
            console.log(filmData);

            //Lien à MongoDB, et update

        });
        */
    } else {
        res.writeHead(STATUS_NOT_FOUND, {'Content-Type': 'text/html'});
        res.end('<h1>Error 404: Page not found</h1>');
    }
})

serveur.listen(2024 , () => {
    console.log('Running on http://localhost:2024');
});