const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async function connectWithRetry(options = {}) {
  const {
    maxAttempts = 20,
    initialDelayMs = 2000,
    multiplier = 1.5,
    caFilePath = '/etc/ssl/certs/rds-combined-ca-bundle.pem',
  } = options;

  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST; // only host:port/db, no query params

  if (!host || !username || !password) {
    console.error('❌ Missing required MongoDB environment variables');
    return;
  }

  const connStr = `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}`;

  let sslCA;
  try {
    sslCA = fs.readFileSync(path.resolve(caFilePath));
    console.log('✅ Loaded CA file from', caFilePath);
  } catch (err) {
    console.error(`❌ Failed to read CA file:`, err.message);
    return;
  }

  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslCA: [sslCA],
    replicaSet: 'rs0',
    readPreference: 'secondaryPreferred',
    retryWrites: false,
    authMechanism: 'SCRAM-SHA-1',
  };

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      await mongoose.connect(connStr, connectionParams);
      console.log('✅ Connected to DocumentDB.');
      return;
    } catch (err) {
      console.error(`MongoDB connect attempt ${attempt}/${maxAttempts} failed:`, err.message);
      await wait(delay);
      delay = Math.min(60000, Math.floor(delay * multiplier));
    }
  }

  console.error('⚠️ Could not connect to DocumentDB after maximum attempts');
};
