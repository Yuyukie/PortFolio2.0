const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]; // Le token est envoyé dans le header "Authorization: Bearer TOKEN"
  if (!token) {
    return res.status(401).json({ message: "Authentification échouée !" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Vérification du token
    req.user = {
      userId: decodedToken.userId,
      userEmail: decodedToken.userEmail,
    }; // Stocker les données du token
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentification échouée !" });
  }
};
