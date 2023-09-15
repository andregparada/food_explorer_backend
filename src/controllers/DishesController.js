const knex = require("../database/knex");

class DishesController {
    async create(request, response) {
        const { name, description, categorie, price, ingredients } = request.body;
        const { user_id } = request.params;

        const [dish_id] = await knex("dishes").insert({
            name,
            description,
            price,
            user_id
        });

        await knex("categories").insert({
            name: categorie,
            dish_id,
            user_id
        });

        const ingredientsInsert = ingredients.map(name => {
            return {
                dish_id,
                user_id,
                name
            }
        });

        await knex("ingredients").insert(ingredientsInsert);

        response.json();
    }

    async show(request, response) {
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");
        const categorie = await knex("categories").where({ dish_id: id });

        return response.json({
            ...dish,
            ingredients,
            categorie
        })
    }
}

module.exports = DishesController