/* eslint-disable prettier/prettier */
const express = require('express');
const apiRouter = require('./Routes/apiRouter');

const app = express();

// Api Endpoints

app.use('/api/v1', apiRouter);

module.exports = app;
