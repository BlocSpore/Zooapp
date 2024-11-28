// backend/routes/serviceRoutes.js
const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Récupère tous les services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Liste de tous les services
 *       500:
 *         description: Erreur lors de la récupération des services
 */
// Route pour obtenir tous les services
router.get('/', (req, res) => {
  const query = 'SELECT * FROM service';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des services :", err);
      res.status(500).send("Erreur lors de la récupération des services");
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Récupère un service par son ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service à récupérer
 *     responses:
 *       200:
 *         description: Détails du service
 *       404:
 *         description: Service non trouvé
 *       500:
 *         description: Erreur lors de la récupération du service
 */
// Route pour obtenir un service par son ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log("ID reçu :", id); // Log pour vérifier l'ID reçu

  const query = 'SELECT * FROM service WHERE service_id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération du service :", err);
      res.status(500).send("Erreur lors de la récupération du service");
    } else if (result.length === 0) {
      console.log(`Aucun service trouvé avec l'ID : ${id}`); // Log si aucun résultat
      res.status(404).send("Service non trouvé");
    } else {
      res.json(result[0]);
    }
  });
});

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Ajoute un nouveau service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service ajouté avec succès
 *       400:
 *         description: Données manquantes pour l'ajout du service
 *       500:
 *         description: Erreur lors de l'ajout du service
 */
// Route pour ajouter un nouveau service
router.post('/', authenticateToken, authorizeRole([1]), (req, res) => {
  const { nom, description } = req.body;

  console.log("Données reçues :", req.body); // Log pour vérifier les valeurs reçues

  // Vérifier que les valeurs nécessaires sont présentes
  if (!nom || !description) {
    return res.status(400).send("Veuillez fournir nom et description");
  }

  const query = 'INSERT INTO service (nom, description) VALUES (?, ?)';
  const values = [nom, description];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'ajout d'un service :", err);
      res.status(500).send("Erreur lors de l'ajout d'un service");
    } else {
      res.status(201).json({ message: "Service ajouté avec succès", serviceId: results.insertId });
    }
  });
});

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Modifie un service existant
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service modifié avec succès
 *       400:
 *         description: Données manquantes pour la modification du service
 *       404:
 *         description: Service non trouvé
 *       500:
 *         description: Erreur lors de la modification du service
 */
// Route pour modifier un service
router.put('/:id', authenticateToken, authorizeRole([1]), (req, res) => {
  const { id } = req.params;
  const { nom, description } = req.body;

  // Vérifier que les valeurs nécessaires sont présentes
  if (!nom || !description) {
    return res.status(400).send("Veuillez fournir nom et description");
  }

  const query = 'UPDATE service SET nom = ?, description = ? WHERE service_id = ?';
  const values = [nom, description, id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Erreur lors de la modification du service :", err);
      res.status(500).send("Erreur lors de la modification du service");
    } else if (results.affectedRows === 0) {
      res.status(404).send("Service non trouvé");
    } else {
      res.json({ message: "Service modifié avec succès" });
    }
  });
});

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Supprime un service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du service à supprimer
 *     responses:
 *       200:
 *         description: Service supprimé avec succès
 *       404:
 *         description: Service non trouvé
 *       500:
 *         description: Erreur lors de la suppression du service
 */
// Route pour supprimer un service
router.delete('/:id', authenticateToken, authorizeRole([1]), (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM service WHERE service_id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression du service :", err);
      res.status(500).send("Erreur lors de la suppression du service");
    } else if (results.affectedRows === 0) {
      res.status(404).send("Service non trouvé");
    } else {
      res.json({ message: "Service supprimé avec succès" });
    }
  });
});

module.exports = router;
