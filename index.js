const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const sessionMiddleware = require('./middlewares/sessionMiddleware')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

const server = http.createServer(app)
const io = socketio(server)

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// session middleware
app.use(sessionMiddleware)

const fastFoods = {
  2: "Pizza",
  3: "Burger",
  4: "Chicken & Chips",
  5: "Smoothie",
}

const orderHistory = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});

io.on('connection', socket => {
  console.log('User connected')

  const deviceId = socket.handshake.headers["user-agent"]

  let user = "";
  socket.session = socket.request.session;
  console.log(socket.session)

  socket.emit('bot', 'What is your name?')

  socket.on("customer", (message) => {
    console.log("Customer message received:", message);

    if (!user) {
      user = message;
      socket.session.user = user
      socket.emit(
        "bot",
        `Welcome to the Meal-Chatter, ${user}!\n
          What would you like to do today?\n
          Select 1 to Place an order\n
          Select 99 to checkout order\n
          Select 98 to see order history\n
          Select 97 to see current order\n
          Select 0 to cancel order
        `
      );
    } else {
      switch (message) {
        case "1":
          const itemOptions = Object.entries(fastFoods)
            .map(([key, value]) => `${key}. ${value}`)
            .join("\n");
          socket.emit(
            "bot",
            `Here is a list of items you can order:\n${itemOptions}\n
            Please select one by typing its number.`
          );
          break;
        case "2":
        case "3":
        case "4":
        case "5":
          const selectedIndex = parseInt(message);
          if (fastFoods.hasOwnProperty(selectedIndex)) {
            const selectedItem = fastFoods[selectedIndex];
            socket.session.currentOrder = socket.session.currentOrder || [];
            socket.session.currentOrder.push(selectedItem);
            socket.emit(
              "bot",
              `${selectedItem} has been added to your order. Do you want to add more items to your order? Type numbers. If not, type 99 to checkout.`
            );
          } else {
            socket.emit("bot", "Invalid selection.");
          }
          break;
        case "99":
          if (
            socket.session.currentOrder &&
            socket.session.currentOrder.length
          ) {
            orderHistory.push(socket.session.currentOrder);
            socket.emit("bot", "Order placed");
            delete socket.session.currentOrder;
          } else {
            socket.emit(
              "bot",
              "No order to place. Place an order\n1. See menu"
            );
          }
          break;
        case "98":
          if (orderHistory.length) {
            const orderHistoryString = orderHistory
              .map((order, index) => `Order ${index + 1}: ${order.join(", ")}`)
              .join("\n");
            socket.emit(
              "bot",
              `Here is your order history:\n${orderHistoryString}`
            );
          } else {
            socket.emit("bot", "No previous orders");
          }
          break;
        case "97":
          if (
            socket.session.currentOrder &&
            socket.session.currentOrder.length
          ) {
            socket.emit(
              "bot",
              `Here is your current order: ${socket.session.currentOrder.join(
                ", "
              )}
                  Type 99 to checkout your order or 0 to cancel.`
            );
          } else {
            socket.emit(
              "bot",
              "No current order. Place an order\n1. See menu"
            );
          }
          break;
        case "0":
          if (
            socket.session.currentOrder &&
            socket.session.currentOrder.length
          ) {
            socket.emit("bot", "Order cancelled");
            delete socket.session.currentOrder;
          } else {
            socket.emit(
              "bot",
              "No current order to cancel. Place an order\n1. See menu"
            );
          }
          break;
        default:
          socket.emit("bot", "Invalid selection.");
          break;
      }
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})



server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))