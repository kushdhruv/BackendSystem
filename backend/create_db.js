const { Client } = require('pg');

async function createDb() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
    database: 'postgres'
  });
  
  try {
    await client.connect();
    const res = await client.query("SELECT datname FROM pg_catalog.pg_database WHERE datname = 'taskmanager'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE taskmanager');
      console.log('Database taskmanager created successfully');
    } else {
      console.log('Database taskmanager already exists');
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await client.end();
  }
}

createDb();
