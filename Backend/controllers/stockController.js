const Stock = require('../models/mystocks');

// Add a new stock
const addStock = async (req, res) => {
    try {
        const { stockTicker, stockNo, stockPrice } = req.body;

        // Ensure userId is available
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        // Validate required fields
        if (!stockTicker || stockNo === undefined || stockPrice === undefined) {
            return res.status(400).json({ message: 'StockTicker, stockNo, and stockPrice are required' });
        }

        const newStock = new Stock({
            userId: req.user._id, // Use userId from req.user
            stockTicker: stockTicker.trim().toUpperCase(),
            stockNo: Number(stockNo),
            stockPrice: Number(stockPrice),
        });

        await newStock.save();
        res.status(201).json({ message: 'Stock added successfully', stock: newStock });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding stock', error: error.message });
    }
};


// Get all stocks for the authenticated user
const getUserStocks = async (req, res) => {
    try {
        const userId = req.user._id;  // Use directly instead of destructuring

        const stocks = await Stock.find({ userId });

        res.status(200).json(stocks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching stocks' });
    }
};

// Update a specific stock
const updateStock = async (req, res) => {
    try {
        const { userId } = req; // Assuming userId is passed directly
        const { id } = req.params; // Stock document ID
        const { stockNo, stockPrice } = req.body;   

        if (stockNo == null || stockPrice == null) {
            return res.status(400).json({ message: 'StockNo and stockPrice are required' });
        }

        const stock = await Stock.findOne({ _id: id, userId });

        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        stock.stockNo = stockNo;
        stock.stockPrice = stockPrice;

        await stock.save();
        res.status(200).json({ message: 'Stock updated successfully', stock });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating stock' });
    }
};

// Delete a specific stock
const deleteStock = async (req, res) => {
    try {
        const { userId } = req; // Assuming userId is passed directly
        const { id } = req.params; // Stock document ID

        const stock = await Stock.findOneAndDelete({ _id: id, userId });

        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        res.status(200).json({ message: 'Stock deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting stock' });
    }
};

module.exports = {
    addStock,
    getUserStocks,
    updateStock,
    deleteStock,
};
