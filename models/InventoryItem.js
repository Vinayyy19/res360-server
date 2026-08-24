import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true },
    item: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'kg' }
  },
  { timestamps: true }
);

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

export default InventoryItem;
