// import { PrismaClient } from '../prisma/generated/client';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { Pool } from 'pg';

// const connectionString = process.env.DATABASE_URL;

// // 1. Create the Pool and Adapter
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);

// // 2. Singleton Function
// const prismaClientSingleton = () => {
//     return new PrismaClient({ adapter });
// };

// // 3. Global Object Handling (prevents hot-reload crashes)
// const globalForPrisma = global;
// const prisma = globalForPrisma.prisma || prismaClientSingleton();
// //export default prisma;
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
// module.exports = prisma;
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../prisma/generated/client'); // Use the path defined in 'output'
const dotenv = require('dotenv'); // require dotenv if needed

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };