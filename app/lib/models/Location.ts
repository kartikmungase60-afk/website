import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  flagUrl: { type: String },
  region: { type: String },
  outOfStock: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model('Location', LocationSchema);