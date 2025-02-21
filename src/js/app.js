const Koa = require("koa");
const cors = require("koa-cors");
const koaBody = require("koa-body"); // Не вызываем здесь
const uuid = require("uuid");

const app = new Koa();
const port = process.env.PORT || 7070;

let tickets = [
  {
    id: "123-456-789",
    name: "Test ticket with description",
    description: "This is a test ticket description",
    status: true,
    created: new Date().toLocaleString(),
  },
  {
    id: "987-654-321",
    name: "Test ticket without description",
    description: "",
    status: false,
    created: new Date().toLocaleString(),
  },
];

// Middleware для обработки ошибок
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message };
    ctx.app.emit("error", err, ctx);
  }
});

// Middleware для парсинга тела запроса
app.use(
  koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
  })
);

// Middleware для CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(async (ctx) => {
  ctx.response.body = `server response at port ${port}`;
  const { method } = ctx.request.query;
  switch (method) {
    case "allTickets":
      ctx.response.body = tickets;
      return;

    case "ticketById":
      const ticketById = tickets.find(
        (ticket) => ticket.id === ctx.request.query.id
      );
      ctx.response.body = ticketById
        ? ticketById.description
        : "Ticket not found";
      return;

    case "createTicket":
      const newTicketId = uuid.v4();
      const formData = ctx.request.body;
      formData.id = newTicketId;
      formData.status = formData.status === "true"; // Преобразование строки в булевое значение
      tickets.push(formData);
      return;

    case "changeTicketStatus":
      const ticketToChange = tickets.find(
        (ticket) => ticket.id === ctx.request.body.id
      );
      if (!ticketToChange) return;
      ticketToChange.status = ctx.request.body.status;
      return;

    case "removeTicket":
      tickets = tickets.filter((ticket) => ticket.id !== ctx.request.body.id);
      return;

    case "editTicket":
      const { id, name, description, status } = ctx.request.body;
      const ticketToEdit = tickets.find((ticket) => ticket.id === id);
      if (ticketToEdit) {
        ticketToEdit.name = name;
        ticketToEdit.description = description;
        ticketToEdit.status = status;
      }
      return;

    default:
      ctx.response.body = "Invalid method";
      return;
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
