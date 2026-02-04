# SWE4213 - Lab 1 (CHARLES EWAIFOH EJEDAWE - 3789602)

This README shows you how to get the project up and running.

## AI Statement

I used Github Co-pilot to solve 3 bugs, 4 enhancements and to re-write the Sql Queries to Prisma logic.

## Changes

I moved the database information and JWT Secret Key to .env file and created a sample .env file.

I changed the seed.js sql queries to prisma logic.

## Setup DB

Shown here are the commands you need to start up your database.

- **Create Database:** `psql -d postgres -c "CREATE DATABASE unb_marketplace;"`
- **Create Tables:** `psql -d unb_marketplace -f backend/db.sql`
- **Connect DB to API:** Update `connection_string` in `seed.js` and `index.js`.
- **Seed DB:** `cd api; node seed.js`

Note: If running on windows you will have to pass in a user name and password.

- **Delete Database:** `psql -d postgres -c "DROP DATABASE unb_marketplace;"`

## Starting Server

Open a terminal in vscdoe.

- **Install Dependencies:** `cd api; npm install`
- **Run Server:** `npm run dev`

## Starting Front End

Open another terminal in vscode.

- **Install Dependencies:** `cd front-end; npm install`
- **Run Server:** `npm run dev`
