import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  planTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlanType', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
}, { timestamps: true });

CategorySchema.index({ planTypeId: 1, slug: 1 }, { unique: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);