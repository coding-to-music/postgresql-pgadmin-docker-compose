const { Pool } = require('pg');
require('dotenv').config();

// Create a new Pool object to handle connections to Postgres
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PW,
  port: process.env.POSTGRES_PORT,
});

// Create the "mytable" table if it doesn't already exist
const createTableQuery = `CREATE TABLE IF NOT EXISTS mytable (
  id SERIAL PRIMARY KEY,
  datetime TIMESTAMP NOT NULL
)`;
pool.query(createTableQuery, (err, res) => {
  if (err) {
    console.error('Error creating table', err.stack);
    console.log('Error creating table, about to return');
    return;
  } else {
    console.log('Table created successfully');
  }
});

// Get the number of rows in the "mytable" table before inserting a new row
pool.query('SELECT COUNT(*) FROM mytable', (err, res) => {
  console.log(`Number of rows before: ${res.rows[0].count}`);

  // Generate a unique identifier using the current timestamp
  const id = `mykey_${new Date().getTime()}`;

  // Get the current date and time in human-readable format
  const now = new Date();
  const datetime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  // Insert a new row into the "mytable" table with the generated id and current datetime
  const insertQuery = `INSERT INTO mytable (id, datetime) VALUES ($1, $2)`;
  const values = [id, datetime];
  pool.query(insertQuery, values, (err, res) => {
    if (err) {
      console.error(err);
    }

    // Retrieve the value of the inserted row and print it to the console
    const selectQuery = `SELECT * FROM mytable WHERE id = $1`;
    pool.query(selectQuery, [id], (err, res) => {
      console.log(res.rows[0]);

      // Get the number of rows in the "mytable" table after inserting a new row
      pool.query('SELECT COUNT(*) FROM mytable', (err, res) => {
        console.log(`Number of rows after: ${res.rows[0].count}`);

        // Retrieve all rows in the "mytable" table
        pool.query('SELECT * FROM mytable', (err, res) => {
          // Create an array of objects representing each row
          const rows = res.rows.map(row => {
            return { id: row.id, datetime: row.datetime };
          });
          console.log(rows);

          // End the connection pool
          pool.end();
        });
      });
    });
  });
});
