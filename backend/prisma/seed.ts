import { PrismaClient, Role, OrderStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting full database seed (24 products, categories, admin & sample orders)...');

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
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', description: 'Computing, audio, displays, and smart accessories' },
    { name: 'Fashion', slug: 'fashion', description: 'Designer wear, watches, leather goods, and accessories' },
    { name: 'Home & Living', slug: 'home-living', description: 'Ergonomic furniture, lighting, and kitchen appliances' },
    { name: 'Fitness & Sports', slug: 'fitness', description: 'Gym equipment, yoga mats, resistance bands, and recovery gear' },
  ];

  const catMap: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    catMap[c.slug] = cat.id;
  }

  // 3. 24 Products with realistic stock & prices
  const products = [
    {
      title: 'Ergonomic Wireless Mechanical Keyboard',
      slug: 'ergonomic-wireless-mechanical-keyboard',
      description: 'Gateron brown switches, per-key RGB backlighting, Bluetooth 5.2 and multi-device connection.',
      price: 6499.00,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['electronics'],
      stock: 35,
    },
    {
      title: 'Precision Gaming Mouse with 26K DPI Sensor',
      slug: 'precision-gaming-mouse-26k-dpi',
      description: 'Ultra-lightweight 58g chassis, optical micro-switches, and 8000Hz polling rate.',
      price: 3299.00,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['electronics'],
      stock: 50,
    },
    {
      title: 'Active Noise Cancelling Wireless Headphones',
      slug: 'active-noise-cancelling-wireless-headphones',
      description: 'Hybrid 4-mic ANC, 40-hour battery life, high-res audio codec support and memory foam earcups.',
      price: 11999.00,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['electronics'],
      stock: 12,
    },
    {
      title: '4K Ultra-Wide IPS Curved Monitor 34-inch',
      slug: '4k-ultrawide-ips-curved-monitor-34',
      description: '144Hz refresh rate, USB-C 90W power delivery, HDR600 and 98% DCI-P3 color gamut.',
      price: 45999.00,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['electronics'],
      stock: 4,
    },
    {
      title: 'MagSafe Multi-Device Fast Wireless Charger',
      slug: 'magsafe-multi-device-fast-wireless-charger',
      description: '15W rapid charging for smartphone, smartwatch, and earbuds with weighted zinc alloy base.',
      price: 3499.00,
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['electronics'],
      stock: 25,
    },
    {
      title: 'Smart Fitness Tracker with AMOLED Display',
      slug: 'smart-fitness-tracker-amoled',
      description: 'SpO2 monitoring, 24/7 heart-rate tracking, 50m water resistance, and 14-day battery life.',
      price: 4999.00,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['electronics'],
      stock: 40,
    },
    {
      title: 'Minimalist Water-Resistant Commuter Backpack',
      slug: 'minimalist-water-resistant-commuter-backpack',
      description: 'Dedicated 16-inch laptop sleeve, hidden RFID security pockets, and magnetic quick-access buckles.',
      price: 4299.00,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fashion'],
      stock: 22,
    },
    {
      title: 'Classic Chronograph Quartz Watch with Leather Strap',
      slug: 'classic-chronograph-quartz-watch',
      description: 'Surgical-grade 316L stainless steel casing, sapphire crystal glass, and Italian genuine leather.',
      price: 8999.00,
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fashion'],
      stock: 3,
    },
    {
      title: 'Polarized Aviator Sunglasses UV400',
      slug: 'polarized-aviator-sunglasses-uv400',
      description: 'Titanium lightweight frame with scratch-resistant gradient polarized lenses for eye protection.',
      price: 2499.00,
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fashion'],
      stock: 45,
    },
    {
      title: 'Merino Wool Crewneck Performance Sweater',
      slug: 'merino-wool-crewneck-performance-sweater',
      description: 'Naturally breathable, odor-resistant, ultra-soft Australian merino wool for all-season comfort.',
      price: 3999.00,
      imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fashion'],
      stock: 18,
    },
    {
      title: 'Heritage Full-Grain Leather Bi-Fold Wallet',
      slug: 'heritage-leather-bifold-wallet',
      description: 'RFID blocking lining, 8 card slots, dual currency compartments, and vegetable-tanned leather.',
      price: 1899.00,
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fashion'],
      stock: 0,
    },
    {
      title: 'Urban Streetwear Heavyweight Cotton Hoodie',
      slug: 'urban-streetwear-heavyweight-hoodie',
      description: '450 GSM French terry cotton, double-needle stitched cuffs, and structured relaxed silhouette.',
      price: 2999.00,
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fashion'],
      stock: 30,
    },
    {
      title: 'Smart LED Desk Lamp with Wireless Charger',
      slug: 'smart-led-desk-lamp-wireless-charger',
      description: 'Adjustable color temperatures (2700K-6500K), auto-dimming ambient sensor, and Qi fast charger.',
      price: 2899.00,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['home-living'],
      stock: 25,
    },
    {
      title: 'Precision Temperature Pour-Over Electric Kettle',
      slug: 'precision-temperature-pour-over-kettle',
      description: 'Gooseneck spout for optimal flow control, LCD temperature display, and 60-minute keep-warm.',
      price: 5499.00,
      imageUrl: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['home-living'],
      stock: 16,
    },
    {
      title: 'Ceramic Ultrasonic Essential Oil Aroma Diffuser',
      slug: 'ceramic-ultrasonic-essential-oil-diffuser',
      description: 'Handcrafted matte ceramic cover, whisper-quiet operation, and ambient warm LED breathing light.',
      price: 2199.00,
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['home-living'],
      stock: 2,
    },
    {
      title: 'Solid American Walnut Wood Monitor Stand',
      slug: 'solid-walnut-wood-monitor-stand',
      description: 'Elevates display to eye level, premium cork legs with cable routing, and supports up to 40kg.',
      price: 3799.00,
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['home-living'],
      stock: 28,
    },
    {
      title: 'Double-Walled Stainless Steel Insulated Tumbler',
      slug: 'double-walled-insulated-tumbler',
      description: 'Keeps beverages cold for 24 hours or piping hot for 12 hours with leakproof magnetic lid.',
      price: 1499.00,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['home-living'],
      stock: 60,
    },
    {
      title: 'Ergonomic Memory Foam Lumbar Support Cushion',
      slug: 'ergonomic-lumbar-support-cushion',
      description: 'Orthopedic contoured design, breathable 3D mesh cover, and dual adjustable securing straps.',
      price: 1999.00,
      imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['home-living'],
      stock: 15,
    },
    {
      title: 'Adjustable Quick-Select Dumbbell Set 24kg',
      slug: 'adjustable-quick-select-dumbbell-set',
      description: 'Replaces 15 sets of weights in one compact system with simple turn-dial weight selection.',
      price: 18999.00,
      imageUrl: 'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fitness'],
      stock: 8,
    },
    {
      title: 'High-Density Non-Slip Eco Yoga Mat with Alignment Lines',
      slug: 'high-density-eco-yoga-mat',
      description: 'Biodegradable natural tree rubber base with laser-etched posture alignment markings.',
      price: 2799.00,
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fitness'],
      stock: 35,
    },
    {
      title: 'Deep Tissue Percussion Massage Gun with 6 Heads',
      slug: 'deep-tissue-percussion-massage-gun',
      description: 'Brushless motor delivering 3200 RPM, 16mm stall depth, and ultra-quiet operation (<45dB).',
      price: 6999.00,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fitness'],
      stock: 5,
    },
    {
      title: 'Premium Heavy-Duty Fabric Resistance Bands Set',
      slug: 'heavy-duty-fabric-resistance-bands-set',
      description: 'Non-slip inner latex grip strips, 3 progressive resistance levels, with carry pouch.',
      price: 1199.00,
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fitness'],
      stock: 70,
    },
    {
      title: 'Stainless Steel Insulated Protein Shaker 750ml',
      slug: 'stainless-steel-insulated-protein-shaker',
      description: 'Silent mixing whisk blade, odor-free stainless interior, and measurement markings.',
      price: 1599.00,
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fitness'],
      stock: 40,
    },
    {
      title: 'High-Speed Ball Bearing Weighted Jump Rope',
      slug: 'high-speed-weighted-jump-rope',
      description: '360-degree dual-bearing swivel system, tangle-free steel wire cable, and silicone anti-slip handles.',
      price: 999.00,
      imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80',
      categoryId: catMap['fitness'],
      stock: 85,
    },
  ];

  const createdProducts = [];
  for (const p of products) {
    const { stock, ...pData } = p;
    const prod = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        price: p.price,
        description: p.description,
        imageUrl: p.imageUrl,
      },
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
    createdProducts.push(prod);
  }

  // 4. Create Sample Orders for Admin View
  const defaultAddress = await prisma.address.findFirst({
    where: { userId: customer.id },
  });

  if (defaultAddress && createdProducts.length >= 3) {
    const existingOrder = await prisma.order.findFirst({
      where: { userId: customer.id },
    });

    if (!existingOrder) {
      await prisma.order.create({
        data: {
          userId: customer.id,
          addressId: defaultAddress.id,
          totalAmount: 18498.00,
          status: OrderStatus.CONFIRMED,
          idempotencyKey: 'seed-order-001',
          items: {
            create: [
              {
                productId: createdProducts[0].id,
                quantity: 1,
                unitPrice: createdProducts[0].price,
                subtotal: createdProducts[0].price,
              },
              {
                productId: createdProducts[2].id,
                quantity: 1,
                unitPrice: createdProducts[2].price,
                subtotal: createdProducts[2].price,
              },
            ],
          },
          payment: {
            create: {
              paymentGateway: 'RAZORPAY',
              razorpayOrderId: 'order_seed_rzp_01',
              razorpayPaymentId: 'pay_seed_rzp_01',
              razorpaySignature: 'sig_seed_01',
              amount: 18498.00,
              currency: 'INR',
              status: PaymentStatus.SUCCESS,
            },
          },
        },
      });

      await prisma.order.create({
        data: {
          userId: customer.id,
          addressId: defaultAddress.id,
          totalAmount: 3299.00,
          status: OrderStatus.SHIPPED,
          idempotencyKey: 'seed-order-002',
          items: {
            create: [
              {
                productId: createdProducts[1].id,
                quantity: 1,
                unitPrice: createdProducts[1].price,
                subtotal: createdProducts[1].price,
              },
            ],
          },
          payment: {
            create: {
              paymentGateway: 'RAZORPAY',
              razorpayOrderId: 'order_seed_rzp_02',
              razorpayPaymentId: 'pay_seed_rzp_02',
              razorpaySignature: 'sig_seed_02',
              amount: 3299.00,
              currency: 'INR',
              status: PaymentStatus.SUCCESS,
            },
          },
        },
      });
    }
  }

  console.log(`✅ Seed finished successfully! 24 Products, 4 Categories, and Orders created.`);
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
