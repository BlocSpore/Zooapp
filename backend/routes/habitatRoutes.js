const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/habitats:
 *   get:
 *     summary: Récupère tous les habitats
 *     tags: [Habitats]
 *     responses:
 *       200:
 *         description: Liste de tous les habitats
 *       500:
 *         description: Erreur lors de la récupération des habitats
 */
// Route pour obtenir tous les habitats
router.get('/', (req, res) => {
  const query = 'SELECT * FROM habitat';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des habitats :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des habitats' });
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /api/habitats/{id}:
 *   get:
 *     summary: Récupère un habitat par son ID
 *     tags: [Habitats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'habitat à récupérer
 *     responses:
 *       200:
 *         description: Habitat correspondant à l'ID fourni
 *       404:
 *         description: Habitat non trouvé
 *       500:
 *         description: Erreur lors de la récupération de l'habitat
 */
// Route pour obtenir un habitat par son ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM habitat WHERE habitat_id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'habitat :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'habitat' });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'Habitat non trouvé' });
    } else {
      res.json(result[0]);
    }
  });
});

/**
 * @swagger
 * /api/habitats:
 *   post:
 *     summary: Ajoute un nouvel habitat
 *     tags: [Habitats]
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
 *               commentaire_habitat:
 *                 type: string
 *     responses:
 *       201:
 *         description: Habitat ajouté avec succès
 *       500:
 *         description: Erreur lors de l'ajout de l'habitat
 */
// Route pour ajouter un nouvel habitat
router.post('/', authenticateToken, authorizeRole([1]), (req, res) => {
  const { nom, description, commentaire_habitat } = req.body;

  const query = 'INSERT INTO habitat (nom, description, commentaire_habitat) VALUES (?, ?, ?)';
  const values = [nom, description, commentaire_habitat];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout d\'un habitat :', err);
      res.status(500).json({ error: 'Erreur lors de l\'ajout d\'un habitat' });
    } else {
      res.status(201).json({ message: 'Habitat ajouté avec succès', habitatId: results.insertId });
    }
  });
});

/**
 * @swagger
 * /api/habitats/{id}:
 *   put:
 *     summary: Modifie un habitat existant
 *     tags: [Habitats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'habitat à modifier
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
 *               commentaire_habitat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Habitat modifié avec succès
 *       404:
 *         description: Habitat non trouvé
 *       500:
 *         description: Erreur lors de la modification de l'habitat
 */
// Route pour modifier un habitat
router.put('/:id', authenticateToken, authorizeRole([1]), (req, res) => {
  const { id } = req.params;
  const { nom, description, commentaire_habitat } = req.body;

  const query = 'UPDATE habitat SET nom = ?, description = ?, commentaire_habitat = ? WHERE habitat_id = ?';
  const values = [nom, description, commentaire_habitat, id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erreur lors de la modification de l\'habitat :', err);
      res.status(500).json({ error: 'Erreur lors de la modification de l\'habitat' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Habitat non trouvé' });
    } else {
      res.json({ message: 'Habitat modifié avec succès' });
    }
  });
});

/**
 * @swagger
 * /api/habitats/{id}:
 *   delete:
 *     summary: Supprime un habitat
 *     tags: [Habitats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'habitat à supprimer
 *     responses:
 *       200:
 *         description: Habitat supprimé avec succès
 *       404:
 *         description: Habitat non trouvé
 *       500:
 *         description: Erreur lors de la suppression de l'habitat
 */
// Route pour supprimer un habitat
router.delete('/:id', authenticateToken, authorizeRole([1]), (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM habitat WHERE habitat_id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'habitat :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'habitat' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Habitat non trouvé' });
    } else {
      res.json({ message: 'Habitat supprimé avec succès' });
    }
  });
});

module.exports = router;
