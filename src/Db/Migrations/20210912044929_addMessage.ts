import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("Message", (table) => {
    table.uuid("mid").unique().notNullable();
    table.uuid("rid").references("rid").inTable("Room");
    table.string("uid").notNullable();
    table.string("content").notNullable();
    table.string("type").notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("Message");
}
