export const createOrderAndTicket = ({ orders, kdsTickets, payload }) => {
  const {
    table,
    items = [],
    total = 0,
    orderType = 'Dine-in',
    customerName = '',
    sendKitchen = true
  } = payload || {};

  if (!table || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Order must include a table and at least one item');
    error.statusCode = 400;
    throw error;
  }

  const newOrder = {
    id: `ORD-${Date.now()}`,
    table,
    orderType,
    total: Number(total),
    status: 'Preparing',
    items: items.length,
    customerName,
    createdAt: new Date().toISOString()
  };

  let createdTicket = null;

  if (sendKitchen) {
    const nextTicketId = kdsTickets.length > 0 ? Math.max(...kdsTickets.map((ticket) => ticket.id)) + 1 : 101;
    createdTicket = {
      id: nextTicketId,
      ticketNo: `#KOT-${nextTicketId}`,
      orderType: orderType === 'delivery' ? 'Delivery' : orderType === 'pickup' ? 'Takeaway' : 'Dine-in',
      location: table || 'Takeaway',
      stage: 'new',
      startTime: Date.now(),
      items: items.map((item, index) => ({
        id: index + 1,
        name: item.name,
        qty: Number(item.qty) || 1,
        checked: false
      })),
      notes: customerName ? `Customer: ${customerName}` : 'New order from POS'
    };
  }

  return { order: newOrder, ticket: createdTicket };
};
