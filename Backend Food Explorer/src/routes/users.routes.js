const { Router } = require("express");

const UsersController = require("../controllers/UsersController");

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);

module.exports = usersRoutes;

// const UserAvatarController = require("../controllers/DishImageController")
// const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
// usersRoutes.put("/", ensureAuthenticated, usersController.update);
