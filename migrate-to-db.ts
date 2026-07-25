// @ts-nocheck
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Import Mongoose Models (ensure they are properly loaded)
import dbConnect from './app/lib/mongoose';
import Service from './app/lib/models/Service';
import PlanType from './app/lib/models/PlanType';
import Category from './app/lib/models/Category';
import Plan from './app/lib/models/Plan';
import Location from './app/lib/models/Location';

const configDir = path.join(process.cwd(), 'app', 'config', 'sections');

async function migrateLocations(locationsData: any[]) {
  const locMap = {};
  for (const loc of locationsData) {
    let location = await Location.findOne({ slug: loc.id });
    if (!location) {
      location = await Location.create({
        name: loc.name,
        slug: loc.id,
        flagUrl: loc.flag,
        outOfStock: Boolean(loc.outOfStock)
      });
    } else {
      location.outOfStock = Boolean(loc.outOfStock);
      await location.save();
    }
    locMap[loc.id] = location._id;
  }
  return locMap;
}

async function migrateGames() {
  const raw = fs.readFileSync(path.join(configDir, 'games.json'), 'utf8');
  const data = JSON.parse(raw);

  const service = await Service.findOneAndUpdate(
    { slug: 'game-hosting' },
    { name: 'Game Hosting', slug: 'game-hosting', description: data.header.description },
    { upsert: true, new: true }
  );

  const locMap = await migrateLocations(data.locations);

  for (const game of data.games) {
    // Only keep Minecraft Java Budget as requested by user
    if (game.id === 'minecraft') {
      const planType = await PlanType.findOneAndUpdate(
        { serviceId: service._id, slug: game.id },
        { serviceId: service._id, name: game.name, slug: game.id, image: game.icon },
        { upsert: true, new: true }
      );

      for (const [categoryKey, plans] of Object.entries(game.plans)) {
        if (categoryKey !== 'budget') continue; // Remove Premium

        const category = await Category.findOneAndUpdate(
          { planTypeId: planType._id, slug: categoryKey },
          { planTypeId: planType._id, name: 'Budget', slug: categoryKey },
          { upsert: true, new: true }
        );

        for (const p of plans) {
          const price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : Number(p.price);
          
          await Plan.findOneAndUpdate(
            { categoryId: category._id, name: p.name },
            {
              categoryId: category._id,
              name: p.name,
              slug: p.id,
              price: price || 0,
              currency: 'INR',
              period: '/mo',
              orderLink: p.orderLink,
              cpu: p.cpu,
              cpuDetail: 'Cores',
              ram: p.ram,
              ramDetail: 'RAM',
              storage: p.storage,
              storageDetail: 'NVMe SSD',
              outOfStock: Boolean(p.outOfStock),
              locations: data.locations.filter(l => l.availablePlanTypes?.includes(categoryKey)).map(l => locMap[l.id])
            },
            { upsert: true }
          );
        }
      }
    } else {
      // For Hytale, Palworld etc.
      const planType = await PlanType.findOneAndUpdate(
        { serviceId: service._id, slug: game.id },
        { serviceId: service._id, name: game.name, slug: game.id, image: game.icon },
        { upsert: true, new: true }
      );

      for (const [categoryKey, plans] of Object.entries(game.plans)) {
        const category = await Category.findOneAndUpdate(
          { planTypeId: planType._id, slug: categoryKey },
          { planTypeId: planType._id, name: categoryKey, slug: categoryKey },
          { upsert: true, new: true }
        );

        for (const p of plans) {
          const price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : Number(p.price);
          
          await Plan.findOneAndUpdate(
            { categoryId: category._id, name: p.name },
            {
              categoryId: category._id,
              name: p.name,
              slug: p.id || p.name.toLowerCase().replace(/\\s+/g, '-'),
              price: price || 0,
              currency: 'INR',
              orderLink: p.orderLink,
              cpu: p.cpu,
              ram: p.ram,
              storage: p.storage,
              outOfStock: Boolean(p.outOfStock),
              locations: data.locations.map(l => locMap[l.id])
            },
            { upsert: true }
          );
        }
      }
    }
  }
  console.log('Migrated Game Hosting');
}

async function migrateVps() {
  const raw = fs.readFileSync(path.join(configDir, 'vps.json'), 'utf8');
  const data = JSON.parse(raw);

  const service = await Service.findOneAndUpdate(
    { slug: 'vps-hosting' },
    { name: 'VPS Hosting', slug: 'vps-hosting', description: data.header.description },
    { upsert: true, new: true }
  );

  const locMap = await migrateLocations(data.locations);

  for (const pType of data.planTypes) {
    const planType = await PlanType.findOneAndUpdate(
      { serviceId: service._id, slug: pType.id },
      { serviceId: service._id, name: pType.name, slug: pType.id, image: pType.image },
      { upsert: true, new: true }
    );

    const category = await Category.findOneAndUpdate(
      { planTypeId: planType._id, slug: 'default' },
      { planTypeId: planType._id, name: 'Default', slug: 'default' },
      { upsert: true, new: true }
    );

    const plans = data.plans[pType.id] || [];
    for (const p of plans) {
      const price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : Number(p.price);
      await Plan.findOneAndUpdate(
        { categoryId: category._id, name: p.name },
        {
          categoryId: category._id,
          name: p.name,
          slug: p.id,
          price: price || 0,
          currency: 'USD',
          period: p.period,
          orderLink: p.orderLink,
          cpu: p.cpu,
          cpuDetail: p.cpuDetail,
          ram: p.ram,
          ramDetail: p.ramDetail,
          storage: p.storage,
          storageDetail: p.storageDetail,
          bandwidth: p.bandwidth,
          bandwidthDetail: p.bandwidthDetail,
          outOfStock: Boolean(p.outOfStock),
          locations: data.locations.filter(l => l.availableCpus?.includes(pType.id)).map(l => locMap[l.id])
        },
        { upsert: true }
      );
    }
  }
  console.log('Migrated VPS Hosting');
}

async function run() {
  await dbConnect();
  console.log('Connected to DB');
  try {
    await migrateGames();
    await migrateVps();
    // Discord, Web and Dedicated can be migrated similarly.
    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
