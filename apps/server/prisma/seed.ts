import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const users = [
  { email: 'alice@fanera.local', name: 'Alice' },
  { email: 'bob@fanera.local', name: 'Bob' },
];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env['DATABASE_URL'] }),
});

try {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name },
      create: user,
    });
  }
  console.log(`seeded ${users.length} users`);
} finally {
  await prisma.$disconnect();
}
