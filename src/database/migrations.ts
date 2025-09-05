import { query } from '../config/database';

export const createTables = async (): Promise<void> => {
    try {
        console.log('Creating database tables...');

        // Users table to store Discord user data
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        discord_id VARCHAR(20) UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
        display_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Player profiles table for RPG data
        await query(`
      CREATE TABLE IF NOT EXISTS player_profiles (
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

        // Items table
        await query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL, -- weapon, armor, consumable, misc
        rarity VARCHAR(20) DEFAULT 'common', -- common, uncommon, rare, epic, legendary
        value INTEGER DEFAULT 0,
        stats JSONB, -- Store item stats as JSON
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Player inventory table
        await query(`
      CREATE TABLE IF NOT EXISTS player_inventory (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1,
        equipped BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, item_id)
      )
    `);

        // Create indexes for better performance
        await query('CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id)');
        await query(
            'CREATE INDEX IF NOT EXISTS idx_player_profiles_user_id ON player_profiles(user_id)'
        );
        await query(
            'CREATE INDEX IF NOT EXISTS idx_player_inventory_user_id ON player_inventory(user_id)'
        );
        await query('CREATE INDEX IF NOT EXISTS idx_items_type ON items(type)');
        await query('CREATE INDEX IF NOT EXISTS idx_items_rarity ON items(rarity)');

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

        // Create triggers for updated_at
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

        console.log('Database tables created successfully!');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
};

export const insertSampleItems = async (): Promise<void> => {
    try {
        console.log('Inserting sample items...');

        const sampleItems = [
            {
                name: 'Iron Sword',
                description: 'A sturdy iron sword suitable for beginners.',
                type: 'weapon',
                rarity: 'common',
                value: 50,
                stats: { attack: 15, durability: 100 },
            },
            {
                name: 'Leather Armor',
                description: 'Basic leather armor providing minimal protection.',
                type: 'armor',
                rarity: 'common',
                value: 30,
                stats: { defense: 8, durability: 80 },
            },
            {
                name: 'Health Potion',
                description: 'Restores 50 health points.',
                type: 'consumable',
                rarity: 'common',
                value: 25,
                stats: { heal: 50 },
            },
            {
                name: 'Dragon Scale',
                description: 'A rare scale from an ancient dragon.',
                type: 'misc',
                rarity: 'legendary',
                value: 1000,
                stats: {},
            },
        ];

        for (const item of sampleItems) {
            await query(
                `
        INSERT INTO items (name, description, type, rarity, value, stats)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT DO NOTHING
      `,
                [
                    item.name,
                    item.description,
                    item.type,
                    item.rarity,
                    item.value,
                    JSON.stringify(item.stats),
                ]
            );
        }

        console.log('Sample items inserted successfully!');
    } catch (error) {
        console.error('Error inserting sample items:', error);
        throw error;
    }
};
