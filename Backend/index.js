require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const AlphaRoutes = require('./routes/marketdataRoutes');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');

// const sectordata = require('./routes/sectordata')

const app = express();
const PORT = process.env.PORT;

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/AlphaVantage', AlphaRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', stockRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

connectDB();
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
