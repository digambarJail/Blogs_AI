import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  status:   { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Article = mongoose.model('Article', articleSchema);
