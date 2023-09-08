const { Router } = require("express");

const adminsRoutes = Router();

adminsRoutes.post("/", (request, response) => {
    const { name, email, password } = request.body;

    response.json({ name, email, password });
});

module.exports = adminsRoutes;