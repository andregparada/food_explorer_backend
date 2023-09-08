const { Router } = require("express");

const adminsRouter = require("./admins.routes");
const usersRouter = require("./users.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/admins", adminsRouter);

module.exports = routes;