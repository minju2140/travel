const express = require('express');
const { getExchangeRate, getAllRates } = require('../utils/exchangeRate');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get specific currency rate
router.get('/:currency', authenticateToken, async (req, res) => {
  try {
    const { currency } = req.params;
    const rate = await getExchangeRate(currency);
    
    res.json({ currency, rate });
  } catch (error) {
    console.error('Get exchange rate error:', error);
    res.status(500).json({ error: 'Failed to get exchange rate' });
  }
});

// Get all rates
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rates = await getAllRates();
    res.json({ rates });
  } catch (error) {
    console.error('Get all rates error:', error);
    res.status(500).json({ error: 'Failed to get exchange rates' });
  }
});

module.exports = router;
