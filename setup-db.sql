-- Create database for RPG Bot
CREATE DATABASE rpg_bot;

-- Create user with full access
CREATE USER rpg_bot_user WITH PASSWORD 'your_secure_password_here';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE rpg_bot TO rpg_bot_user;

-- Connect to the rpg_bot database
\c rpg_bot;

-- Grant all privileges on schema
GRANT ALL ON SCHEMA public TO rpg_bot_user;

-- Grant privileges on all current and future tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rpg_bot_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO rpg_bot_user;

-- Grant privileges on all current and future sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rpg_bot_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO rpg_bot_user;

-- Grant privileges on all current and future functions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO rpg_bot_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO rpg_bot_user;

-- Create database tables
-- Users table to store Discord user data
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    discord_id VARCHAR(20) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player profiles table for RPG data
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
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- weapon, armor, consumable, misc
    rarity VARCHAR(20) DEFAULT 'common', -- common, uncommon, rare, epic, legendary
    value INTEGER DEFAULT 0,
    stats JSONB, -- Store item stats as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player inventory table
CREATE TABLE IF NOT EXISTS player_inventory (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    equipped BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_discord_id ON users(discord_id);
CREATE INDEX IF NOT EXISTS idx_player_profiles_user_id ON player_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_player_inventory_user_id ON player_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);
CREATE INDEX IF NOT EXISTS idx_items_rarity ON items(rarity);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_player_profiles_updated_at ON player_profiles;
CREATE TRIGGER update_player_profiles_updated_at 
    BEFORE UPDATE ON player_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample items
INSERT INTO items (name, description, type, rarity, value, stats) VALUES
    ('Iron Sword', 'A sturdy iron sword suitable for beginners.', 'weapon', 'common', 50, '{"attack": 15, "durability": 100}'),
    ('Leather Armor', 'Basic leather armor providing minimal protection.', 'armor', 'common', 30, '{"defense": 8, "durability": 80}'),
    ('Health Potion', 'Restores 50 health points.', 'consumable', 'common', 25, '{"heal": 50}'),
    ('Dragon Scale', 'A rare scale from an ancient dragon.', 'misc', 'legendary', 1000, '{}')
ON CONFLICT (name) DO NOTHING;

-- Grant final permissions to the bot user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rpg_bot_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO rpg_bot_user;

-- Success message
\echo 'RPG Bot database setup completed successfully!'
\echo 'Database: rpg_bot'
\echo 'User: rpg_bot_user'
\echo 'Tables created: users, player_profiles, items, player_inventory'
\echo 'Sample items inserted: 4 items'
