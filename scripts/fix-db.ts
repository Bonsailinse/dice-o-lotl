import dotenv from 'dotenv';
import { testConnection } from '../src/config/database';
import { fixUsersTable } from '../src/database/fixTables';
import { insertSampleItems } from '../src/database/migrations';

// Load environment variables
dotenv.config();

async function fixDatabase() {
    console.log('🔧 Fixing database table structure...\n');

    try {
        // Test connection
        console.log('1. Testing database connection...');
        const connected = await testConnection();
        if (!connected) {
            throw new Error('Failed to connect to database');
        }

        // Fix table structure
        console.log('2. Fixing table structure...');
        await fixUsersTable();

        // Insert sample items again
        console.log('3. Reinserting sample items...');
        await insertSampleItems();

        console.log('\n✅ Database fix completed successfully!');
        console.log('📋 Your database is now ready with the correct structure.');
    } catch (error) {
        console.error('\n❌ Database fix failed:', error);
        process.exit(1);
    }

    process.exit(0);
}

fixDatabase();
