import { query } from '../config/database';

export const fixUsersTable = async (): Promise<void> => {
    try {
        console.log('🔧 Fixing users table structure...');

        // Drop the existing users table and recreate with correct structure
        await query('DROP TABLE IF EXISTS player_inventory CASCADE');
        await query('DROP TABLE IF EXISTS player_profiles CASCADE');
        await query('DROP TABLE IF EXISTS users CASCADE');

        console.log('✅ Dropped existing tables');

        // Recreate users table with correct structure
        await query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                discord_id VARCHAR(20) UNIQUE NOT NULL,
                username VARCHAR(100) NOT NULL,
                display_name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Recreate player_profiles table
        await query(`
            CREATE TABLE player_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                level INTEGER DEFAULT 1,
                experience INTEGER DEFAULT 0,
                health INTEGER DEFAULT 100,
                max_health INTEGER DEFAULT 100,
                mana INTEGER DEFAULT 50,
                max_mana INTEGER DEFAULT 50,
                strength INTEGER DEFAULT 10,
                defense INTEGER DEFAULT 10,
                agility INTEGER DEFAULT 10,
                intelligence INTEGER DEFAULT 10,
                gold INTEGER DEFAULT 100,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id)
            )
        `);

        // Recreate player_inventory table
        await query(`
            CREATE TABLE player_inventory (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
                quantity INTEGER DEFAULT 1,
                equipped BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, item_id)
            )
        `);

        // Recreate indexes
        await query('CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id)');
        await query(
            'CREATE INDEX IF NOT EXISTS idx_player_profiles_user_id ON player_profiles(user_id)'
        );
        await query(
            'CREATE INDEX IF NOT EXISTS idx_player_inventory_user_id ON player_inventory(user_id)'
        );

        // Recreate triggers
        await query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
            CREATE TRIGGER update_users_updated_at 
                BEFORE UPDATE ON users 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);

        await query(`
            DROP TRIGGER IF EXISTS update_player_profiles_updated_at ON player_profiles;
            CREATE TRIGGER update_player_profiles_updated_at 
                BEFORE UPDATE ON player_profiles 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);

        console.log('✅ Users table structure fixed');
    } catch (error) {
        console.error('❌ Error fixing users table:', error);
        throw error;
    }
};
