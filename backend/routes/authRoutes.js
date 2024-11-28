// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur (uniquement par l'administrateur)
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *               role_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès
 *       400:
 *         description: Rôle invalide ou email déjà utilisé
 *       500:
 *         description: Erreur interne du serveur
 */
// Route pour l'inscription d'un nouvel utilisateur (uniquement par l'administrateur)
router.post('/register', authenticateToken, authorizeRole([1]), async (req, res) => {
  const { email, mot_de_passe, role_id } = req.body;

  // Vérifier si le rôle est valide et autorisé (uniquement vétérinaire ou employé)
  const validRoles = [2, 3]; // 2 = Vétérinaire, 3 = Employé
  if (!validRoles.includes(role_id)) {
    return res.status(400).json({ error: 'Rôle invalide ou non autorisé pour l\'inscription' });
  }

  try {
    // Vérifier si l'email existe déjà
    const emailQuery = 'SELECT * FROM utilisateur WHERE email = ?';
    db.query(emailQuery, [email], async (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification de l\'email :', err);
        return res.status(500).json({ error: 'Erreur interne du serveur lors de la vérification de l\'email' });
      }

      if (results.length > 0) {
        // Si l'email existe déjà, renvoyer une erreur
        return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

      // Insérer le nouvel utilisateur
      const query = 'INSERT INTO utilisateur (email, mot_de_passe, role_id) VALUES (?, ?, ?)';
      const values = [email, hashedPassword, role_id];

      db.query(query, values, (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'inscription d\'un utilisateur :', err);
          return res.status(500).json({ error: 'Erreur lors de l\'inscription d\'un utilisateur' });
        }
        res.status(201).json({ message: 'Utilisateur enregistré avec succès', userId: results.insertId });
      });
    });
  } catch (err) {
    console.error('Erreur lors du hachage du mot de passe :', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès, retourne un token
 *       401:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur interne du serveur
 */
// Route pour la connexion d'un utilisateur
router.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;

  const query = 'SELECT * FROM utilisateur WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la connexion :', err);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    } else {
      const user = results[0];
      const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

      if (!validPassword) {
        res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      } else {
        const token = jwt.sign(
          { userId: user.utilisateur_id, role: user.role_id },
          process.env.JWT_SECRET || 'souris', // Remplacez par une clé secrète plus sécurisée dans un fichier d'environnement
          { expiresIn: '1h' }
        );
        res.json({ token });
      }
    }
  });
});

module.exports = router;
