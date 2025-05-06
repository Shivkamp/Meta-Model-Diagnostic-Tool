const express = require('express');
const { top_gainers_losers, fetchSectorData, getHistoricalData } = require('../services/dataService');
const { AppError, handleError } = require('../utils/errorHandler');
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY

const router = express.Router();
const axios = require('axios');


router.get("/top-gainers-losers", async (req, res) => {
  const { symbol } = req.params;

  try {
      const data = await top_gainers_losers();
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


// setInterval(fetchSectorData, 300000);
router.get("/sector-performance", async (req, res) => {
    try {
        const data = await fetchSectorData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });

// Route to handle frontend requests
router.get('/historical-data', async (req, res) => {
  const { ticker, functionType } = req.query;
  
  if (!ticker) {
      return res.status(400).json({ error: 'Ticker symbol is required' });
  }

  const functionToUse = functionType || 'TIME_SERIES_DAILY';

  try {
      const data = await getHistoricalData(ticker, functionToUse);
      res.json({ symbol: ticker, functionType: functionToUse, historical: data });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Route to fetch current stock price
router.get("/currentprice", async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote`,
      {
        params: {
          symbol,
          token: FINNHUB_API_KEY,
        },
      }
    );

    const { c: currentPrice } = response.data; // `c` represents the current price
    res.json({ currentPrice });
  } catch (error) {
    console.error("Error fetching stock price:", error.message);
    res.status(500).json({ error: "Failed to fetch stock price" });
  }
});


// // Route to fetch stock data
// router.get('/stock/:symbol', async (req, res, next) => {
//   try {
//     const { symbol } = req.params;
//     const data = await getStockData(symbol);
    
//     if (!data) {
//       handleError(`No data found for symbol: ${symbol}`, 404);
//     }

//     res.json(data);
//   } catch (error) {
//     if (error.response && error.response.status === 404) {
//       // Handle specific API not found error
//       error.message = `Stock data not found for symbol: ${req.params.symbol}`;
//       error.status = 404;
//     } else if (error.code === 'ENOTFOUND' || error.message.includes('Network Error')) {
//       // Handle network-related errors
//       error.message = 'Network error: Unable to reach Finnhub service';
//       error.status = 503; // Service Unavailable
//     } else {
//       error.message = 'Internal server error';
//       error.status = 500;
//     }
//     next(error);
//   }
// });



// Use the error handler middleware
router.use((err, req, res, next) => {
  if (!err.status) {
    // Log unexpected errors
    console.error(err);
  }
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
});

module.exports = router;
