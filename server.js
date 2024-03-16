'use strict';

const express = require('express');
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');

const xlsx = require('node-xlsx');
const fs = require('fs');
const Film = require('./model/film');
const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost:27017/cinematheque')
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.log("Connexion à MongoDB échouée !", err));

//Lien à MongoDB, et update

app.get('/', async (req, res) => {
    try{
        const films = await Film.find();
        res.render('index', { films: films });
    }
    catch(err){
        console.log("Erreur lors de la récupération des données : " + err);
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

app.post('/', async (req, res) => {
    let film = await Film.deleteMany(); // on supprime tous les documents de la collection pour update

    const filmXlsx = await xlsx.parse('assets/table/film.xlsx'); // on récupère le fichier excel
    const filmData = filmXlsx[0].data; // on récupère les données du fichier excel
    let filmStock = new Film(); // On va mettre en place un stock pour les films ayant plusieurs réalisateurs
    for await (const data of filmData) {
        if (data[0] !== 'Id'){ // on ignore la première ligne du fichier excel
            let currentFilm = new Film({
                id: data[0],
                titre: data[1],
                titre_original: data[2],
                realisateur: data[3],
                annee: data[4],
                nationalite: data[5],
                duree: data[6],
                genre: data[7],
                synopsis: data[8]
            });
            // FILTERS //
            // on enlève les balises html
            currentFilm.synopsis = currentFilm.synopsis.replace(/<[^>]*>?/gm, '');
            // Si le titre est le même, c'est que le film a plusieurs réalisateurs
            if (currentFilm.titre === filmStock.titre) {
                currentFilm.realisateur = filmStock.realisateur + ', ' + currentFilm.realisateur;
                currentFilm.id = filmStock.id;
            // END OF FILTERS //
            } else {
                filmStock.save();
            }
            // on met à jour le film courant
            filmStock = currentFilm;
        }
    };
    console.log("MàJ Done !");
    res.redirect('/');
});

app.listen(2024, () => {
    console.log('Serveur lancé sur le port 2024');
})