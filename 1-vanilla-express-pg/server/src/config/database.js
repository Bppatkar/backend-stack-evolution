// import dotenv from 'dotenv';
// dotenv.config();
// import pkg from 'pg';

// const { Pool } = pkg;

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// pool
//   .connect()
//   .then((client) => {
//     console.log('Database connected successfully');
//     client.release();
//   })
//   .catch((err) => {
//     console.error('Database connection error:', err.message);
//   });

// pool.on('error', (err) => {
//   console.error('Unexpected database error:', err);
//   process.exit(-1);
// });

// export default pool;

import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';

const { Pool } = pkg;

let poolConfig;

if (process.env.DATABASE_URL) {
  // For Render/Production - use connection string
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // REQUIRED for Render PostgreSQL
    },
  };
} else {
  // For Local Development - use individual variables
  poolConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

const pool = new Pool(poolConfig);

pool
  .connect()
  .then((client) => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(-1);
});

export default pool;
