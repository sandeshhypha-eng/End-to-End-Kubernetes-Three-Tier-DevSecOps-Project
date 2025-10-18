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
    caFilePath = '/etc/ssl/certs/rds-combined-ca-bundle.pem', // default path
  } = options;

  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const host = process.env.MONGO_HOST; // full host with port and query params

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
  } catch (err) {
    console.error(`❌ Failed to read CA file at ${caFilePath}:`, err.message);
    return;
  }

  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    sslCA: [sslCA], // wrap in array
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
      if (attempt >= maxAttempts) {
        console.error('⚠️ Max attempts reached; will continue retrying in background...');
        while (true) {
          try {
            await wait(delay);
            await mongoose.connect(connStr, connectionParams);
            console.log('✅ Connected to DocumentDB (after extended retries).');
            return;
          } catch (err2) {
            console.error('Extended retry failed:', err2.message);
            delay = Math.min(60_000, Math.floor(delay * multiplier));
          }
        }
      }
      await wait(delay);
      delay = Math.min(60_000, Math.floor(delay * multiplier));
    }
  }
};
