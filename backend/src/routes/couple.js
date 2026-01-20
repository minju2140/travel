const express = require('express');
const prisma = require('../utils/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate random invite code
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create couple and generate invite code
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user is already in a couple
    const existingCouple = await prisma.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }]
      }
    });

    if (existingCouple) {
      return res.status(400).json({ error: 'Already in a couple' });
    }

    // Generate unique invite code
    let inviteCode;
    let isUnique = false;
    while (!isUnique) {
      inviteCode = generateInviteCode();
      const existing = await prisma.couple.findUnique({
        where: { inviteCode }
      });
      if (!existing) isUnique = true;
    }

    // Create couple with only user1
    const couple = await prisma.couple.create({
      data: {
        user1Id: userId,
        user2Id: userId, // Temporary, will be updated when partner joins
        inviteCode
      },
      include: {
        user1: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(201).json({ couple, inviteCode });
  } catch (error) {
    console.error('Create couple error:', error);
    res.status(500).json({ error: 'Failed to create couple' });
  }
});

// Join couple with invite code
router.post('/join', authenticateToken, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user.id;

    // Check if user is already in a couple
    const existingCouple = await prisma.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }]
      }
    });

    if (existingCouple && existingCouple.user1Id !== existingCouple.user2Id) {
      return res.status(400).json({ error: 'Already in a couple' });
    }

    // Find couple by invite code
    const couple = await prisma.couple.findUnique({
      where: { inviteCode }
    });

    if (!couple) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    if (couple.user1Id === userId) {
      return res.status(400).json({ error: 'Cannot join your own couple' });
    }

    // Update couple with user2
    const updatedCouple = await prisma.couple.update({
      where: { id: couple.id },
      data: { user2Id: userId },
      include: {
        user1: { select: { id: true, name: true, email: true } },
        user2: { select: { id: true, name: true, email: true } }
      }
    });

    res.json({ couple: updatedCouple });
  } catch (error) {
    console.error('Join couple error:', error);
    res.status(500).json({ error: 'Failed to join couple' });
  }
});

// Get my couple
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const couple = await prisma.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }]
      },
      include: {
        user1: { select: { id: true, name: true, email: true, avatarUrl: true } },
        user2: { select: { id: true, name: true, email: true, avatarUrl: true } }
      }
    });

    if (!couple) {
      return res.status(404).json({ error: 'No couple found' });
    }

    res.json({ couple });
  } catch (error) {
    console.error('Get couple error:', error);
    res.status(500).json({ error: 'Failed to get couple' });
  }
});

module.exports = router;
