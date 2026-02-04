require('dotenv').config();
const { prisma } = require('./lib/prisma');
const bcrypt = require('bcrypt');

// const pool = new Pool({
//     connectionString: "postgres://<username>:<password>@localhost:5432/unb_marketplace"
// });

const SALT_ROUNDS = 10;

const seed = async () => {
    try {
        console.log("Starting seed process...");

        // 1. Clear existing data
        await prisma.products.deleteMany();
        await prisma.users.deleteMany();

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash("123456789", SALT_ROUNDS);

        // 3. Insert Test User
        const testEmail = 'test@unb.ca';
        await prisma.users.create({ data: { email: testEmail, password: hashedPassword } });

        // 4. Generate 20 Products
        const items = [
            "iPad (9th Gen) 64GB", "Calculus Textbook", "Dorm Desk Lamp",
            "UNB Hoodie (Large)", "Scientific Calculator", "Coffee Maker",
            "Noise Cancelling Headphones", "Mini Fridge", "External Hard Drive",
            "Yoga Mat", "Mechanical Keyboard", "Electric Kettle",
            "Backpack", "Winter Boots", "Gaming Mouse",
            "Study Desk", "Office Chair", "Bike Helmet",
            "Skateboard", "Microwave"
        ];

        for (let i = 0; i < 20; i++) {
            const title = items[i] || `Marketplace Item #${i + 1}`;
            const price = Math.floor(Math.random() * 200) + 10; // Random price between 10 and 210
            const image_url = `https://picsum.photos/seed/unb${i + 1}/400/400`;

            await prisma.products.create({ data: { title, price: Number(price), image_url, owner_email: testEmail } });
        }

        console.log("Database seeded successfully with 1 user and 20 products!");
        await prisma.$disconnect();
        process.exit();
    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }
};

seed();