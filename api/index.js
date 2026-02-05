require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const { Pool } = require('pg'); // 1. Import Pool from pg
const app = express();

// const pool = new Pool({
//     connectionString: "postgres://<username>:<password>@localhost:5432/unb_marketplace"
// });

// const connString = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

// const pool = new Pool({
//     connectionString: connString
// });

// app.set('db', pool);

app.use(cors({
    origin: `${process.env.ORIGIN_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
const authRoutes = require('./endpoints/auth');
app.use('/', authRoutes);

const productRoutes = require('./endpoints/products');
app.use('/', productRoutes);

const configRoutes = require('./endpoints/config');
app.use('/', configRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));