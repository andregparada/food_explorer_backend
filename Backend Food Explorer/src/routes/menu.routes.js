const { Router } = require("express");

const MenuController = require("../controllers/MenuController");

const menuRoutes = Router();

const menuController = new MenuController();

menuRoutes.get("/", menuController.show);

module.exports = menuRoutes;