const express = require('express');
const prisma = require('../utils/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all trips for user's couple
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's couple
    const couple = await prisma.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }]
      }
    });

    if (!couple) {
      return res.json({ trips: [] });
    }

    // Get all trips for the couple
    const trips = await prisma.trip.findMany({
      where: { coupleId: couple.id },
      include: {
        _count: {
          select: { expenses: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate total KRW for each trip
    const tripsWithTotals = await Promise.all(
      trips.map(async (trip) => {
        const expenses = await prisma.expense.findMany({
          where: { tripId: trip.id }
        });
        const totalKrw = expenses.reduce((sum, exp) => sum + exp.krwAmount, 0);
        return { ...trip, totalKrw };
      })
    );

    res.json({ trips: tripsWithTotals });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Failed to get trips' });
  }
});

// Create new trip
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, startDate, endDate, countries } = req.body;

    // Get user's couple
    const couple = await prisma.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }]
      }
    });

    if (!couple) {
      return res.status(400).json({ error: 'Must be in a couple to create trip' });
    }

    // Create trip
    const trip = await prisma.trip.create({
      data: {
        coupleId: couple.id,
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        countries: JSON.stringify(countries || [])
      }
    });

    // Add couple members as trip members
    // Check if user1 and user2 are different (partner has joined)
    const memberData = [
      { tripId: trip.id, userId: couple.user1Id, role: 'member' }
    ];
    
    // Only add user2 if different from user1 (partner has joined)
    if (couple.user1Id !== couple.user2Id) {
      memberData.push({ tripId: trip.id, userId: couple.user2Id, role: 'member' });
    }
    
    await prisma.tripMember.createMany({
      data: memberData
    });

    res.status(201).json({ trip });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Get single trip
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        couple: {
          include: {
            user1: { select: { id: true, name: true, email: true } },
            user2: { select: { id: true, name: true, email: true } }
          }
        },
        _count: {
          select: { expenses: true }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check if user is part of this trip
    const isMember = await prisma.tripMember.findFirst({
      where: { tripId: id, userId }
    });

    if (!isMember) {
      return res.status(403).json({ error: 'Not authorized to view this trip' });
    }

    res.json({ trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Failed to get trip' });
  }
});

// Update trip
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate, countries, isActive } = req.body;

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(countries && { countries: JSON.stringify(countries) }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({ trip });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// Delete trip
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.trip.delete({ where: { id } });

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// Get trip statistics
router.get('/:id/statistics', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const expenses = await prisma.expense.findMany({
      where: { tripId: id },
      include: {
        user: { select: { id: true, name: true } }
      }
    });

    // Calculate statistics
    const totalKrw = expenses.reduce((sum, exp) => sum + exp.krwAmount, 0);
    
    const byCategory = expenses.reduce((acc, exp) => {
      if (!acc[exp.category]) {
        acc[exp.category] = 0;
      }
      acc[exp.category] += exp.krwAmount;
      return acc;
    }, {});

    const byUser = expenses.reduce((acc, exp) => {
      if (!acc[exp.userId]) {
        acc[exp.userId] = {
          name: exp.user.name,
          total: 0,
          self: 0,
          shared: 0
        };
      }
      acc[exp.userId].total += exp.krwAmount;
      if (exp.payerType === 'self') {
        acc[exp.userId].self += exp.krwAmount;
      } else if (exp.payerType === 'shared') {
        acc[exp.userId].shared += exp.krwAmount;
      }
      return acc;
    }, {});

    const byDate = expenses.reduce((acc, exp) => {
      const date = new Date(exp.expenseDate).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += exp.krwAmount;
      return acc;
    }, {});

    res.json({
      totalKrw,
      byCategory,
      byUser,
      byDate,
      expenseCount: expenses.length
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Get settlement calculation
router.get('/:id/settlement', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        couple: {
          include: {
            user1: { select: { id: true, name: true } },
            user2: { select: { id: true, name: true } }
          }
        }
      }
    });

    const expenses = await prisma.expense.findMany({
      where: { tripId: id }
    });

    const user1Id = trip.couple.user1Id;
    const user2Id = trip.couple.user2Id;

    let user1Paid = 0;
    let user2Paid = 0;
    let sharedTotal = 0;

    expenses.forEach(exp => {
      if (exp.payerType === 'self') {
        if (exp.userId === user1Id) {
          user1Paid += exp.krwAmount;
        } else {
          user2Paid += exp.krwAmount;
        }
      } else if (exp.payerType === 'shared') {
        sharedTotal += exp.krwAmount;
        if (exp.userId === user1Id) {
          user1Paid += exp.krwAmount;
        } else {
          user2Paid += exp.krwAmount;
        }
      }
    });

    // Calculate fair share
    const sharedPerPerson = sharedTotal / 2;
    const user1ShouldPay = sharedPerPerson;
    const user2ShouldPay = sharedPerPerson;

    const user1SharedPaid = expenses
      .filter(e => e.userId === user1Id && e.payerType === 'shared')
      .reduce((sum, e) => sum + e.krwAmount, 0);
    
    const user2SharedPaid = expenses
      .filter(e => e.userId === user2Id && e.payerType === 'shared')
      .reduce((sum, e) => sum + e.krwAmount, 0);

    // Settlement calculation
    const user1Balance = user1SharedPaid - user1ShouldPay;
    const user2Balance = user2SharedPaid - user2ShouldPay;

    let settlement = {
      user1: {
        id: user1Id,
        name: trip.couple.user1.name,
        totalPaid: user1Paid,
        sharedPaid: user1SharedPaid,
        shouldPayShared: user1ShouldPay,
        balance: user1Balance
      },
      user2: {
        id: user2Id,
        name: trip.couple.user2.name,
        totalPaid: user2Paid,
        sharedPaid: user2SharedPaid,
        shouldPayShared: user2ShouldPay,
        balance: user2Balance
      },
      message: ''
    };

    if (Math.abs(user1Balance) < 100) {
      settlement.message = '정산이 완료되었습니다!';
    } else if (user1Balance > 0) {
      settlement.message = `${trip.couple.user2.name}님이 ${trip.couple.user1.name}님에게 ${Math.abs(user1Balance).toLocaleString()}원을 보내야 합니다.`;
    } else {
      settlement.message = `${trip.couple.user1.name}님이 ${trip.couple.user2.name}님에게 ${Math.abs(user1Balance).toLocaleString()}원을 보내야 합니다.`;
    }

    res.json({ settlement });
  } catch (error) {
    console.error('Get settlement error:', error);
    res.status(500).json({ error: 'Failed to calculate settlement' });
  }
});

module.exports = router;
