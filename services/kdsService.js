export const advanceTicketById = (tickets, id) => {
  const ticket = tickets.find((item) => item.id === Number(id));

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  const stageFlow = ['new', 'preparing', 'ready'];
  const index = stageFlow.indexOf(ticket.stage);
  ticket.stage = stageFlow[Math.min(index + 1, stageFlow.length - 1)];

  return ticket;
};

export const toggleTicketItemCheck = (tickets, ticketId, itemId) => {
  const ticket = tickets.find((item) => item.id === Number(ticketId));

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.statusCode = 404;
    throw error;
  }

  const item = ticket.items.find((entry) => entry.id === Number(itemId));
  if (!item) {
    const error = new Error('Item not found');
    error.statusCode = 404;
    throw error;
  }

  item.checked = !item.checked;
  return item;
};
