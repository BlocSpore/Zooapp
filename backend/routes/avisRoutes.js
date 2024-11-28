const express = require("express");
const db = require("../config/db");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/avis:
 *   get:
 *     summary: Récupère tous les avis
 *     tags: [Avis]
 *     responses:
 *       200:
 *         description: Liste de tous les avis
 *       500:
 *         description: Erreur lors de la récupération des avis
 */
// Route pour obtenir tous les avis
router.get("/", (req, res) => {
  const query = "SELECT * FROM avis";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des avis :", err);
      res.status(500).send("Erreur lors de la récupération des avis");
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /api/avis/{id}:
 *   get:
 *     summary: Récupère un avis par son ID
 *     tags: [Avis]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis à récupérer
 *     responses:
 *       200:
 *         description: Avis correspondant à l'ID fourni
 *       404:
 *         description: Avis non trouvé
 *       500:
 *         description: Erreur lors de la récupération de l'avis
 */
// Route pour obtenir un avis par son ID
router.get("/:id", (req, res) => {
  console.log("ID reçu pour récupération :", req.params.id);
  const { id } = req.params;
  const query = "SELECT * FROM avis WHERE avis_id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'avis :", err);
      res.status(500).send("Erreur lors de la récupération de l'avis");
    } else if (result.length === 0) {
      res.status(404).send("Avis non trouvé");
    } else {
      res.json(result[0]);
    }
  });
});

/**
 * @swagger
 * /api/avis:
 *   post:
 *     summary: Ajoute un nouvel avis
 *     tags: [Avis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo:
 *                 type: string
 *               commentaire:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avis ajouté avec succès
 *       400:
 *         description: Données manquantes pour l'ajout de l'avis
 *       500:
 *         description: Erreur lors de l'ajout d'un avis
 */
// Route pour ajouter un nouvel avis
router.post("/", (req, res) => {
  console.log("Requête reçue pour ajout d'un avis :", req.body);
  const { pseudo, commentaire } = req.body;

  console.log("Données reçues :", req.body);

  if (!pseudo || !commentaire) {
    return res.status(400).send("Veuillez fournir un pseudo et un commentaire");
  }

  if (pseudo.trim() === "") {
    return res.status(400).send("Le pseudo ne peut pas être vide");
  }

  const query = "INSERT INTO avis (pseudo, commentaire, is_validated) VALUES (?, ?, 0)";
  const values = [pseudo, commentaire];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout d'un avis :", err);
      res.status(500).send("Erreur lors de l'ajout d'un avis");
    } else {
      res.status(201).json({ message: "Avis ajouté avec succès", avisId: results.insertId });
    }
  });
});

/**
 * @swagger
 * /api/avis/valider/{id}:
 *   put:
 *     summary: Valide ou invalide un avis
 *     tags: [Avis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis à valider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valide:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Avis validé ou non validé avec succès
 *       400:
 *         description: Données manquantes pour la validation de l'avis
 *       404:
 *         description: Avis non trouvé
 *       500:
 *         description: Erreur lors de la validation de l'avis
 */
// Route pour valider un avis
router.put("/valider/:id", authenticateToken, authorizeRole([1]), (req, res) => {
  console.log("ID reçu pour validation :", req.params.id);
  console.log("Données de validation reçues :", req.body);
  const { id } = req.params;
  const { valide } = req.body;

  if (typeof valide === "undefined") {
    return res.status(400).send("Veuillez fournir une valeur de validation (valide)");
  }

  const query = "UPDATE avis SET is_validated = ? WHERE avis_id = ?";
  const values = [valide, id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Erreur lors de la validation de l'avis :", err);
      res.status(500).send("Erreur lors de la validation de l'avis");
    } else if (results.affectedRows === 0) {
      res.status(404).send("Avis non trouvé");
    } else {
      res.json({ message: `Avis ${valide ? "validé" : "non validé"} avec succès` });
    }
  });
});

/**
 * @swagger
 * /api/avis/{id}:
 *   put:
 *     summary: Modifie un avis existant
 *     tags: [Avis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentaire:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avis modifié avec succès
 *       400:
 *         description: Données manquantes pour la modification de l'avis
 *       404:
 *         description: Avis non trouvé
 *       500:
 *         description: Erreur lors de la modification de l'avis
 */
// Route pour modifier un avis
router.put("/:id", authenticateToken, (req, res) => {
  console.log("ID reçu pour modification :", req.params.id);
  console.log("Nouvelles données reçues :", req.body);

  const { id } = req.params;
  const { commentaire } = req.body;

  if (!commentaire) {
    return res.status(400).send("Veuillez fournir un commentaire");
  }

  const query = "UPDATE avis SET commentaire = ? WHERE avis_id = ?";
  const values = [commentaire, id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Erreur lors de la modification de l'avis :", err);
      res.status(500).send("Erreur lors de la modification de l'avis");
    } else if (results.affectedRows === 0) {
      res.status(404).send("Avis non trouvé");
    } else {
      res.json({ message: "Avis modifié avec succès" });
    }
  });
});

module.exports = router;
