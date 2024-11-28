const express = require("express");
const db = require("../config/db");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Routes de test pour vérifier la connectivité et la santé du serveur
 */

/**
 * @swagger
 * /test-db:
 *   get:
 *     summary: Vérifie la connexion à la base de données
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: Succès de la connexion
 *       500:
 *         description: Erreur lors de la connexion
 */
router.get("/test-db", (req, res) => {
  db.query("SHOW TABLES", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la connexion à la base de données");
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Vérifie que l'API est en bonne santé
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: API fonctionnelle
 */
router.get("/health", (req, res) => {
  res.status(200).send("API en bonne santé");
});

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Test simple pour vérifier le fonctionnement du serveur
 *     tags: [Tests]
 *     responses:
 *       200:
 *         description: Serveur fonctionnel
 */
router.get("/test", (req, res) => {
  res.send("Le serveur fonctionne correctement");
});

module.exports = router;
