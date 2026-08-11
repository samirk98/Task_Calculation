const express = require('express');
const prisma = require('../lib/prisma');
const authenticate = require('../middleware/auth');

const router = express.Router();

const VALID_CATEGORIES = ['programming', 'language'];

// Start a new session
router.post('/start', authenticate, async (req, res) => {
  try {
    const { category } = req.body;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: 'Category must be "programming" or "language".',
      });
    }

    // Enforce only one active session at a time
    const activeSession = await prisma.learningSession.findFirst({
      where: {
        userId: req.user.userId,
        finishedAt: null,
      },
    });

    if (activeSession) {
      return res.status(409).json({
        error: 'You already have an active session. Finish it before starting a new one.',
        activeSession,
      });
    }

    const session = await prisma.learningSession.create({
      data: {
        userId: req.user.userId,
        category,
        startedAt: new Date(),
      },
    });

    res.status(201).json({ session });
  } catch (err) {
    console.error('Start session error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Finish a session
router.post('/:id/finish', authenticate, async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);

    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID.' });
    }

    const session = await prisma.learningSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    // Verify ownership — never trust frontend userId
    if (session.userId !== req.user.userId) {
      return res.status(403).json({
        error: 'You do not have permission to modify this session.',
      });
    }

    if (session.finishedAt) {
      return res.status(409).json({ error: 'This session has already been finished.' });
    }

    const finishedAt = new Date();
    const duration = Math.floor(
      (finishedAt.getTime() - new Date(session.startedAt).getTime()) / 1000
    );

    if (duration < 0) {
      return res.status(400).json({ error: 'Invalid duration calculated.' });
    }

    const updatedSession = await prisma.learningSession.update({
      where: { id: sessionId },
      data: { finishedAt, duration },
    });

    res.json({ session: updatedSession });
  } catch (err) {
    console.error('Finish session error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// Get active session for the current user
router.get('/active', authenticate, async (req, res) => {
  try {
    const session = await prisma.learningSession.findFirst({
      where: {
        userId: req.user.userId,
        finishedAt: null,
      },
    });

    res.json({ session: session || null });
  } catch (err) {
    console.error('Get active session error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
