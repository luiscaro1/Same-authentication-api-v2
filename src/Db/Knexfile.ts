// Update with your config settings.

const config = {
  production: {
    client: "postgresql",
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
      host: "ec2-54-196-65-186.compute-1.amazonaws.com",
      database: "dfkm1pao39k887",
      user: "ggbkaydjcwmolt",
      password:
        "1c44cb1e643943ae64c701c1e91ba0db3a9b0969b35e4f324c760492855c6ba9",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  development: {
    client: "postgresql",
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
      host: "ec2-54-196-65-186.compute-1.amazonaws.com",
      database: "dfkm1pao39k887",
      user: "ggbkaydjcwmolt",
      password:
        "1c44cb1e643943ae64c701c1e91ba0db3a9b0969b35e4f324c760492855c6ba9",
      // client: "postgresql",
      // connection: {
      //   database: "postgres",
      //   user: "postgres",
      //   password: "postgres",
      //   host: "db",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
