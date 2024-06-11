const app = require("./src/app");
const config = require("./src/configs/config.mongodb");

const port = config.app.port;

const server = app.listen(port, () => {
  console.log(`wsv eCommerce start with ${port}`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log(`Exit Server Express`));
//   // notify.send(ping ...)
// });
