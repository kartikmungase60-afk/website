import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  heroImage: { type: String },
  accentColor: { type: String },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);