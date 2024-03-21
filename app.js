'use strict';

const express = require('express');
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');

const xlsx = require('node-xlsx');
const fs = require('fs');
const Film = require('./model/film');
const mongoose = require('mongoose');
const path = 'assets/table/film.xlsx';

// Lien à MongoDB
mongoose
    .connect('mongodb://localhost:27017/cinematheque')
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.log("Connexion à MongoDB échouée !", err));

// Routes
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

const handleUpdate = async () => {
    let film = await Film.deleteMany(); // on supprime tous les documents de la collection pour update

    const filmXlsx = xlsx.parse(path); // on récupère le fichier excel
    const filmData = filmXlsx[0].data; // on récupère les données du fichier excel
    let filmStock = new Film(); // On va mettre en place un stock pour les films ayant plusieurs réalisateurs
    let id = 1; // on initialise l'id à 1. On va l'incrémenter à chaque film, sauf si le film a plusieurs réalisateurs
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
            // --- FILTERS --- //
            // on enlève les balises html
            currentFilm.synopsis = currentFilm.synopsis.replace(/<[^>]*>?/gm, '');
            if (currentFilm.titre === filmStock.titre) { // Si le titre est le même que le film d'avant, c'est que le film a plusieurs réalisateurs. On va alors mettre à jour le film d'avant.
                currentFilm.realisateur = filmStock.realisateur + ', ' + currentFilm.realisateur; // on met à jour les réalisateurs
                currentFilm.id = filmStock.id; // on met à jour l'id
            // --- END OF FILTERS --- //
            } else {
                currentFilm.id = id; // on met à jour l'id
                id++; // on incrémente l'id
                if(currentFilm.id !== 1){ // on ne sauvegarde pas le premier film (qui est vide)
                    filmStock.save();
                }
            }
            // on met à jour le film courant
            filmStock = currentFilm;
        }
    };
};

if (fs.existsSync(path)) {
    fs.watchFile(path, async () => { // watchFile est instable, à surveiller
        await handleUpdate();
        console.log("MàJ Done !");
    });
}

// MàJ de la base de données
app.post('/', async (req, res) => {
    await handleUpdate();
    console.log("MàJ manuelle Done !");
    res.redirect('/');
});

app.listen(2024, () => {
    console.log('Serveur lancé sur le port 2024');
})