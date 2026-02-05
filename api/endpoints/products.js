const express = require("express");
const authcheck = require("../middleware/authcheck");
const resetdb = require("../lib/resetdb");
const router = express.Router();
//import prisma from '../lib/prisma';
const { prisma } = require('../lib/prisma.js');




// GET /products - Get all products
router.get("/products", authcheck, async (req, res) => {
    try {
        const products = await prisma.products.findMany({
            orderBy: {
                id: "desc",
            },
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error fetching products" });
    } finally {
        await prisma.$disconnect();
    }
});

// GET /products/mylistings - Get products for the logged-in user
router.get("/products/mylistings", authcheck, async (req, res) => {
    try {
        const userEmail = req.user.email;
        const products = await prisma.products.findMany({
            where: { owner_email: userEmail },
            orderBy: { id: 'desc' }
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error fetching your listings" });
    }
});

// POST /products - Create a new listing
router.post("/products", authcheck, async (req, res) => {
    const { title, price, image_url } = req.body;
    const owner_email = req.user.email;

    try {
        const created = await prisma.products.create({
            data: {
                title,
                price: Number(price),
                image_url,
                owner_email
            }
        });
        res.status(201).json(created);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error creating product" });
    }
});

// DELETE /products/:id - Delete a listing by ID
router.delete("/products/:id", authcheck, async (req, res) => {
    const id = Number(req.params.id);

    try {
        const deleted = await prisma.products.delete({ where: { id } });
        res.json({ message: "Product deleted", deleted });
    } catch (err) {
        // Prisma will throw if record not found (P2025)
        if (err && err.code === 'P2025') {
            return res.status(404).json({ error: "Product not found" });
        }
        console.error(err);
        res.status(500).json({ error: "Database error deleting product" });
    }
});

module.exports = router;