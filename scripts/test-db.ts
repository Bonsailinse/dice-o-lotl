import dotenv from 'dotenv';
import { testConnection } from '../src/config/database';
import { createTables, insertSampleItems } from '../src/database/migrations';

// Load environment variables
dotenv.config();

async function testDatabase() {
    console.log('🧪 Testing database connection and setup...\n');

    try {
        // Test connection
        console.log('1. Testing database connection...');
        const connected = await testConnection();
        if (!connected) {
            throw new Error('Failed to connect to database');
        }

        // Create tables
        console.log('2. Creating database tables...');
        await createTables();

        // Insert sample items
        console.log('3. Inserting sample items...');
        await insertSampleItems();

        console.log('\n✅ Database test completed successfully!');
        console.log('📋 Your database is ready for use.');
    } catch (error) {
        console.error('\n❌ Database test failed:', error);
        process.exit(1);
    }

    process.exit(0);
}

testDatabase();
