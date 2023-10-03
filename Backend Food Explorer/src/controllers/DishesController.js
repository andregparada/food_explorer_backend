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
        });

        const ingredientsInsert = ingredients.map(name => {
            return {
                dish_id,
                name
            }
        });

        await knex("ingredients").insert(ingredientsInsert);

        return response.json();
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

    async delete(request, response) {
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { name, ingredients } = request.query;
        const dish = await knex("dishes")
        .whereLike("name", `%${name}%`)
        .select("id")
        .first();
        
        const dish_id = dish.id

        let dishes;

        if (ingredients) {
            const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

            dishes = await knex("ingredients")
            .select([
                "dishes.id",
                "dishes.name",
            ])
            .whereLike("dishes.name", `%${name}%`)
            .whereIn("ingredients.name", filterIngredients)
            .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
            .orderBy("dishes.name")

        } else {
            dishes = await knex("dishes")
            .whereLike("name", `%${name}%`)
            .orderBy("name");
        }

        const dishIngredientsIds = await knex("ingredients").where({ dish_id });
        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredients = dishIngredientsIds.filter(ingredient => ingredient.dish_id === dish.id);

            return {
                ...dish,
                ingredients: dishIngredients
            }
        });

        return response.json(dishesWithIngredients);
    }
}

module.exports = DishesController