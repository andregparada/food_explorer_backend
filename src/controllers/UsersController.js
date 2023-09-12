const AppError = require("../utils/AppError");



class UsersController {
    create (request, response) {
        const { name, email, password } = request.body;

    }
};

module.exports = UsersController;

/* function isAdmin (request, response, next) {
    if (!request.body.isAdmin) {
        return response.json({ message: "Usuário não autorizado" })
    }
}
*/