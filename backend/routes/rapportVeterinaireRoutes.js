const express = require("express");
const db = require("../config/db");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/rapports-veterinaires:
 *   get:
 *     summary: Récupère tous les rapports vétérinaires
 *     tags: [Rapports Vétérinaires]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les rapports vétérinaires
 *       500:
 *         description: Erreur lors de la récupération des rapports vétérinaires
 */
// Route pour lister tous les rapports vétérinaires
router.get("/", authenticateToken, authorizeRole([1, 2]), (req, res) => {
  console.log("Requête reçue pour récupération de tous les rapports vétérinaires");
  const query = "SELECT * FROM soins_vétérinaires";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des rapports vétérinaires :", err);
      res.status(500).send("Erreur lors de la récupération des rapports vétérinaires");
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /api/rapports-veterinaires:
 *   post:
 *     summary: Ajoute un nouveau rapport vétérinaire
 *     tags: [Rapports Vétérinaires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               animal_id:
 *                 type: integer
 *               etat:
 *                 type: string
 *               commentaire:
 *                 type: string
 *               date_passage:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Rapport vétérinaire ajouté avec succès
 *       400:
 *         description: Données manquantes pour l'ajout du rapport vétérinaire
 *       500:
 *         description: Erreur lors de l'ajout d'un rapport vétérinaire
 */
// Route pour ajouter un nouveau rapport vétérinaire (accessible uniquement par les vétérinaires)
router.post("/", authenticateToken, authorizeRole([2]), (req, res) => {
  console.log("Requête reçue pour ajout d'un rapport vétérinaire :", req.body);
  const { animal_id, etat, commentaire, date_passage } = req.body;

  // Vérifier que toutes les valeurs nécessaires sont présentes
  if (!animal_id || !etat || !date_passage) {
    console.error("Données manquantes pour l'ajout du rapport vétérinaire");
    return res.status(400).send("Veuillez fournir l'animal_id, l'état, et la date de passage");
  }

  const query = "INSERT INTO soins_vétérinaires (animal_id, etat, commentaire, date_passage) VALUES (?, ?, ?, ?)";
  const values = [animal_id, etat, commentaire, date_passage];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout d'un rapport vétérinaire :", err);
      res.status(500).send("Erreur lors de l'ajout d'un rapport vétérinaire");
    } else {
      console.log("Rapport vétérinaire ajouté avec succès, ID :", results.insertId);
      res.status(201).json({ message: "Rapport vétérinaire ajouté avec succès", rapportId: results.insertId });
    }
  });
});

/**
 * @swagger
 * /api/rapports-veterinaires/{id}:
 *   put:
 *     summary: Modifie un rapport vétérinaire existant
 *     tags: [Rapports Vétérinaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rapport vétérinaire à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               etat:
 *                 type: string
 *               commentaire:
 *                 type: string
 *               date_passage:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Rapport vétérinaire modifié avec succès
 *       400:
 *         description: Données manquantes pour la modification du rapport vétérinaire
 *       404:
 *         description: Rapport vétérinaire non trouvé
 *       500:
 *         description: Erreur lors de la modification du rapport vétérinaire
 */
// Route pour modifier un rapport vétérinaire existant (accessible uniquement par les vétérinaires)
router.put("/:id", authenticateToken, authorizeRole([2]), (req, res) => {
  console.log("ID reçu pour modification :", req.params.id);
  console.log("Nouvelles données reçues :", req.body);
  const { id } = req.params;
  const { etat, commentaire, date_passage } = req.body;

  // Vérifier que les valeurs nécessaires sont présentes
  if (!etat || !date_passage) {
    console.error("Données manquantes pour la modification du rapport vétérinaire");
    return res.status(400).send("Veuillez fournir l'état et la date de passage");
  }

  const query = "UPDATE soins_vétérinaires SET etat = ?, commentaire = ?, date_passage = ? WHERE soins_id = ?";
  const values = [etat, commentaire, date_passage, id];

  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de la modification du rapport vétérinaire. Veuillez réessayer plus tard." });
    } else if (results.affectedRows === 0) {
      console.log("Aucun rapport vétérinaire trouvé avec l'ID :", id);
      res.status(404).send("Rapport vétérinaire non trouvé");
    } else {
      console.log("Rapport vétérinaire modifié avec succès, ID :", id);
      res.json({ message: "Rapport vétérinaire modifié avec succès" });
    }
  });
});

/**
 * @swagger
 * /api/rapports-veterinaires/{id}:
 *   delete:
 *     summary: Supprime un rapport vétérinaire
 *     tags: [Rapports Vétérinaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rapport vétérinaire à supprimer
 *     responses:
 *       200:
 *         description: Rapport vétérinaire supprimé avec succès
 *       404:
 *         description: Rapport vétérinaire non trouvé
 *       500:
 *         description: Erreur lors de la suppression du rapport vétérinaire
 */
// Route pour supprimer un rapport vétérinaire
router.delete("/:id", authenticateToken, authorizeRole([1]), (req, res) => {
  console.log("Requête reçue pour suppression du rapport vétérinaire avec ID :", req.params.id);
  const { id } = req.params;

  const query = "DELETE FROM soins_vétérinaires WHERE soins_id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression du rapport vétérinaire :", err);
      res.status(500).send("Erreur lors de la suppression du rapport vétérinaire");
    } else if (results.affectedRows === 0) {
      console.log("Aucun rapport vétérinaire trouvé avec l'ID :", id);
      res.status(404).send("Rapport vétérinaire non trouvé");
    } else {
      console.log("Rapport vétérinaire supprimé avec succès, ID :", id);
      res.json({ message: "Rapport vétérinaire supprimé avec succès" });
    }
  });
});

module.exports = router;
