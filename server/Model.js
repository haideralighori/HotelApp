// model.js
const mongoose = require('mongoose');

const tableReservationSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
  },
  chairs: {
    type: [Number],
  },
  reservationDate: {
    type: Date,
    default: Date.now
  }
});

const TableReservation = mongoose.model('TableReservation', tableReservationSchema);

module.exports = TableReservation;
