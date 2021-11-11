import { Knex } from "knex";
// TODO: Verify wether name uniqueness is necessary
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("Room", (table) => {
    table.uuid("rid").unique().notNullable();
    table.string("name").notNullable();
    table.specificType("members", "text ARRAY").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("Room");
}
