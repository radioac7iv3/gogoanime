/* eslint-disable prettier/prettier */
const app = require('./app');

const port = process.env.default_port || 3000;

// Starting Server
const server = app.listen(port, () => {
  console.log(`[+] Server started on Port ${port}`);
});
