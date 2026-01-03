const express = require('express');
const router = express.Router();
const IOCResult = require('../models/IOCResult.model');
const LookupStats = require('../models/LookupStats.model');
const threatIntelService = require('../services/threatIntel.service');

// Lookup IOC
router.post('/lookup', async (req, res) => {
  try {
    const { value, type } = req.body;

    if (!value || !type) {
      return res.status(400).json({ error: 'Value and type are required' });
    }

    // Check if we have a recent cached result (within 1 hour)
    const cachedResult = await IOCResult.findOne({
      value: value.toLowerCase(),
      type,
      lastSeen: { $gte: new Date(Date.now() - 3600000) }
    });

    if (cachedResult) {
      // Update lastSeen
      cachedResult.lastSeen = new Date();
      await cachedResult.save();
      
      return res.json({
        ...cachedResult.toObject(),
        id: cachedResult._id,
        cached: true
      });
    }

    // Perform fresh analysis
    const analysisResult = await threatIntelService.analyzeIOC(value.toLowerCase(), type);

    // Save or update in database
    const savedResult = await IOCResult.findOneAndUpdate(
      { value: value.toLowerCase(), type },
      analysisResult,
      { upsert: true, new: true }
    );

    // Update stats
    await updateStats(analysisResult.threatLevel);

    res.json({
      ...savedResult.toObject(),
      id: savedResult._id,
      cached: false
    });

  } catch (error) {
    console.error('Lookup Error:', error);
    res.status(500).json({ error: 'Failed to analyze IOC' });
  }
});

// Get recent lookups
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const results = await IOCResult.find()
      .sort({ lastSeen: -1 })
      .limit(limit)
      .lean();

    res.json(results.map(r => ({ ...r, id: r._id })));
  } catch (error) {
    console.error('Recent Lookups Error:', error);
    res.status(500).json({ error: 'Failed to fetch recent lookups' });
  }
});

// Get IOC by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await IOCResult.findById(req.params.id).lean();
    if (!result) {
      return res.status(404).json({ error: 'IOC not found' });
    }
    res.json({ ...result, id: result._id });
  } catch (error) {
    console.error('Get IOC Error:', error);
    res.status(500).json({ error: 'Failed to fetch IOC' });
  }
});

// Helper function to update stats
async function updateStats(threatLevel) {
  try {
    let stats = await LookupStats.findOne();
    if (!stats) {
      stats = new LookupStats();
    }

    stats.totalLookups += 1;
    if (threatLevel !== 'info' && threatLevel !== 'low') {
      stats.threatsDetected += 1;
    }
    if (threatLevel === 'critical') {
      stats.criticalThreats += 1;
    }

    await stats.save();
  } catch (error) {
    console.error('Stats Update Error:', error);
  }
}

module.exports = router;
