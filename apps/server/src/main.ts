import http from "http";
import { web } from "./application/web";
import { Server } from "socket.io";
import initSocket from "./routes/socket";

const port = process.env.SERVER_PORT || 4000;

async function bootstrap() {
  /**
   * Add external services init as async operations (db, redis, etc...)
   * e.g.
   * await sequelize.authenticate()
   */
  return http.createServer(web).listen(port);
}

bootstrap()
  .then((server) => {
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    initSocket(io);
  })
  .catch((error) => {
    setImmediate(() => {
      console.error("Server Error:");
      console.error(error);
      process.exit();
    });
  });
