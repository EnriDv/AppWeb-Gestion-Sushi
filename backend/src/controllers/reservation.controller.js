const { Reservation } = require('../models');

const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.json(reservations);
    } catch (err) {
        console.error(`Error fetching all Reservations:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (reservation) {
            res.json(reservation);
        } else {
            res.status(404).json({ error: `Reservation not found` });
        }
    } catch (err) {
        console.error(`Error fetching Reservation by ID:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const createReservation = async (req, res) => {
    try {
        const newReservation = await Reservation.create(req.body);
        res.status(201).json(newReservation);
    } catch (err) {
        console.error(`Error creating Reservation:`, err);
        res.status(400).json({ error: err.message });
    }
};

const updateReservation = async (req, res) => {
    try {
        const [updatedRowsCount] = await Reservation.update(req.body, {
            where: { id: req.params.id },
        });
        if (updatedRowsCount > 0) {
            const updatedReservation = await Reservation.findByPk(req.params.id);
            res.json(updatedReservation);
        } else {
            res.status(404).json({ error: `Reservation not found or no changes made` });
        }
    } catch (err) {
        console.error(`Error updating Reservation:`, err);
        res.status(400).json({ error: err.message });
    }
};

const deleteReservation = async (req, res) => {
    try {
        const deletedRowsCount = await Reservation.destroy({
            where: { id: req.params.id },
        });
        if (deletedRowsCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: `Reservation not found` });
        }
    } catch (err) {
        console.error(`Error deleting Reservation:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
};
