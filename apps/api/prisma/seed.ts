import 'dotenv/config';
import Database from 'better-sqlite3';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaBetterSqlite3({ url: 'prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding products...');

  const products = [
    { sku: '7891234560010', name: 'Batom Matte Rosa', category: 'Batom', ncm: '33041000', stock: 50 },
    { sku: '7891234560027', name: 'Batom Matte Vermelho', category: 'Batom', ncm: '33041000', stock: 40 },
    { sku: '7891234560034', name: 'Rímel Volume Extra', category: 'Rímel', ncm: '33042010', stock: 30 },
    { sku: '7891234560041', name: 'Base Líquida Natural', category: 'Base', ncm: '33049990', stock: 25 },
    { sku: '7891234560058', name: 'Delineador Preto', category: 'Olhos', ncm: '33042090', stock: 35 },
    { sku: '7891234560065', name: 'Esponja de Maquiagem', category: 'Acessórios', ncm: '96162000', stock: 100 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        ...product,
        price: 10.0,
      },
    });
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
