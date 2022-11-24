const express = require('express');
const app = express.Router();





const SKURouter = require('./API_SKU');
const SKUItemRouter = require('./API_SKUItem');
const SKUPositionRouter = require('./API_Position');
const SKUReturnOrderRouter = require('./API_ReturnOrder');
const ItemRouter = require('./API_Item');
const TestDescriptorRouter = require('./API_TestDescriptor');
const TestResultRouter = require('./API_TestResult');
const InternalOrderRouter = require('./API_InternalOrder');
const RestockOrderRouter = require('./API_RestockOrder')
const UserRouter = require('./API_User');

app.use('/', SKURouter);
app.use('/', SKUItemRouter);
app.use('/', SKUPositionRouter);
app.use('/', SKUReturnOrderRouter);
app.use('/', ItemRouter);
app.use('/', TestDescriptorRouter);
app.use('/', TestResultRouter);
app.use('/', InternalOrderRouter);
app.use('/', RestockOrderRouter);
app.use('/', UserRouter);

module.exports = app;
