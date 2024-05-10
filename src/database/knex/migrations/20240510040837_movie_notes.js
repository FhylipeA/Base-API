exports.up = knex => knex.schema.createTable("tabela_relacionada", table => {
   table.increments("id");
   table.text("name");
   table.text("coluna_2");
   table.integer("coluna3");

   table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");

   table.timestamp("created_at").default(knex.fn.now())
   table.timestamp("updated_at").default(knex.fn.now())
})

exports.down = knex => knex.schema.dropTable("movie_notes");