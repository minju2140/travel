const express = require('express');
const prisma = require('../utils/prisma');
const { authenticateToken } = require('../middleware/auth');
const { getExchangeRate } = require('../utils/exchangeRate');

const router = express.Router();

// Get all expenses for a trip
router.get('/trip/:tripId', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.params;

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { expenseDate: 'desc' }
    });

    res.json({ expenses });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to get expenses' });
  }
});

// Create expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      tripId,
      title,
      amount,
      currency,
      category,
      payerType,
      memo,
      expenseDate
    } = req.body;

    // Get exchange rate
    const exchangeRate = await getExchangeRate(currency);
    const krwAmount = amount * exchangeRate;

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        tripId,
        userId,
        title,
        amount: parseFloat(amount),
        currency,
        krwAmount,
        exchangeRate,
        category,
        payerType,
        memo: memo || null,
        expenseDate: new Date(expenseDate || Date.now())
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    // Emit socket event for real-time sync
    const io = req.app.get('io');
    io.to(`trip-${tripId}`).emit('expense:created', expense);

    res.status(201).json({ expense });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update expense
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      amount,
      currency,
      category,
      payerType,
      memo,
      expenseDate
    } = req.body;

    // Get current expense
    const currentExpense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!currentExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Calculate new exchange rate if currency or amount changed
    let exchangeRate = currentExpense.exchangeRate;
    let krwAmount = currentExpense.krwAmount;

    if (currency && currency !== currentExpense.currency) {
      exchangeRate = await getExchangeRate(currency);
      krwAmount = (amount || currentExpense.amount) * exchangeRate;
    } else if (amount && amount !== currentExpense.amount) {
      krwAmount = amount * exchangeRate;
    }

    // Update expense
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(amount && { amount: parseFloat(amount), krwAmount }),
        ...(currency && { currency, exchangeRate, krwAmount }),
        ...(category && { category }),
        ...(payerType && { payerType }),
        ...(memo !== undefined && { memo }),
        ...(expenseDate && { expenseDate: new Date(expenseDate) })
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(`trip-${expense.tripId}`).emit('expense:updated', expense);

    res.json({ expense });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await prisma.expense.delete({ where: { id } });

    // Emit socket event
    const io = req.app.get('io');
    io.to(`trip-${expense.tripId}`).emit('expense:deleted', { id });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;
