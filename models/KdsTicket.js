import mongoose from 'mongoose';

const kdsItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    checked: { type: Boolean, default: false }
  },
  { _id: false }
);

const kdsTicketSchema = new mongoose.Schema(
  {
    ticketNo: { type: String, required: true, unique: true },
    orderType: { type: String, default: 'Dine-in' },
    location: { type: String, default: 'Table T1' },
    stage: { type: String, enum: ['new', 'preparing', 'ready'], default: 'new' },
    startTime: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    orderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Order",
  default: null
},
    items: [kdsItemSchema]
  },
  { timestamps: true }
);

const KdsTicket = mongoose.model('KdsTicket', kdsTicketSchema);

export default KdsTicket;
