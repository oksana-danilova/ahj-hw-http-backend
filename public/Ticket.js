class Ticket {
  constructor(ticket) {
    this.id = ticket.id;
    this.name = ticket.name;
    this.status = ticket.status;
    this.created = ticket.created;
  }
}

module.exports = Ticket;
