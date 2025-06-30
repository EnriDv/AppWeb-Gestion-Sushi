const express = require('express');
const router = express.Router();
const { 
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation 
} = require('../controllers/reservation.controller');

router.get('/', getAllReservations);
router.get('/:id', getReservationById);
router.post('/', createReservation);
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);

module.exports = router;
