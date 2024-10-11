const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projects");
const auth = require("../middleware/auth");

router.get("/:userId", auth, projectsController.getProjects);
router.post("/", auth, projectsController.addProject);
router.put("/:id", auth, projectsController.updateProject);
router.delete("/:id", auth, projectsController.deleteProject);

module.exports = router;
