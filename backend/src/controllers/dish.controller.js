const { Dish } = require('../models');

/**
 * Obtener todos los platos.
 */
const getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.findAll();
        res.json(dishes);
    } catch (err) {
        console.error(`Error fetching all Dishes:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Obtener un plato por su ID.
 */
const getDishById = async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id);
        if (dish) {
            res.json(dish);
        } else {
            res.status(404).json({ error: `Dish not found` });
        }
    } catch (err) {
        console.error(`Error fetching Dish by ID:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Crear un nuevo plato.
 */
const createDish = async (req, res) => {
    try {
        const newDish = await Dish.create(req.body);
        res.status(201).json(newDish);
    } catch (err) {
        console.error(`Error creating Dish:`, err);
        res.status(400).json({ error: err.message });
    }
};

/**
 * Actualizar un plato por su ID.
 */
const updateDish = async (req, res) => {
    try {
        const [updatedRowsCount] = await Dish.update(req.body, {
            where: { id: req.params.id },
        });
        if (updatedRowsCount > 0) {
            const updatedDish = await Dish.findByPk(req.params.id);
            res.json(updatedDish);
        } else {
            res.status(404).json({ error: `Dish not found or no changes made` });
        }
    } catch (err) {
        console.error(`Error updating Dish:`, err);
        res.status(400).json({ error: err.message });
    }
};

/**
 * Eliminar un plato por su ID.
 */
const deleteDish = async (req, res) => {
    try {
        const deletedRowsCount = await Dish.destroy({
            where: { id: req.params.id },
        });
        if (deletedRowsCount > 0) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).json({ error: `Dish not found` });
        }
    } catch (err) {
        console.error(`Error deleting Dish:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllDishes,
    getDishById,
    createDish,
    updateDish,
    deleteDish,
};
