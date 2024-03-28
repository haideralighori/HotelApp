const TableReservation = require('./Model');

exports.reserveTable = async (req, res) => {
  try {
    const reservations = req.body;
    const savedReservations = await TableReservation.insertMany(reservations);
    res.status(201).json(savedReservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
