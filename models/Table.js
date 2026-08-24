import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    tableId: { type: String, required: true, unique: true },
    floor: { type: String, default: 'Ground Floor' },
    seats: { type: Number, default: 4 },
    status: { type: String, enum: ['available', 'occupied', 'reserved', 'billing', 'cleaning'], default: 'available' }
  },
  { timestamps: true }
);

const Table = mongoose.model('Table', tableSchema);

export default Table;
