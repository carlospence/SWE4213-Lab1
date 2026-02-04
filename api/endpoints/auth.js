const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const authcheck = require("../middleware/authcheck");
const { prisma } = require('../lib/prisma.js');

const SECRET_KEY = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

router.post("/auth/register", async (req, res) => {
    const { email, password } = req.body; // Changed 'username' to 'email' to match your schema

    if (!email.toLowerCase().endsWith("@unb.ca")) {
        return res.status(403).json({
            message: "Registration is only available for UNB students (@unb.ca)."
        });
    }

    try {
        // 1. Check if user already exists
        const userExists = await prisma.users.findUnique({ where: { email } });
        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // 3. Insert user via Prisma
        await prisma.users.create({ data: { email, password: hashedPassword } });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating user" });
    }
});

router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email
        const user = await prisma.users.findUnique({ where: { email } });

        if (user) {
            // 2. Compare password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const token = jwt.sign(
                    { userId: user.id, email: user.email },
                    SECRET_KEY,
                    { expiresIn: '1h' }
                );

                return res.status(200).json({
                    message: "Login successful",
                    token: token,
                    user: { id: user.id, email: user.email }
                });
            }
        }

        res.status(401).json({ message: "Invalid credentials" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during login" });
    }
});

router.get("/auth/status", authcheck, async (req, res) => {

    try {
        // Find user by the ID attached to req.user by the authcheck middleware
        const user = await prisma.users.findUnique({
            where: { id: Number(req.user.userId) },
            select: { id: true, email: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User is logged in.",
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error checking status" });
    }
});

module.exports = router;