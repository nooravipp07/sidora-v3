// Manual seed script for seeding database with test data
// Run with: node prisma/manual-seed.js

const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  try {
    // Create roles
    const adminRole = await prisma.role.create({
      data: {
        name: 'admin',
        description: 'Administrator - Full system access',
      },
    });

    const operatorRole = await prisma.role.create({
      data: {
        name: 'operator',
        description: 'Operator - Limited access',
      },
    });

    const userRole = await prisma.role.create({
      data: {
        name: 'user',
        description: 'User - View only access',
      },
    });

    // Hash passwords
    const adminPassword = await bcryptjs.hash('password123', 10);
    const operatorPassword = await bcryptjs.hash('password123', 10);
    const userPassword = await bcryptjs.hash('password123', 10);

    // Create users
    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@example.com',
        password: adminPassword,
        roleId: adminRole.id,
        status: 1,
        namaLengkap: 'Admin System',
        noTelepon: '081234567890',
      },
    });

    const operator = await prisma.user.create({
      data: {
        name: 'Operator',
        email: 'operator@example.com',
        password: operatorPassword,
        roleId: operatorRole.id,
        status: 1,
        namaLengkap: 'Operator SIDORA',
        noTelepon: '082345678901',
      },
    });

    const user = await prisma.user.create({
      data: {
        name: 'User',
        email: 'user@example.com',
        password: userPassword,
        roleId: userRole.id,
        status: 1,
        namaLengkap: 'Regular User',
        noTelepon: '083456789012',
      },
    });

    console.log('✅ Seeding finished successfully!');
    console.log('\nTest Credentials:');
    console.log('- Admin:', admin.email, '/ password123');
    console.log('- Operator:', operator.email, '/ password123');
    console.log('- User:', user.email, '/ password123');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
