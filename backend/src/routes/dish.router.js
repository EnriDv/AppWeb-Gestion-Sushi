const express = require('express');
const router = express.Router();
const { 
    getAllDishes,
    getDishById,
    createDish,
    updateDish,
    deleteDish 
} = require('../controllers/dish.controller');

router.get('/', getAllDishes);

router.get('/:id', getDishById);

router.post('/', createDish);

router.put('/:id', updateDish);

router.delete('/:id', deleteDish);

module.exports = router;
