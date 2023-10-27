const knex = require("../database/knex");

class MenuController {
    async show (request, response) {
        const dishes = await knex("dishes");
        const ingredients = await knex("ingredients")

        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredients = ingredients.filter(ingredient => ingredient.dish_id === dish.id)
            return {
                ...dish,
                ingredients: dishIngredients
            }
        });

        

        return response.json(dishesWithIngredients)
    };
}

module.exports = MenuController;