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
    caFilePath = '/etc/ssl/certs/rds-combined-ca-bundle.pem', // path from volumeMount
  } = options;

  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST; // full host with port + query params

  if (!host) {
    console.error('❌ MONGO_HOST not set');
    return;
  }
  if (!username || !password) {
    console.error('❌ MONGO_USERNAME or MONGO_PASSWORD not set');
    return;
  }

  const connStr = `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}`;

  let sslCA;
  try {
    sslCA = fs.readFileSync(path.resolve(caFilePath));
    console.log('✅ Loaded CA file from', caFilePath);
  } catch (err) {
    console.error(`❌ Failed to read CA file at ${caFilePath}:`, err.message);
    return;
  }

  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslCA: [sslCA],
  };

  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      await mongoose.connect(connStr, connectionParams);
      console.log('✅ Connected to DocumentDB.');
      return;
    } catch (err) {
      console.error(`MongoDB connect attempt ${attempt}/${maxAttempts} failed:`, err.message);
      await wait(delay);
      delay = Math.min(60_000, Math.floor(delay * multiplier));
    }
  }

  console.error('⚠️ Could not connect to DocumentDB after maximum attempts');
};
