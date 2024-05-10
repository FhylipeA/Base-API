exports.up = knex => knex.schema.createTable("users", table => {
   table.increments("id");
   table.text("name").noteNullable;
   table.text("email").noteNullable;
   table.text("password").noteNullable;
   table.text("avatar");

   table.timestamp("created_at").default(knex.fn.now())
   table.timestamp("updated_at").default(knex.fn.now())
})


exports.down = knex => knex.schema.dropTable("users");