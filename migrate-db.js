const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(process.cwd(), 'auth.db');
const db = new Database(dbPath);

console.log('Checking database tables at:', dbPath);

try {
    // Create tables if they don't exist (Better Auth standard schema)
    db.exec(`
        CREATE TABLE IF NOT EXISTS user (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            emailVerified BOOLEAN NOT NULL,
            image TEXT,
            createdAt DATETIME NOT NULL,
            updatedAt DATETIME NOT NULL
        );

        CREATE TABLE IF NOT EXISTS session (
            id TEXT PRIMARY KEY,
            expiresAt DATETIME NOT NULL,
            token TEXT NOT NULL UNIQUE,
            createdAt DATETIME NOT NULL,
            updatedAt DATETIME NOT NULL,
            ipAddress TEXT,
            userAgent TEXT,
            userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS account (
            id TEXT PRIMARY KEY,
            accountId TEXT NOT NULL,
            providerId TEXT NOT NULL,
            userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
            accessToken TEXT,
            refreshToken TEXT,
            idToken TEXT,
            accessTokenExpiresAt DATETIME,
            refreshTokenExpiresAt DATETIME,
            scope TEXT,
            password TEXT,
            createdAt DATETIME NOT NULL,
            updatedAt DATETIME NOT NULL
        );

        CREATE TABLE IF NOT EXISTS verification (
            id TEXT PRIMARY KEY,
            identifier TEXT NOT NULL,
            value TEXT NOT NULL,
            expiresAt DATETIME NOT NULL,
            createdAt DATETIME,
            updatedAt DATETIME
        );
    `);
    
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Current tables:', tables.map(t => t.name).join(', '));
    console.log('Migration completed successfully!');
} catch (err) {
    console.error('Error during migration:', err);
} finally {
    db.close();
}
