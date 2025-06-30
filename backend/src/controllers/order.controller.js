const { Order, OrderItem, User, Dish } = require('../models');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: OrderItem,
                    include: [{ model: Dish, attributes: ['id', 'name', 'price'] }]
                }
            ]
        });
        res.json(orders);
    } catch (err) {
        console.error(`Error fetching orders for user ${req.user.id}:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { 
                    model: OrderItem, 
                    include: [{ model: Dish, attributes: ['id', 'name', 'price'] }]
                }
            ]
        });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: `Order not found` });
        }
    } catch (err) {
        console.error(`Error fetching Order by ID:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const createOrder = async (req, res) => {
    const { items } = req.body;
    const user_id = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
            success: false,
            error: 'Se requiere al menos un ítem para crear la orden' 
        });
    }

    const { sequelize } = require('../models');
    const { Order, OrderItem, Dish } = sequelize.models;
    
    const transaction = await sequelize.transaction();

    try {
        // 1. Verificar que todos los platos existen y hay suficiente stock
        const orderItemsData = [];
        let totalAmount = 0;

        for (const item of items) {
            const dish = await Dish.findByPk(item.dish_id, { transaction });
            
            if (!dish) {
                throw new Error(`No se encontró el plato con ID: ${item.dish_id}`);
            }

            if (item.quantity <= 0) {
                throw new Error(`La cantidad para el plato ${dish.name} debe ser mayor a 0`);
            }

            const itemTotal = dish.price * item.quantity;
            totalAmount += itemTotal;

            orderItemsData.push({
                dish_id: dish.id,
                quantity: item.quantity,
                unit_price: dish.price
            });
        }

        // 2. Crear la orden
        const order = await Order.create({
            user_id,
            total_amount: totalAmount,
            status: 'pending',
            order_date: new Date()
        }, { transaction });

        // 3. Crear los ítems de la orden
        await Promise.all(
            orderItemsData.map(itemData => 
                OrderItem.create({
                    order_id: order.id,
                    ...itemData
                }, { transaction })
            )
        );

        // 4. Confirmar la transacción
        await transaction.commit();

        // 5. Obtener la orden completa con sus relaciones
        const orderWithDetails = await Order.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    attributes: ['id', 'dish_id', 'quantity', 'unit_price'],
                    include: [{
                        model: Dish,
                        attributes: ['id', 'name', 'description', 'price', 'image_url', 'category']
                    }]
                },
                {
                    model: sequelize.models.User,
                    attributes: ['id', 'name', 'email', 'phone_number', 'address']
                }
            ]
        });

        // 6. Formatear la respuesta según el esquema
        const response = {
            success: true,
            data: {
                id: orderWithDetails.id,
                user_id: orderWithDetails.user_id,
                total_amount: parseFloat(orderWithDetails.total_amount),
                status: orderWithDetails.status,
                order_date: orderWithDetails.order_date,
                order_items: orderWithDetails.OrderItems.map(item => ({
                    id: item.id,
                    dish_id: item.dish_id,
                    quantity: item.quantity,
                    unit_price: parseFloat(item.unit_price),
                    dish: item.Dish ? {
                        id: item.Dish.id,
                        name: item.Dish.name,
                        description: item.Dish.description,
                        price: parseFloat(item.Dish.price),
                        image_url: item.Dish.image_url,
                        category: item.Dish.category
                    } : null
                })),
                user: orderWithDetails.User
            }
        };

        res.status(201).json(response);

    } catch (error) {
        // Revertir la transacción en caso de error
        await transaction.rollback();
        console.error('Error al crear la orden:', error);
        
        const statusCode = error.message.includes('No se encontró') ? 404 : 500;
        
        res.status(statusCode).json({ 
            success: false,
            error: error.message || 'Error al procesar la orden'
        });
    }
};

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const [updatedRowsCount] = await Order.update({ status }, {
            where: { id: req.params.id },
        });
        if (updatedRowsCount > 0) {
            const updatedOrder = await Order.findByPk(req.params.id);
            res.json(updatedOrder);
        } else {
            res.status(404).json({ error: `Order not found or no changes made` });
        }
    } catch (err) {
        console.error(`Error updating Order status:`, err);
        res.status(400).json({ error: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deletedRowsCount = await Order.destroy({
            where: { id: req.params.id },
        });
        if (deletedRowsCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: `Order not found` });
        }
    } catch (err) {
        console.error(`Error deleting Order:`, err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};
