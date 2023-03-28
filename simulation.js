const { Pool } = require('pg');
require('dotenv').config();

async function runSimulation() {
  // Create a new Pool object to handle connections to Postgres
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PW,
    port: process.env.POSTGRES_PORT,
  });

  try {
    // Create the "mytable" table if it doesn't already exist
    const createTableQuery = `CREATE TABLE IF NOT EXISTS mytable (
      id SERIAL PRIMARY KEY,
      datetime TIMESTAMP NOT NULL
    )`;
    await pool.query(createTableQuery);

    // Get the number of rows in the "mytable" table before inserting a new row
    const countBeforeQuery = 'SELECT COUNT(*) FROM mytable';
    const { rows: rowsBefore } = await pool.query(countBeforeQuery);
    console.log(`Number of rows before: ${rowsBefore[0].count}`);

    // Generate a unique identifier using the current timestamp
    const id = `mykey_${new Date().getTime()}`;

    // Get the current date and time in human-readable format
    const now = new Date();
    const datetime = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    // Insert a new row into the "mytable" table with the generated id and current datetime
    const insertQuery = `INSERT INTO mytable (id, datetime) VALUES ($1, $2)`;
    const values = [id, datetime];
    await pool.query(insertQuery, values);

    // Retrieve the value of the inserted row and print it to the console
    const selectQuery = `SELECT * FROM mytable WHERE id = $1`;
    const { rows: insertedRow } = await pool.query(selectQuery, [id]);
    console.log(insertedRow[0]);

    // Get the number of rows in the "mytable" table after inserting a new row
    const countAfterQuery = 'SELECT COUNT(*) FROM mytable';
    const { rows: rowsAfter } = await pool.query(countAfterQuery);
    console.log(`Number of rows after: ${rowsAfter[0].count}`);

    // Retrieve all rows in the "mytable" table
    const selectAllQuery = 'SELECT * FROM mytable';
    const { rows: allRows } = await pool.query(selectAllQuery);

    // Create an array of objects representing each row
    const rows = allRows.map(row => {
      return { id: row.id, datetime: row.datetime };
    });
    console.log(rows);

  } catch (error) {
    console.error(error);
  } finally {
    // End the connection pool
    await pool.end();
  }
}

runSimulation();
