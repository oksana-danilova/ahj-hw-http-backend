const Ticket = require("./Ticket");
const TicketFull = require("./TicketFull");
const Formatter = require("./getDate");

class TicketController {
  constructor(data) {
    this.data = data;
  }

  getAllTickets() {
    const short = this.data.map((e) => new Ticket(e))
    return short;
  }

  getTicketById(id) {
    if (this.data.some((e) => e.id === id)) {
      return this.data.find((e) => e.id === id);
    }
    throw new Error('Invalid ID');
  }

  changeStatus(id) {
    if (this.getTicketById(id)) {
      const ticket = this.getTicketById(id);
      ticket.status = !ticket.status;
      return { success: true };
    }
    return { success: false };
  }

  createTicket(name, description) {
    const ticket = new TicketFull(name, description)
    this.data.push(ticket);
    return this.getAllTickets()
  }
  
  editTicket(id, name, description) {
    if (this.getTicketById(id)) {
      const ticket = this.getTicketById(id);
      ticket.name = name;
      ticket.description = description;
      ticket.created = Formatter.getDate();
      return this.getAllTickets();
    }
  }

  deleteTicket(id) {
    if (this.getTicketById(id)) {
      const index = this.data.findIndex((e) => e.id === id);
      this.data.splice(index, 1);
      return this.getAllTickets();
    }
  }
}

module.exports = TicketController;
