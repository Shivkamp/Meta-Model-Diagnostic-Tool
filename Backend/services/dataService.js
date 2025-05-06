const axios = require('axios');

const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const api_sector = process.env.SECTOR_API_KEY


//home
const top_gainers_losers = async () => {
  try {
      const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
          params: {
              function : "TOP_GAINERS_LOSERS",
              apikey: ALPHA_VANTAGE_API_KEY,
          },
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching data from Alpha Vantage:", error.message);
      throw new Error("Failed to fetch data from Alpha Vantage.");
  }
};

const fetchSectorData = async () => {
  try {
      const response = await axios.get("https://financialmodelingprep.com/api/v3/sectors-performance", {
          params: {
              apikey: api_sector,
          },
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching sector data:", error.message);
      throw new Error("Failed to fetch sector data.");
  }
};


// Function to fetch historical stock data from Alpha Vantage
const getHistoricalData = async (ticker, functionType = 'TIME_SERIES_DAILY') => {
    const url = `${ALPHA_VANTAGE_BASE_URL}?function=${functionType}&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data[`Time Series (Daily)`]) {
            return response.data[`Time Series (Daily)`];
        } else if (response.data && response.data[`Time Series (Intraday)`]) {
            return response.data[`Time Series (Intraday)`];
        } else {
            throw new Error('Invalid response from Alpha Vantage');
        }
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
    }
};

//dashboard



module.exports = { top_gainers_losers, fetchSectorData, getHistoricalData };
