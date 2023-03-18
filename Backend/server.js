const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");
const app = require("./app");
const path = require("path");
const socket = require("socket.io");

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3001;
global.Services = path.resolve("./api/v1/Controllers/Services");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_Password);
const mongoose_options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
mongoose
  .connect(DB, mongoose_options)
  .then(() => console.log("DB connection successfully made"));

const server = http.createServer(app);

const running_server = server.listen(port, () => {
  console.log(`Node application is running on port ${port}`);
});

const io = socket(running_server, {
  cors: {
    origin: "*",
  },
});
//store all online users inside this map
let users = [];

const addUser = ({ name, id, online, userId, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const index = users.findIndex((user) => id === user.id && room === user.room);

  const user = { name, id, online, userId, room };
  if (index === -1) {
    users.push(user);
  }

  return { user };
};

const updateOffLineUser = (offLineId, NewUser) => {
  const index = users.findIndex((user) => user.id == offLineId);
  if (index != -1) {
    users[index] = NewUser;
  }
};

const disableOnline = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index != -1) {
    users[index].online = false;
    console.log("this is offline user", users[index]);
  }
};
const getUser = (id) => users.find((user) => id === user.id);
const getUsersInRoom = (room) => users.filter((user) => room === user.room);

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("join", ({ name, room, id }, callback) => {
    const offLineUsers =
      users.length !== 0 ? users.filter((user) => user.online === false) : [];
    if (offLineUsers.length === 0) {
      const usersLength = users.length;
      let userName = "human" + usersLength;
      const { user, error } = addUser({
        userid: id ? id : null,
        id: socket.id,
        name: userName,
        online: true,
        room,
      });

      if (error) return callback(error);

      io.to(user.id).emit("getCurrent", user);

      socket.join(user.room);

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback(user);
    } else {
      const offlineuser = offLineUsers[0];

      const user = {
        userid: id ? id : null,
        id: socket.id,
        name: offlineuser.name,
        room: offlineuser.room,
        online: true,
      };

      updateOffLineUser(offlineuser.id, user);
      io.to(user.id).emit("getCurrent", user);

      socket.join(user.room);

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback(user);
    }
  });

  socket.on("sendMessage", (data, callback) => {
    // console.log(users);
    const user = getUser(data.id);
    console.log(data.id);
    console.log("this is sending user", user);
    if (user) {
      socket.emit("message", {
        userId: data.userid,
        id: user.id,
        createdAt: new Date(),
        name: user.name,
        message: data.message,
        attachment: data.attachment,
      });
      // io.to(user.room).emit("roomData", {
      //   room: user.room,
      //   users: getUsersInRoom(user.room),
      // });
    }
    callback();
  });
  socket.on("disconnect", () => {
    disableOnline(socket.id);
  });
});

// process.on("unhandledRejection", (err) => {
//   console.log(err.name, err.message);
//   console.log("Unhadles Rejection", err);
//   running_server.close(() => {
//     process.exit(1);
//   });
// });
