import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Initialize database table
pool.on('connect', async (client) => {
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      shortCode VARCHAR(8) UNIQUE NOT NULL,
      originalUrl TEXT NOT NULL,
      createdAt TIMESTAMP DEFAULT NOW(),
      clickCount INT DEFAULT 0,
      lastClickedAt TIMESTAMP
    )`)
    console.log('Database table ensured')
  } catch (err) {
    console.error('Error creating table:', err)
  }
})

export { pool }