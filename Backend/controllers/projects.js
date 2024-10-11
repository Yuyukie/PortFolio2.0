exports.getProjects = (req, res) => {
  const { userId } = req.params;
  const db = req.app.get("db");
  const query = "SELECT * FROM projects WHERE fk_user = ?";

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Erreur de serveur" });
    res.status(200).json(results);
  });
};

exports.addProject = (req, res) => {
  const { project_title, project_description, project_picture, fk_user } =
    req.body;
  const db = req.app.get("db");
  const query =
    "INSERT INTO projects (project_title, project_description, project_picture, fk_user, created_at) VALUES (?, ?, ?, ?, NOW())";

  db.query(
    query,
    [project_title, project_description, project_picture, fk_user],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur de serveur" });
      res.status(201).json({
        message: "Projet créé avec succès",
        projectId: result.insertId,
      });
    }
  );
};

exports.updateProject = (req, res) => {
  const { id } = req.params;
  const { project_title, project_description, project_picture } = req.body;
  const db = req.app.get("db");
  const query =
    "UPDATE projects SET project_title = ?, project_description = ?, project_picture = ? WHERE project_id = ?";

  db.query(
    query,
    [project_title, project_description, project_picture, id],
    (err) => {
      if (err) return res.status(500).json({ message: "Erreur de serveur" });
      res.status(200).json({ message: "Projet mis à jour avec succès" });
    }
  );
};

exports.deleteProject = (req, res) => {
  const { id } = req.params;
  const db = req.app.get("db");
  const query = "DELETE FROM projects WHERE project_id = ?";

  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ message: "Erreur de serveur" });
    res.status(200).json({ message: "Projet supprimé avec succès" });
  });
};
