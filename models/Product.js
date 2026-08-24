import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    initials: { type: String, default: '' },
    badgeColor: { type: String, default: '#14b8a6' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    active: { type: Boolean, default: true },
    price: { type: Number, required: true, min: 0 },
    sku: { type: String, default: '' },
    barcode: { type: String, default: '' },
    tags: [{ type: String }],
    imageUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
