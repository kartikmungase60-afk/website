const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'app', 'lib', 'models');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const models = {
  'Service.ts': `import mongoose from 'mongoose';\n\nconst ServiceSchema = new mongoose.Schema({\n  name: { type: String, required: true, unique: true },\n  slug: { type: String, required: true, unique: true },\n  description: { type: String },\n  heroImage: { type: String },\n  accentColor: { type: String },\n}, { timestamps: true });\n\nexport default mongoose.models.Service || mongoose.model('Service', ServiceSchema);`,
  'Location.ts': `import mongoose from 'mongoose';\n\nconst LocationSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  slug: { type: String, required: true, unique: true },\n  flagUrl: { type: String },\n  region: { type: String },\n  outOfStock: { type: Boolean, default: false },\n}, { timestamps: true });\n\nexport default mongoose.models.Location || mongoose.model('Location', LocationSchema);`,
  'PlanType.ts': `import mongoose from 'mongoose';\n\nconst PlanTypeSchema = new mongoose.Schema({\n  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },\n  name: { type: String, required: true },\n  slug: { type: String, required: true },\n  image: { type: String },\n}, { timestamps: true });\n\nPlanTypeSchema.index({ serviceId: 1, slug: 1 }, { unique: true });\n\nexport default mongoose.models.PlanType || mongoose.model('PlanType', PlanTypeSchema);`,
  'Category.ts': `import mongoose from 'mongoose';\n\nconst CategorySchema = new mongoose.Schema({\n  planTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlanType', required: true },\n  name: { type: String, required: true },\n  slug: { type: String, required: true },\n}, { timestamps: true });\n\nCategorySchema.index({ planTypeId: 1, slug: 1 }, { unique: true });\n\nexport default mongoose.models.Category || mongoose.model('Category', CategorySchema);`,
  'Plan.ts': `import mongoose from 'mongoose';\n\nconst PlanSchema = new mongoose.Schema({\n  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },\n  name: { type: String, required: true },\n  slug: { type: String, required: true },\n  price: { type: Number, required: true, min: 0 },\n  currency: { type: String, default: 'INR' },\n  period: { type: String, default: '/mo' },\n  orderLink: { type: String },\n  cpu: { type: String },\n  cpuDetail: { type: String },\n  ram: { type: String },\n  ramDetail: { type: String },\n  storage: { type: String },\n  storageDetail: { type: String },\n  bandwidth: { type: String },\n  bandwidthDetail: { type: String },\n  uptime: { type: String },\n  features: [{ type: String }],\n  outOfStock: { type: Boolean, default: false },\n  badge: { type: String },\n  locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]\n}, { timestamps: true });\n\nPlanSchema.index({ categoryId: 1, name: 1 }, { unique: true });\n\nexport default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);`
};

for (const [file, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(dir, file), content);
}
console.log('Models created successfully.');
