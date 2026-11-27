import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Admin & Customer Users
  const adminPassword = await bcrypt.hash('Admin@12345', 12);
  const customerPassword = await bcrypt.hash('Customer@12345', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopsphere.com' },
    update: {},
    create: {
      email: 'admin@shopsphere.com',
      passwordHash: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
      cart: { create: {} },
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      passwordHash: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.CUSTOMER,
      cart: { create: {} },
      addresses: {
        create: {
          street: '124 Cyber City Blvd',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560100',
          country: 'India',
          phone: '+919876543210',
          isDefault: true,
        },
      },
    },
  });

  // 2. Create Categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics & Gadgets',
      slug: 'electronics',
      description: 'Laptops, headphones, keyboards and computer peripherals',
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Fashion & Apparel',
      slug: 'fashion',
      description: 'Men and women designer clothes and premium accessories',
    },
  });

  const home = await prisma.category.upsert({
    where: { slug: 'home-living' },
    update: {},
    create: {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Modern furniture, decor and kitchen essentials',
    },
  });

  // 3. Create Sample Products with Inventory
  const products = [
    {
      title: 'Ergonomic Wireless Mechanical Keyboard',
      slug: 'ergonomic-wireless-mechanical-keyboard',
      description: 'Gateron brown switches, per-key RGB backlighting, Bluetooth 5.2 and multi-device connection.',
      price: 6499.00,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      categoryId: electronics.id,
      stock: 50,
    },
    {
      title: 'Precision Gaming Mouse with 26K DPI Sensor',
      slug: 'precision-gaming-mouse-26k-dpi',
      description: 'Ultra-lightweight 58g chassis, optical micro-switches, and 8000Hz polling rate.',
      price: 3299.00,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      categoryId: electronics.id,
      stock: 120,
    },
    {
      title: 'Active Noise Cancelling Wireless Headphones',
      slug: 'active-noise-cancelling-wireless-headphones',
      description: 'Hybrid 4-mic ANC, 40-hour battery life, high-res audio codec support and memory foam earcups.',
      price: 11999.00,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      categoryId: electronics.id,
      stock: 35,
    },
    {
      title: '4K Ultra-Wide IPS Curved Monitor 34-inch',
      slug: '4k-ultrawide-ips-curved-monitor-34',
      description: '144Hz refresh rate, USB-C 90W power delivery, HDR600 and 98% DCI-P3 color gamut.',
      price: 45999.00,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      categoryId: electronics.id,
      stock: 15,
    },
  ];

  for (const p of products) {
    const { stock, ...pData } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...pData,
        inventory: {
          create: {
            quantity: stock,
            reservedQuantity: 0,
          },
        },
      },
    });
  }

  console.log(`✅ Seed finished successfully.`);
  console.log(`👤 Admin: ${admin.email} (Password: Admin@12345)`);
  console.log(`👤 Customer: ${customer.email} (Password: Customer@12345)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
