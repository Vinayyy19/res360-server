import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    table: { type: String, default: 'Takeaway' },
    status: { type: String, enum: ['Pending', 'Preparing', 'Served', 'Completed'], default: 'Pending' },
    total: { type: Number, required: true, default: 0 },
    itemsCount: { type: Number, default: 0 },
    items: [orderItemSchema]
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
