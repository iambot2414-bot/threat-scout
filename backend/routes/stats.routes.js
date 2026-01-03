const express = require('express');
const router = express.Router();
const LookupStats = require('../models/LookupStats.model');

// Get stats
router.get('/', async (req, res) => {
  try {
    let stats = await LookupStats.findOne();
    
    if (!stats) {
      // Create default stats if none exist
      stats = await LookupStats.create({
        totalLookups: 0,
        threatsDetected: 0,
        criticalThreats: 0,
        activeSources: 3
      });
    }

    res.json({
      totalLookups: stats.totalLookups,
      threatsDetected: stats.threatsDetected,
      criticalThreats: stats.criticalThreats,
      activeSources: stats.activeSources
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Reset stats (for admin purposes)
router.post('/reset', async (req, res) => {
  try {
    await LookupStats.deleteMany({});
    const stats = await LookupStats.create({
      totalLookups: 0,
      threatsDetected: 0,
      criticalThreats: 0,
      activeSources: 3
    });
    res.json(stats);
  } catch (error) {
    console.error('Stats Reset Error:', error);
    res.status(500).json({ error: 'Failed to reset stats' });
  }
});

module.exports = router;
