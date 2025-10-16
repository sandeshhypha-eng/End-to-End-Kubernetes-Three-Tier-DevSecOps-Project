const mongoose = require('mongoose');

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async function connectWithRetry(options = {}) {
    const {
        maxAttempts = 20,
        initialDelayMs = 2000,
        multiplier = 1.5,
    } = options;

    const connStr = process.env.MONGO_CONN_STR;
    if (!connStr) {
        console.error('MONGO_CONN_STR not set');
        return;
    }

    const connectionParams = {
        // Mongoose v6 ignores these but harmless to include
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    const useDBAuth = !!process.env.USE_DB_AUTH && process.env.USE_DB_AUTH !== 'false';
    if (useDBAuth) {
        connectionParams.user = process.env.MONGO_USERNAME;
        connectionParams.pass = process.env.MONGO_PASSWORD;
    }

    let attempt = 0;
    let delay = initialDelayMs;
    while (attempt < maxAttempts) {
        attempt += 1;
        try {
            await mongoose.connect(connStr, connectionParams);
            console.log('Connected to database.');
            return;
        } catch (err) {
            console.error(`MongoDB connect attempt ${attempt}/${maxAttempts} failed:`, err && err.message ? err.message : err);
            if (attempt >= maxAttempts) {
                console.error('Max MongoDB connection attempts reached; will keep trying in background.');
                // continue to try indefinitely but with long delays to avoid hot loops
                // fallback: try forever with a long delay
                while (true) {
                    try {
                        await wait(delay);
                        await mongoose.connect(connStr, connectionParams);
                        console.log('Connected to database (after extended retries).');
                        return;
                    } catch (err2) {
                        console.error('Extended retry failed:', err2 && err2.message ? err2.message : err2);
                        // increase delay but cap it
                        delay = Math.min(60_000, Math.floor(delay * multiplier));
                    }
                }
            }
            await wait(delay);
            delay = Math.min(60_000, Math.floor(delay * multiplier));
        }
    }
};
