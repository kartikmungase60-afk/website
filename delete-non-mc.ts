import mongoose from 'mongoose';
import Plan from './app/lib/models/Plan';
import Category from './app/lib/models/Category';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  
  // Find Minecraft category
  const mcCategory = await Category.findOne({ name: { $regex: /Minecraft/i } });
  
  if (mcCategory) {
    const result = await Plan.deleteMany({ categoryId: { $ne: mcCategory._id } });
    console.log(`Deleted ${result.deletedCount} non-Minecraft plans.`);
  } else {
    console.log("Minecraft category not found! Deleting all plans instead if requested. Let's see.");
  }
  
  await mongoose.disconnect();
}

run().catch(console.error);
