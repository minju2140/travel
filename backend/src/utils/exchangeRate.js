const axios = require('axios');
const prisma = require('./prisma');

// Cache for exchange rates (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Fallback rates if API fails
const FALLBACK_RATES = {
  'USD': 1300,
  'JPY': 10,
  'EUR': 1400,
  'CNY': 180,
  'GBP': 1600,
  'THB': 38,
  'VND': 0.05,
  'TWD': 42,
  'HKD': 165,
  'SGD': 950,
  'AUD': 850,
  'CAD': 950,
  'CHF': 1450,
  'KRW': 1
};

async function getExchangeRate(currency) {
  try {
    // Return 1 for KRW
    if (currency === 'KRW') {
      return 1;
    }

    // Check if we have cached rate
    const cached = await prisma.exchangeRate.findUnique({
      where: { currency }
    });

    if (cached) {
      const age = Date.now() - cached.fetchedAt.getTime();
      if (age < CACHE_DURATION) {
        return cached.rateToKrw;
      }
    }

    // Fetch new rate from API
    // Using exchangerate-api.com free tier
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${currency}`
    );

    // Calculate rate to KRW
    const usdToKrw = FALLBACK_RATES.USD;
    const currencyToUsd = 1;
    const usdToCurrency = response.data.rates.USD || 1;
    const rateToKrw = usdToKrw / usdToCurrency;

    // Save to database
    await prisma.exchangeRate.upsert({
      where: { currency },
      update: {
        rateToKrw,
        rateDate: new Date(),
        fetchedAt: new Date()
      },
      create: {
        currency,
        rateToKrw,
        rateDate: new Date(),
        fetchedAt: new Date()
      }
    });

    return rateToKrw;
  } catch (error) {
    console.error('Exchange rate fetch error:', error.message);
    
    // Return cached value if exists
    if (cached) {
      return cached.rateToKrw;
    }
    
    // Return fallback rate
    return FALLBACK_RATES[currency] || 1;
  }
}

async function getAllRates() {
  const currencies = Object.keys(FALLBACK_RATES);
  const rates = {};

  for (const currency of currencies) {
    try {
      rates[currency] = await getExchangeRate(currency);
    } catch (error) {
      rates[currency] = FALLBACK_RATES[currency];
    }
  }

  return rates;
}

module.exports = {
  getExchangeRate,
  getAllRates
};
