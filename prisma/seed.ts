// Example database seed script for Prisma
// Run with: npx prisma db seed

import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth/bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data (careful with this in production!)
  await prisma.loginHistory.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});

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

  // Create permissions
  const viewPermission = await prisma.permission.create({
    data: {
      name: 'view_dashboard',
      description: 'Can view dashboard',
    },
  });

  const editPermission = await prisma.permission.create({
    data: {
      name: 'edit_data',
      description: 'Can edit data',
    },
  });

  const deletePermission = await prisma.permission.create({
    data: {
      name: 'delete_data',
      description: 'Can delete data',
    },
  });

  // Assign permissions to roles
  await prisma.rolePermission.create({
    data: {
      roleId: adminRole.id,
      permissionId: viewPermission.id,
    },
  });

  await prisma.rolePermission.create({
    data: {
      roleId: adminRole.id,
      permissionId: editPermission.id,
    },
  });

  await prisma.rolePermission.create({
    data: {
      roleId: adminRole.id,
      permissionId: deletePermission.id,
    },
  });

  await prisma.rolePermission.create({
    data: {
      roleId: operatorRole.id,
      permissionId: viewPermission.id,
    },
  });

  await prisma.rolePermission.create({
    data: {
      roleId: operatorRole.id,
      permissionId: editPermission.id,
    },
  });

  await prisma.rolePermission.create({
    data: {
      roleId: userRole.id,
      permissionId: viewPermission.id,
    },
  });

  // Create users with hashed passwords
  const adminPassword = await hashPassword('password123');
  const operatorPassword = await hashPassword('password123');
  const userPassword = await hashPassword('password123');

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

  console.log('Seeding finished');
  console.log({
    adminRole,
    operatorRole,
    userRole,
    admin,
    operator,
    user,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
