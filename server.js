/* eslint-disable prettier/prettier */
require('dotenv').config({ path: './config.env' });
const app = require('./app');

const port = 3000;

// Starting Server
const server = app.listen(port, () => {
  console.log(`[+] Server started on Port ${port}`);
});
