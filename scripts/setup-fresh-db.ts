import { query } from '../src/config/database';

/**
 * Fresh database setup script with constitution column
 * This will drop existing tables and recreate them with the new schema
 */
export async function setupFreshDatabase(): Promise<void> {
    console.log('Setting up fresh database with constitution column...');

    try {
        // Drop existing tables in correct order (respect foreign keys)
        await query('DROP TABLE IF EXISTS player_inventory CASCADE');
        await query('DROP TABLE IF EXISTS items CASCADE');
        await query('DROP TABLE IF EXISTS player_profiles CASCADE');
        await query('DROP TABLE IF EXISTS users CASCADE');
        console.log('✓ Dropped existing tables');

        // Create users table
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
        console.log('✓ Created users table');

        // Create player_profiles table with constitution
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
                constitution INTEGER DEFAULT 10,
                agility INTEGER DEFAULT 10,
                intelligence INTEGER DEFAULT 10,
                gold INTEGER DEFAULT 100,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id)
            )
        `);
        console.log('✓ Created player_profiles table with constitution');

        // Create items table
        await query(`
            CREATE TABLE items (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                type VARCHAR(50) NOT NULL,
                rarity VARCHAR(20) DEFAULT 'common',
                value INTEGER DEFAULT 0,
                stats JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Created items table');

        // Create player_inventory table
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
        console.log('✓ Created player_inventory table');

        // Create indexes
        await query('CREATE INDEX idx_users_discord_id ON users(discord_id)');
        await query('CREATE INDEX idx_player_profiles_user_id ON player_profiles(user_id)');
        await query('CREATE INDEX idx_player_inventory_user_id ON player_inventory(user_id)');
        await query('CREATE INDEX idx_items_type ON items(type)');
        await query('CREATE INDEX idx_items_rarity ON items(rarity)');
        console.log('✓ Created indexes');

        // Create updated_at trigger function
        await query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql'
        `);

        // Create triggers
        await query(`
            CREATE TRIGGER update_users_updated_at 
                BEFORE UPDATE ON users 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);

        await query(`
            CREATE TRIGGER update_player_profiles_updated_at 
                BEFORE UPDATE ON player_profiles 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);
        console.log('✓ Created triggers');

        // Insert sample items with constitution stats
        await query(`
            INSERT INTO items (name, description, type, rarity, value, stats) VALUES
            ('Iron Sword', 'A sturdy iron sword suitable for beginners.', 'weapon', 'common', 50, '{"attack": 15, "durability": 100}'),
            ('Leather Armor', 'Basic leather armor providing minimal protection.', 'armor', 'common', 30, '{"constitution": 8, "durability": 80}'),
            ('Health Potion', 'Restores 50 health points.', 'consumable', 'common', 25, '{"heal": 50}'),
            ('Dragon Scale', 'A rare scale from an ancient dragon.', 'misc', 'legendary', 1000, '{}')
        `);
        console.log('✓ Inserted sample items with constitution stats');

        console.log('✅ Fresh database setup completed successfully!');
    } catch (error) {
        console.error('❌ Fresh database setup failed:', error);
        throw error;
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupFreshDatabase()
        .then(() => {
            console.log('Fresh database setup script completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Fresh database setup script failed:', error);
            process.exit(1);
        });
}
