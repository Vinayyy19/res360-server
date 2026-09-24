import KdsTicket from "../models/KdsTicket.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";


/*
  Create a KDS ticket for an order.

  Flow:

  Order
    ↓
  KDS Ticket
    ↓
  New
    ↓
  Preparing
    ↓
  Ready
*/

const createKdsTicket = async ({
  order,
  orderItems = [],
}) => {
  if (!order) {
    throw new Error("Order is required");
  }

  /*
    Generate ticket number.
    Example:
    KOT-1001
  */
  const count = await KdsTicket.countDocuments();

  const ticketNo = `KOT-${1001 + count}`;

  /*
    Convert OrderItems into KDS items.
  */
  const kdsItems = [];

  for (const orderItem of orderItems) {
    let product = null;

    if (orderItem.menuItemId) {
      product = await Product.findById(
        orderItem.menuItemId
      );
    }

    kdsItems.push({
      itemId: orderItem._id?.toString(),
      name: product?.name || "Menu Item",
      quantity: orderItem.quantity || 1,
      checked: false,
    });
  }

  /*
    Create KDS ticket.
  */
  const ticket = await KdsTicket.create({
    ticketNo,

    orderType: order.table === "Takeaway"
      ? "Takeaway"
      : "Dine-in",

    location: order.table || "Takeaway",

    stage: "new",

    startTime: new Date(),

    notes: "",

    items: kdsItems,
  });

  /*
    Attach KDS ticket reference to Order if your
    Order model later supports it.

    We intentionally don't require that field here,
    so this works with your current Order model.
  */

  return ticket;
};


/*
  Move KDS ticket through:

  new
    ↓
  preparing
    ↓
  ready
*/

const advanceTicketById = async (ticketId) => {
  const ticket = await KdsTicket.findById(ticketId);

  if (!ticket) {
    throw new Error("KDS ticket not found");
  }

  if (ticket.stage === "new") {
    ticket.stage = "preparing";
  } else if (ticket.stage === "preparing") {
    ticket.stage = "ready";
  } else if (ticket.stage === "ready") {
    /*
      Already at final stage.
    */
    return ticket;
  }

  await ticket.save();

  /*
    Update related Order status when possible.
  */
  if (ticket.orderId) {
    const order = await Order.findById(ticket.orderId);

    if (order) {
      if (ticket.stage === "preparing") {
        order.status = "Preparing";
      }

      if (ticket.stage === "ready") {
        order.status = "Served";
      }

      await order.save();
    }
  }

  return ticket;
};


/*
  Check / uncheck an individual KDS item.
*/
const toggleTicketItemCheck = async (
  ticketId,
  itemId
) => {
  const ticket = await KdsTicket.findById(ticketId);

  if (!ticket) {
    throw new Error("KDS ticket not found");
  }

  if (!Array.isArray(ticket.items)) {
    throw new Error("This KDS ticket has no items");
  }

  /*
    Find item.

    We support both:
      item._id
      item.itemId

    because your existing KDS schema may use either.
  */
  const item = ticket.items.find(
    (currentItem) =>
      currentItem._id?.toString() === itemId.toString() ||
      currentItem.itemId?.toString() === itemId.toString()
  );

  if (!item) {
    throw new Error("KDS item not found");
  }

  item.checked = !item.checked;

  await ticket.save();

  return ticket;
};


export {
  createKdsTicket,
  advanceTicketById,
  toggleTicketItemCheck,
};

export default {
  createKdsTicket,
  advanceTicketById,
  toggleTicketItemCheck,
};