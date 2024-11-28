const express = require("express");
const db = require("./config/db");
const animalRoutes = require("./routes/animalRoutes");
const habitatRoutes = require("./routes/habitatRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const rapportVeterinaireRoutes = require("./routes/rapportVeterinaireRoutes");
const avisRoutes = require("./routes/avisRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = process.env.PORT || 5001;

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ZooApp API Documentation",
      version: "1.0.0",
      description: "Documentation de l'API pour le projet ZooApp",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Serveur local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Inclut les commentaires Swagger dans vos fichiers de route
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware de sécurité et utilitaires
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Documentation API avec Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Vérification de la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
  } else {
    console.log("Connecté à la base de données MySQL");
  }
});

// Routes API
app.use("/api/animaux", animalRoutes); // Routes pour les animaux
app.use("/api/habitats", habitatRoutes); // Routes pour les habitats
app.use("/api/services", serviceRoutes); // Routes pour les services
app.use("/api/rapports-veterinaires", rapportVeterinaireRoutes); // Routes pour les rapports vétérinaires
app.use("/api/avis", avisRoutes); // Routes pour les avis des visiteurs
app.use("/api/auth", authRoutes); // Routes pour l'authentification

// Routes de test (développement uniquement)
if (process.env.NODE_ENV === "development") {
  const testRoutes = require("./routes/testRoutes");
  app.use("/", testRoutes);
}

// Gestion des routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
  console.log(`Swagger disponible sur http://localhost:${PORT}/api-docs`);
});
