const mongoose = require('mongoose');

const ThreatSourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  detected: { type: Boolean, default: false },
  score: Number,
  details: String,
  lastSeen: String,
  categories: [String]
}, { _id: false });

const GeoLocationSchema = new mongoose.Schema({
  country: String,
  countryCode: String,
  city: String,
  region: String,
  asn: String,
  org: String,
  lat: Number,
  lon: Number
}, { _id: false });

const WhoisDataSchema = new mongoose.Schema({
  registrar: String,
  registrant: String,
  createdDate: String,
  expiresDate: String,
  updatedDate: String
}, { _id: false });

const IOCResultSchema = new mongoose.Schema({
  value: { type: String, required: true, index: true },
  type: { type: String, enum: ['ip', 'domain', 'hash', 'url'], required: true },
  threatScore: { type: Number, default: 0 },
  threatLevel: { type: String, enum: ['critical', 'high', 'medium', 'low', 'info'], default: 'info' },
  confidence: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'LOW' },
  sources: [ThreatSourceSchema],
  geo: GeoLocationSchema,
  whois: WhoisDataSchema,
  tags: [String],
  firstSeen: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  pulseCount: { type: Number, default: 0 },
  malwareFamilies: [String]
}, { timestamps: true });

// Create compound index for efficient lookups
IOCResultSchema.index({ value: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('IOCResult', IOCResultSchema);
