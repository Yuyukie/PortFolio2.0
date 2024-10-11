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
      if (err) {
        console.log("Erreur dans bcrypt.compare:", err);
        return res.status(500).json({ message: "Erreur de serveur" });
      }
      console.log("isMatch:", isMatch); // Afficher le résultat de la comparaison
      if (isMatch) {
        // Créer un token JWT
        const token = jwt.sign(
          { userId: user.user_id, userEmail: user.user_email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        return res
          .status(200)
          .json({ token, user, message: "Connexion réussie" });
      } else {
        console.log("Mot de passe incorrect");
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }
    });
  });
};
