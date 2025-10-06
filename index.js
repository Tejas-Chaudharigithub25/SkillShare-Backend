
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors");
const conn = require("./config/db");

const userRouter = require("./routes/userRouter"); 
const postRouter = require("./routes/postRouter"); 
const skillRouter = require("./routes/skillRouter"); 
const commentsRouter = require("./routes/commentsRouter"); 
const messageRouter = require("./routes/messageRouter"); 
const reviewRouter = require("./routes/reviewRouter"); 
const notificationRouter = require("./routes/notificationRouter"); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Expose uploads folder
app.use('/uploads', express.static('uploads'));

// Add io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database called
conn();

/* User routes */
app.use("/api/user", userRouter);
app.use("/api/user", postRouter);
app.use("/api/user", skillRouter);
app.use("/api/user", commentsRouter);
app.use("/api/user", messageRouter);
app.use("/api/user", reviewRouter);
app.use("/api/user", notificationRouter);

/* Skill routes Admin*/
app.use("/api/admin", skillRouter); // Corrected router name



// Socket.IO connection
io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId); // Join room for private message
    console.log(`${userId} joined room.`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something broke!" });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
