const express = require("express");
const router = express.Router();
const { resetdb } = require("../lib/resetdb");
const { prisma } = require('../lib/prisma.js');

// GET / - Welcome message with total products count
router.get("/", async (req, res) => {

    try {
        const products = await prisma.products.findMany({
            orderBy: {
                id: "desc",
            },
        });
        res.json({ message: `Welcome to the ${process.env.APP_NAME ?? "UNB Default Marketplace API"}`, totalProducts: products.length });
        // res.json(products);
    } catch (err) {
        console.error(err);
        res.json({ message: `Welcome to the ${process.env.APP_NAME ?? "UNB Default Marketplace API"}` });
    } finally {
        await prisma.$disconnect();
    }
});

// GET /resetdb - Reset and seed the database
router.get("/resetdb", async (req, res) => {

    try {
        await resetdb();
        res.json({ message: "Database reset and seeded successfully." });
    } catch (err) {
        console.error(err);
        res.json({ message: `Error resetting database: ${err.message}` });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;