import "dotenv/config";
import { PrismaClient } from "../src/generated/client";
import productsData from "../src/data/products.json";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding PostgreSQL database with real initial data...");

  let count = 0;
  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        rating: product.rating,
        image: product.image,
        description: product.description,
      },
      create: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        stock: product.stock,
        rating: product.rating,
        image: product.image,
        description: product.description,
      },
    });
    count++;
  }

  console.log(`✅ Successfully seeded ${count} products into PostgreSQL database!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
