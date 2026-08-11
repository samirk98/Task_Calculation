const express = require('express');
const prisma = require('../lib/prisma');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Start of today (UTC)
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    // 14 days ago from start of today
    const fourteenDaysAgo = new Date(startOfToday);
    fourteenDaysAgo.setUTCDate(fourteenDaysAgo.getUTCDate() - 14);

    // Run all aggregations in parallel for performance
    const [
      programmingResult,
      languageResult,
      todayResult,
      last14DaysResult,
      allTimeResult,
    ] = await Promise.all([
      // Programming total — all completed programming sessions
      prisma.learningSession.aggregate({
        where: {
          userId,
          category: 'programming',
          finishedAt: { not: null },
        },
        _sum: { duration: true },
      }),

      // Language total — all completed language sessions
      prisma.learningSession.aggregate({
        where: {
          userId,
          category: 'language',
          finishedAt: { not: null },
        },
        _sum: { duration: true },
      }),

      // Today — all completed sessions started today
      prisma.learningSession.aggregate({
        where: {
          userId,
          finishedAt: { not: null },
          startedAt: { gte: startOfToday },
        },
        _sum: { duration: true },
      }),

      // Past 14 days — all completed sessions in the last 2 weeks
      prisma.learningSession.aggregate({
        where: {
          userId,
          finishedAt: { not: null },
          startedAt: { gte: fourteenDaysAgo },
        },
        _sum: { duration: true },
      }),

      // All time — every completed session ever
      prisma.learningSession.aggregate({
        where: {
          userId,
          finishedAt: { not: null },
        },
        _sum: { duration: true },
      }),
    ]);

    res.json({
      programmingTotal: programmingResult._sum.duration || 0,
      languageTotal: languageResult._sum.duration || 0,
      todayTotal: todayResult._sum.duration || 0,
      last14DaysTotal: last14DaysResult._sum.duration || 0,
      allTimeTotal: allTimeResult._sum.duration || 0,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
