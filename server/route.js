// route.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/reserve', controller.reserveTable);

module.exports = router;
