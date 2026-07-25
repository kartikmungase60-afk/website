import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR' },
  period: { type: String, default: '/mo' },
  orderLink: { type: String },
  cpu: { type: String },
  cpuDetail: { type: String },
  ram: { type: String },
  ramDetail: { type: String },
  storage: { type: String },
  storageDetail: { type: String },
  bandwidth: { type: String },
  bandwidthDetail: { type: String },
  uptime: { type: String },
  allocations: { type: String },
  databases: { type: String },
  backups: { type: String },
  image: { type: String },
  features: [{ type: String }],
  outOfStock: { type: Boolean, default: false },
  badge: { type: String },
  locations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }]
}, { timestamps: true });

PlanSchema.index({ categoryId: 1, name: 1 }, { unique: true });

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);