const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/animaux:
 *   get:
 *     summary: Récupère tous les animaux
 *     tags: [Animaux]
 *     responses:
 *       200:
 *         description: Liste de tous les animaux
 *       500:
 *         description: Erreur lors de la récupération des animaux
 */
// Route pour obtenir tous les animaux
router.get('/', (req, res) => {
  const query = 'SELECT * FROM animal';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des animaux :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des animaux' });
    } else {
      res.json(results);
    }
  });
});

/**
 * @swagger
 * /api/animaux/{id}:
 *   get:
 *     summary: Récupère un animal par son ID
 *     tags: [Animaux]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'animal à récupérer
 *     responses:
 *       200:
 *         description: Animal correspondant à l'ID fourni
 *       404:
 *         description: Animal non trouvé
 *       500:
 *         description: Erreur lors de la récupération de l'animal
 */
// Route pour obtenir un animal par son ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM animal WHERE animal_id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'animal :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'animal' });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'Animal non trouvé' });
    } else {
      res.json(result[0]);
    }
  });
});

/**
 * @swagger
 * /api/animaux:
 *   post:
 *     summary: Ajoute un nouvel animal
 *     tags: [Animaux]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               etat:
 *                 type: string
 *               race_id:
 *                 type: integer
 *               habitat_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Animal ajouté avec succès
 *       500:
 *         description: Erreur lors de l'ajout d'un nouvel animal
 */
// Route pour ajouter un nouvel animal
router.post('/', authenticateToken, authorizeRole([1]), (req, res) => {
  const { prenom, nom, description, etat, race_id, habitat_id } = req.body;

  const query = 'INSERT INTO animal (prenom, nom, description, etat, race_id, habitat_id) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [prenom, nom, description, etat, race_id, habitat_id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'ajout d\'un nouvel animal :', err);
      res.status(500).json({ error: 'Erreur lors de l\'ajout d\'un nouvel animal' });
    } else {
      res.status(201).json({ message: 'Animal ajouté avec succès', animalId: results.insertId });
    }
  });
});

/**
 * @swagger
 * /api/animaux/{id}:
 *   put:
 *     summary: Modifie un animal existant
 *     tags: [Animaux]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'animal à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               etat:
 *                 type: string
 *               race_id:
 *                 type: integer
 *               habitat_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Animal modifié avec succès
 *       404:
 *         description: Animal non trouvé
 *       500:
 *         description: Erreur lors de la modification de l'animal
 */
// Route pour modifier un animal
router.put('/:id', authenticateToken, authorizeRole([1, 2]), (req, res) => {
  const { id } = req.params;
  const { prenom, nom, description, etat, race_id, habitat_id } = req.body;

  const query = 'UPDATE animal SET prenom = ?, nom = ?, description = ?, etat = ?, race_id = ?, habitat_id = ? WHERE animal_id = ?';
  const values = [prenom, nom, description, etat, race_id, habitat_id, id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Erreur lors de la modification de l\'animal :', err);
      res.status(500).json({ error: 'Erreur lors de la modification de l\'animal' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Animal non trouvé' });
    } else {
      res.json({ message: 'Animal modifié avec succès' });
    }
  });
});

/**
 * @swagger
 * /api/animaux/{id}:
 *   delete:
 *     summary: Supprime un animal
 *     tags: [Animaux]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'animal à supprimer
 *     responses:
 *       200:
 *         description: Animal supprimé avec succès
 *       404:
 *         description: Animal non trouvé
 *       500:
 *         description: Erreur lors de la suppression de l'animal
 */
// Route pour supprimer un animal
router.delete('/:id', authenticateToken, authorizeRole([1]), (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM animal WHERE animal_id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'animal :', err);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'animal' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Animal non trouvé' });
    } else {
      res.json({ message: 'Animal supprimé avec succès' });
    }
  });
});

/**
 * @swagger
 * /api/animaux/{id}/click:
 *   post:
 *     summary: Incrémente le compteur de clics pour un animal
 *     tags: [Animaux]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'animal dont le compteur doit être incrémenté
 *     responses:
 *       200:
 *         description: Compteur incrémenté avec succès
 *       404:
 *         description: Animal non trouvé
 *       500:
 *         description: Erreur serveur
 */
// Route pour incrémenter le compteur de clics
router.post('/:id/click', (req, res) => {
  const { id } = req.params;

  const query = 'UPDATE animal SET click_count = click_count + 1 WHERE animal_id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'incrémentation du compteur :', err);
      res.status(500).json({ error: 'Erreur lors de l\'incrémentation du compteur' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Animal non trouvé' });
    } else {
      res.json({ message: 'Compteur incrémenté avec succès' });
    }
  });
});

/**
 * @swagger
 * /api/animaux/populaires:
 *   get:
 *     summary: Récupère les animaux les plus populaires
 *     tags: [Animaux]
 *     responses:
 *       200:
 *         description: Liste des animaux populaires
 *       500:
 *         description: Erreur lors de la récupération des animaux populaires
 */
// Route pour récupérer les animaux les plus populaires
router.get('/populaires', (req, res) => {
  const query = 'SELECT * FROM animal ORDER BY click_count DESC LIMIT 10';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des animaux populaires :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des animaux populaires' });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
