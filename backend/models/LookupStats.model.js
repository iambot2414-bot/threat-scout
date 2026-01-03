const mongoose = require('mongoose');

const LookupStatsSchema = new mongoose.Schema({
  totalLookups: { type: Number, default: 0 },
  threatsDetected: { type: Number, default: 0 },
  criticalThreats: { type: Number, default: 0 },
  activeSources: { type: Number, default: 3 }
}, { timestamps: true });

module.exports = mongoose.model('LookupStats', LookupStatsSchema);
