import mongoose from 'mongoose';

const PlanTypeSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String },
}, { timestamps: true });

PlanTypeSchema.index({ serviceId: 1, slug: 1 }, { unique: true });

export default mongoose.models.PlanType || mongoose.model('PlanType', PlanTypeSchema);