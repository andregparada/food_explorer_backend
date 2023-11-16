const knex = require("../database/knex");

const DiskStorage = require("../providers/DiskStorage");

class DishesController {
    async create(request, response) {
        const { name, description, categorie, price, ingredients } = request.body;
        const user_id = request.user.id;

        const imageFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const ingredientsArray = ingredients.split(',');

        const filename = await diskStorage.saveFile(imageFilename);

        const [dish_id] = await knex("dishes").insert({
            name,
            description,
            categorie,
            price,
            user_id,
            image: filename
        });

        const ingredientsInsert = ingredientsArray.map(name => {
            return {
                dish_id,
                name
            }
        });

        await knex("ingredients").insert(ingredientsInsert);

        return response.json();
    }

    async update(request, response) {
        const { name, description, categorie, price, ingredients } = request.body;
        const { id } = request.params;

        let imageFilename
        if (request.file) {
            imageFilename = request.file.filename;
        }
        
        const diskStorage = new DiskStorage();

        const dish = await knex("dishes").where({ id }).first();

        let filename
        if(imageFilename) {
            if (dish.image) {
                await diskStorage.deleteFile(dish.image)
                filename = await diskStorage.saveFile(imageFilename);
            }
        }


        if (ingredients) {
            const ingredientsArray = ingredients.split(',');
            await knex("ingredients").where({ dish_id: id }).delete()

            const ingredientsInsert = ingredientsArray.map(ingredient => {
                return {
                    dish_id: id,
                    name: ingredient
                }
            })

            await knex("ingredients").insert(ingredientsInsert);
        }

        dish.image = filename ?? dish.image;
        if(name !== "") {
            dish.name = name
        }
        if(description !== "") {
            dish.description = description
        }
        if(categorie !== "") {
            dish.categorie = categorie
        }
        if(price !== "") {
            dish.price = price
        }

        const updatedDish = await knex("dishes").where({ id }).first().update(dish)

        return response.json()

    }

    async show(request, response) {
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

        return response.json({
            ...dish,
            ingredients
        })
    }

    async delete(request, response) {
        const { id } = request.params;

        await knex("dishes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { search } = request.query;

        let dishes;
        let ingredients;

        if(search) {
            dishes = await knex("dishes")
                .whereLike("name", `%${search}%`)
                .orderBy("name");
            ingredients = await knex("ingredients")
                .whereLike("name", `%${search}`)
                .orderBy("name")
        } else {
            return response.json()
        }

        const allDishes = await knex("dishes");
        if (ingredients.length !== 0) {
            const addIngredientsDishes = ingredients.map(ingredient => {
                const ingredientDishes = allDishes.filter(dish => dish.id === ingredient.dish_id);
                ingredientDishes.forEach(element => {
                    dishes.push(element)
                });
            })
        }

        const allIngredients = await knex("ingredients");
        const dishesWithIngredients = dishes.map(dish => {
            const dishIngredients = allIngredients.filter(ingredient => ingredient.dish_id === dish.id);

            return {
                ...dish,
                ingredients: dishIngredients
            }
        });

        const dishesFiltered =[];
        for (const dish of dishesWithIngredients) {
            const isDuplicate = dishesFiltered.find((duplicateDish) => duplicateDish.name === dish.name)
            if (!isDuplicate) {
                dishesFiltered.push(dish)
            }
        }

        return response.json(dishesFiltered);
    }
}

module.exports = DishesController;


            // código para filtrar ingredientes alterado
            // const filterIngredients = ingredients.map(ingredient => {
            //     const ingredientDishes = allDishes.filter(dish => dish.id === ingredient.dish_id);
            //     return {
            //         ...ingredientDishes
            //     }
            // });

            // dishes = {
            //     ...dishes,
            //     ...filterIngredients
            // }
            // return response.json(dishes)

            // antigo index
                    // const { name, ingredients } = request.query;
        // const dish = await knex("dishes")
        //     .whereLike("name", `%${name}%`)
        //     .select("id")
        //     .first();
                    
        // const dish_id = dish.id

        // if (ingredients) {
        //     const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

        //     dishes = await knex("ingredients")
        //     .select([
        //         "dishes.id",
        //         "dishes.name",
        //     ])
        //     .whereLike("dishes.name", `%${search}%`)
        //     .whereIn("ingredients.name", filterIngredients)
        //     .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        //     .orderBy("dishes.name")

        // } else if(search) {
        //     dishes = await knex("dishes")
        //     .whereLike("name", `%${search}%`)
        //     .orderBy("name");
        // } else {
        //     return response.json()
        // }

        // const dishIngredientsIds = await knex("ingredients").where({ dish_id });