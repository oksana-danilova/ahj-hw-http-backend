const { v4: uuidv4 } = require('uuid');
const { getDate } = require('./getDate');

class TicketFull {
  constructor(name, description ) {
    this.id = uuidv4();
    this.name = name;
    this.description = description || '';
    this.status = false;
    this.created = getDate();
  }
}

module.exports = TicketFull;
