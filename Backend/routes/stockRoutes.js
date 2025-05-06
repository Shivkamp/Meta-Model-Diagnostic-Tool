const express = require('express');
const stockController = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a stock
router.post('/addstock', protect, stockController.addStock);

// Get all stocks
router.get('/getstocks', protect, stockController.getUserStocks);

// Update a stock
router.put('/updatestocks/:id', protect, stockController.updateStock);

// Delete a stock
router.delete('/deletestock/:id', protect, stockController.deleteStock);

module.exports = router;
