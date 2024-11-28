// backend/config/db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "zooapp_user",
  password: "Lapatate.12",
  database: "zoo_arcadia",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
  } else {
    console.log("Connecté à la base de données MySQL");
  }
});

module.exports = db; // Exporte uniquement l'objet connecté
