const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stockTicker: { type: String, required: true },
    stockNo: { type: Number, required: true },
    stockPrice: { type: Number, required: true },
}, { timestamps: true }); // Adds 'createdAt' and 'updatedAt'

module.exports = mongoose.model('Stock', stockSchema);
