const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { user_email, user_password } = req.body;
  const db = req.app.get("db");
  const query = "SELECT * FROM user WHERE user_email = ?";

  db.query(query, [user_email], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur de serveur" });
    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const user = results[0];
    bcrypt.compare(user_password, user.user_password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Erreur de serveur" });
      if (isMatch) {
        // Créer un token JWT
        const token = jwt.sign(
          { userId: user.user_id, userEmail: user.user_email },
          process.env.JWT_SECRET, // Clé secrète pour signer le token
          { expiresIn: "24h" } // Expiration du token
        );
        return res
          .status(200)
          .json({ token, user, message: "Connexion réussie" });
      } else {
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }
    });
  });
};
