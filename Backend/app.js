const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config(); // Charger les variables d'environnement à partir de .env

// Importer les routes
const userRoutes = require("./routes/user");
const projectsRoutes = require("./routes/projects");

// Créez l'application Express
const app = express();

// Créez une connexion à la base de données MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Établissez la connexion à MySQL
db.connect((err) => {
  if (err) {
    console.error("Connexion à MySQL échouée :", err);
    process.exit(1); // Arrêter le serveur si la connexion échoue
  }
  console.log("Connexion à MySQL réussie !");
});

// Middleware CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(bodyParser.json());

// Options CORS pour les requêtes prévol (OPTIONS)
app.options("*", cors());

// Middleware pour les headers CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// Utilisation des routes
app.use("/api/user", userRoutes);
app.use("/api/projects", projectsRoutes);

// Exposez la connexion à la base de données pour l'utiliser dans d'autres modules
app.set("db", db);

module.exports = app;
