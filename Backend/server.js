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

const addUser = ({ name, id, online, userid, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const index = users.findIndex((user) => id === user.id && room === user.room);

  const user = { name, id, online, userid, room };
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
  }
};
const getUser = (id) => users.find((user) => id === user.id);
const getUserWithId = (id) => users.find((user) => user.userid === id);

const getUsersInRoom = (room) => users.filter((user) => room === user.room);

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("join", ({ name, room, id, userId, isLogin }, callback) => {
    const offLineUsers =
      users.length !== 0 ? users.filter((user) => user.online === false) : [];
    if (offLineUsers.length === 0) {
      const usersLength = users.length;
      let userName = "human" + usersLength;
      const { user, error } = addUser({
        userid: isLogin ? userId : null,
        id: socket.id,
        name: isLogin ? name : userName,
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
        userid: isLogin ? userId : null,
        id: socket.id,
        name: isLogin ? name : offlineuser.name,
        online: true,
        room,
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

  socket.on("sendMessagePrivate", (data, callback) => {
    const user = getUser(data.id);
    const client = getUserWithId(data.client._id);

    if (client) {
      io.to(client.id).emit("sendPrivateMessageToClient", data);
    }
    if (data.userid) {
      io.to(data.id).emit("sendPrivateMessageToUser", data);
    } else {
      data.user = user;
      data.userid = user.id;
      io.to(data.id).emit("sendPrivateMessageToUser", data);
    }

    callback();
  });
  socket.on("sendMessage", (data, callback) => {
    // console.log(users);
    const user = getUser(data.id);

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
