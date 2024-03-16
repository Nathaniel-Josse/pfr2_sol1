const mongoose = require('mongoose');
const filmSchema = new mongoose.Schema({
    id: Number,
    titre: String,
    titre_original: String,
    realisateur: String,
    annee: Number,
    nationalite: String,
    duree: String,
    genre: String,
    synopsis: String,
});

const Film = mongoose.model('film', filmSchema, "films"); // 3ème paramètre facultatif: nom de la collection qui recevra les objets

module.exports = Film;