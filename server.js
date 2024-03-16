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

    const filmXlsx = xlsx.parse('assets/table/film.xlsx'); // on récupère le fichier excel
    const filmData = filmXlsx[0].data; // on récupère les données du fichier excel
    // let filmStock = new Film();
    filmData.forEach(data => {
        console.log(data);
        if (data[0] === 'Id') return;
        let film = new Film({
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
        film.save();
    });

    //Lien à MongoDB, et update
});

app.listen(2024, () => {
    console.log('Serveur lancé sur le port 2024');
})