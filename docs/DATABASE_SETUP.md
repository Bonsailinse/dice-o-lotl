# Database Setup Guide

This guide explains how to set up and connect a PostgreSQL database to the RPG Bot project.

## Prerequisites

- PostgreSQL server running (in this case at `172.22.2.7`)
- Node.js environment with the required dependencies installed

## Database Setup

### 1. Database and User Creation

The project includes a SQL script (`setup-db.sql`) that creates:

- A database named `rpg_bot`
- A user `rpg_bot_user` with full access to the database

Run this script using:

```bash
psql -h 172.22.2.7 -U postgres -f setup-db.sql
```

### 2. Environment Configuration

Update your `.env` file with the database connection details:

```env
# Database Configuration
DB_HOST=172.22.2.7
DB_PORT=5432
DB_NAME=rpg_bot
DB_USER=rpg_bot_user
DB_PASSWORD=your_secure_password_here
```

**Important:** Replace `your_secure_password_here` with the actual password you set in the SQL script.

### 3. Dependencies

The following packages are installed for database functionality:

- `pg` - PostgreSQL client for Node.js
- `@types/pg` - TypeScript types for pg
- `dotenv` - Environment variable management

## Database Schema

### Tables

1. **users** - Stores Discord user information
    - `id` (BIGINT, PRIMARY KEY)
    - `discord_id` (VARCHAR(20), UNIQUE)
    - `username` (VARCHAR(100))
    - `display_name` (VARCHAR(100))
    - `created_at`, `updated_at` (TIMESTAMP)

2. **player_profiles** - RPG character data
    - `id` (SERIAL, PRIMARY KEY)
    - `user_id` (BIGINT, FOREIGN KEY to users)
    - `level`, `experience` (INTEGER)
    - `health`, `max_health`, `mana`, `max_mana` (INTEGER)
    - `strength`, `defense`, `agility`, `intelligence` (INTEGER)
    - `gold` (INTEGER)
    - `created_at`, `updated_at` (TIMESTAMP)

3. **items** - Game items catalog
    - `id` (SERIAL, PRIMARY KEY)
    - `name` (VARCHAR(100))
    - `description` (TEXT)
    - `type` (VARCHAR(50)) - weapon, armor, consumable, misc
    - `rarity` (VARCHAR(20)) - common, uncommon, rare, epic, legendary
    - `value` (INTEGER)
    - `stats` (JSONB) - Item statistics stored as JSON
    - `created_at` (TIMESTAMP)

4. **player_inventory** - Player's items
    - `id` (SERIAL, PRIMARY KEY)
    - `user_id` (BIGINT, FOREIGN KEY to users)
    - `item_id` (INTEGER, FOREIGN KEY to items)
    - `quantity` (INTEGER)
    - `equipped` (BOOLEAN)
    - `created_at` (TIMESTAMP)

### Indexes

The schema includes optimized indexes for:

- User Discord ID lookups
- Player profile queries
- Inventory operations
- Item filtering by type and rarity

## Database Service

The `DatabaseService` class provides methods for:

### User Operations

- `createUser()` - Create a new user
- `getUserByDiscordId()` - Find user by Discord ID
- `updateUser()` - Update user information

### Player Profile Operations

- `createPlayerProfile()` - Create initial RPG profile
- `getPlayerProfile()` - Get player's RPG stats
- `getOrCreatePlayerProfile()` - Get or create profile (convenient)
- `updatePlayerProfile()` - Update player stats

### Item Operations

- `getItem()` - Get specific item
- `getAllItems()` - Get all available items
- `getItemsByType()` - Filter items by type

### Inventory Operations

- `getPlayerInventory()` - Get player's inventory with item details
- `addItemToInventory()` - Add items to inventory
- `removeItemFromInventory()` - Remove items from inventory
- `equipItem()` / `unequipItem()` - Manage equipped items

## Testing the Database

Run the database test script to verify everything is working:

```bash
npx ts-node test-db.ts
```

This will:

1. Test the database connection
2. Create all necessary tables
3. Insert sample items
4. Confirm everything is working correctly

## Migration Strategy

Database tables are created automatically when the bot starts. The migration system:

- Uses `IF NOT EXISTS` to avoid conflicts
- Includes proper constraints and relationships
- Creates indexes for performance
- Sets up automatic `updated_at` triggers

## Error Handling

The database connection includes:

- Connection pooling for performance
- Automatic retry logic
- Comprehensive error logging
- Graceful shutdown procedures

## Security Considerations

- Use environment variables for sensitive data
- Grant minimal necessary permissions to the database user
- Consider SSL connections for production environments
- Regularly backup your database

## Commands Using Database

The following commands now use the database:

1. **`/profile`** - Shows player stats from the database
2. **`/inventory`** - Displays player's items with database integration
3. **`/sync`** - Manually synchronize all server members (Admin only)

All commands automatically create user profiles if they don't exist, making the bot user-friendly for new players.

## User Synchronization

The bot automatically keeps all Discord server members synchronized with the database:

### Automatic Sync Events

- **Bot startup**: Syncs all existing members from all servers
- **Member joins**: Automatically adds new members to database
- **Member leaves**: Keeps data for potential return (configurable)
- **User updates**: Updates username/display name changes

### Manual Sync

- Use `/sync` command (Admin only) to manually trigger full synchronization
- Use `npm run test:sync` to test synchronization functionality

### User Data Management

- Creates database entries for all non-bot users
- Tracks username and display name changes
- Maintains user data even if they leave (preserves RPG progress)
- Automatically creates RPG profiles when users first interact with RPG commands
