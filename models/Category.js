import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    color: { type: String, default: 'None' },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
