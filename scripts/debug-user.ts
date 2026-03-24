import { prisma } from '@/lib/auth';

async function debugUser() {
  try {
    console.log('🔍 Checking user ID 6...\n');

    // Get raw user
    const user = await prisma.user.findUnique({
      where: { id: 6 },
    });

    console.log('📋 User Record from Database:');
    console.log(JSON.stringify(user, null, 2));

    if (user) {
      console.log('\n✅ Fields found:');
      console.log(`   - id: ${user.id}`);
      console.log(`   - name: ${user.name}`);
      console.log(`   - email: ${user.email}`);
      console.log(`   - roleId: ${user.roleId}`);
      console.log(`   - kecamatanId: ${user.kecamatanId}`);
      console.log(`   - status: ${user.status}`);

      if (!user.kecamatanId) {
        console.log('\n⚠️  kecamatanId is NULL or undefined!');
        console.log('   Need to UPDATE user with correct kecamatanId value');

        // Try to update
        const updated = await prisma.user.update({
          where: { id: 6 },
          data: { kecamatanId: 1 },
        });
        console.log('\n✅ Updated user:');
        console.log(JSON.stringify(updated, null, 2));
      } else {
        console.log(`\n✅ kecamatanId exists: ${user.kecamatanId}`);
      }
    } else {
      console.log('❌ User not found!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUser();
