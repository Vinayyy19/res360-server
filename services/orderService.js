import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import Bill from "../models/Bill.js";

/*
  Create an order and its related order items + bill.

  Flow:

  POS
   ↓
  Order
   ↓
  OrderItem(s)
   ↓
  Bill
*/

const createOrder = async ({
  restaurantId,
  tableId = null,
  userId = null,
  table = "Takeaway",
  items = [],
  taxRate = 0,
  discount = 0,
}) => {
  if (!restaurantId) {
    throw new Error("restaurantId is required");
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("At least one order item is required");
  }

  /*
    Get all products from MongoDB.
  */
  const productIds = items.map((item) => item.productId || item.menuItemId);

  const products = await Product.find({
    _id: { $in: productIds },
    restaurantId,
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products were not found");
  }

  /*
    Create order ID.
    Example: ORD-1001
  */
  const count = await Order.countDocuments();

  const orderId = `ORD-${1001 + count}`;

  /*
    Calculate order items.
  */
  const orderItemsData = [];

  let subtotal = 0;
  let itemsCount = 0;

  for (const item of items) {
    const productId = item.productId || item.menuItemId;

    const product = products.find(
      (p) => p._id.toString() === productId.toString()
    );

    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    const quantity = Number(item.quantity || 1);
    const price = Number(product.price || 0);
    const itemSubtotal = price * quantity;

    subtotal += itemSubtotal;
    itemsCount += quantity;

    orderItemsData.push({
      menuItemId: product._id,
      quantity,
      price,
      subtotal: itemSubtotal,
    });
  }

  /*
    Calculate tax.
  */
  const tax = (subtotal * Number(taxRate || 0)) / 100;

  /*
    Calculate final amount.
  */
  const totalAmount =
    subtotal + tax - Number(discount || 0);

  /*
    Create the Order first.
  */
  const order = await Order.create({
    orderId,
    restaurantId,
    tableId,
    userId,
    table,
    status: "Pending",
    total: totalAmount,
    itemsCount,
  });

  /*
    Attach Order ID to each OrderItem.
  */
  const orderItems = orderItemsData.map((item) => ({
    ...item,
    orderId: order._id,
  }));

  /*
    Create OrderItems.
  */
  const createdOrderItems =
    await OrderItem.insertMany(orderItems);

  /*
    Create Bill.
  */
  const bill = await Bill.create({
    orderId: order._id,
    restaurantId,
    subtotal,
    tax,
    discount: Number(discount || 0),
    totalAmount,
    status: "generated",
  });

  /*
    Return everything required by the API.
  */
  return {
    order,
    orderItems: createdOrderItems,
    bill,
  };
};


/*
  Existing function name used by your apiController.js.

  This function creates:
    Order
    OrderItems
    Bill
    KDS Ticket

  KDS creation is handled separately so the
  order service remains responsible for order data.
*/
const createOrderAndTicket = async (payload, createKdsTicket) => {
  const result = await createOrder(payload);

  let ticket = null;

  if (typeof createKdsTicket === "function") {
    ticket = await createKdsTicket({
      order: result.order,
      orderItems: result.orderItems,
    });
  }

  return {
    ...result,
    ticket,
  };
};


export {
  createOrder,
  createOrderAndTicket,
};

export default {
  createOrder,
  createOrderAndTicket,
};