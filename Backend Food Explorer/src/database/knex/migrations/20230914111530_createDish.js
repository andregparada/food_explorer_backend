exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id");
    table.text("name");
    table.text("image");
    table.text("categorie");
    table.text("description");
    table.text("price");
    table.integer("user_id").references("id").inTable("users");

    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
});

exports.down = knex => knex.schema.dropTable("dishes");
