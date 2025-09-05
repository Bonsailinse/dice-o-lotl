import { query } from '../config/database';

export interface User {
    id: number; // SERIAL (auto-increment)
    discord_id: string;
    username: string;
    display_name?: string;
    created_at: Date;
    updated_at: Date;
}

export interface PlayerProfile {
    id: number;
    user_id: number; // INTEGER (references users.id)
    level: number;
    experience: number;
    health: number;
    max_health: number;
    mana: number;
    max_mana: number;
    strength: number;
    defense: number;
    agility: number;
    intelligence: number;
    gold: number;
    created_at: Date;
    updated_at: Date;
}

export interface Item {
    id: number;
    name: string;
    description?: string;
    type: string;
    rarity: string;
    value: number;
    stats: any;
    created_at: Date;
}

export interface PlayerInventoryItem {
    id: number;
    user_id: number;
    item_id: number;
    quantity: number;
    equipped: boolean;
    created_at: Date;
    item?: Item;
}

export class DatabaseService {
    // User operations
    static async createUser(
        discordId: string,
        username: string,
        displayName?: string
    ): Promise<User> {
        const result = await query(
            'INSERT INTO users (discord_id, username, display_name) VALUES ($1, $2, $3) RETURNING *',
            [discordId, username, displayName]
        );
        return result.rows[0];
    }

    static async getUserByDiscordId(discordId: string): Promise<User | null> {
        const result = await query('SELECT * FROM users WHERE discord_id = $1', [discordId]);
        return result.rows[0] || null;
    }

    static async updateUser(discordId: string, updates: Partial<User>): Promise<User | null> {
        const setParts = [];
        const values = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (key !== 'id' && key !== 'discord_id' && key !== 'created_at') {
                setParts.push(`${key} = $${paramIndex++}`);
                values.push(value);
            }
        }

        if (setParts.length === 0) return null;

        values.push(discordId);
        const result = await query(
            `UPDATE users SET ${setParts.join(', ')} WHERE discord_id = $${paramIndex} RETURNING *`,
            values
        );
        return result.rows[0] || null;
    }

    // Player profile operations
    static async createPlayerProfile(userId: number): Promise<PlayerProfile> {
        const result = await query(
            'INSERT INTO player_profiles (user_id) VALUES ($1) RETURNING *',
            [userId]
        );
        return result.rows[0];
    }

    static async getPlayerProfile(userId: number): Promise<PlayerProfile | null> {
        const result = await query('SELECT * FROM player_profiles WHERE user_id = $1', [userId]);
        return result.rows[0] || null;
    }

    static async getOrCreatePlayerProfile(
        discordId: string
    ): Promise<{ user: User; profile: PlayerProfile }> {
        // Get or create user
        let user = await this.getUserByDiscordId(discordId);
        if (!user) {
            throw new Error('User must be created before getting profile');
        }

        // Get or create profile
        let profile = await this.getPlayerProfile(user.id);
        if (!profile) {
            profile = await this.createPlayerProfile(user.id);
        }

        return { user, profile };
    }

    static async updatePlayerProfile(
        userId: number,
        updates: Partial<PlayerProfile>
    ): Promise<PlayerProfile | null> {
        const setParts = [];
        const values = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (key !== 'id' && key !== 'user_id' && key !== 'created_at') {
                setParts.push(`${key} = $${paramIndex++}`);
                values.push(value);
            }
        }

        if (setParts.length === 0) return null;

        values.push(userId);
        const result = await query(
            `UPDATE player_profiles SET ${setParts.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`,
            values
        );
        return result.rows[0] || null;
    }

    // Item operations
    static async getItem(itemId: number): Promise<Item | null> {
        const result = await query('SELECT * FROM items WHERE id = $1', [itemId]);
        return result.rows[0] || null;
    }

    static async getAllItems(): Promise<Item[]> {
        const result = await query('SELECT * FROM items ORDER BY name');
        return result.rows;
    }

    static async getItemsByType(type: string): Promise<Item[]> {
        const result = await query('SELECT * FROM items WHERE type = $1 ORDER BY name', [type]);
        return result.rows;
    }

    // Inventory operations
    static async getPlayerInventory(userId: number): Promise<PlayerInventoryItem[]> {
        const result = await query(
            `
      SELECT pi.*, i.name, i.description, i.type, i.rarity, i.value, i.stats
      FROM player_inventory pi
      JOIN items i ON pi.item_id = i.id
      WHERE pi.user_id = $1
      ORDER BY i.type, i.name
    `,
            [userId]
        );

        return result.rows.map((row: any) => ({
            id: row.id,
            user_id: row.user_id,
            item_id: row.item_id,
            quantity: row.quantity,
            equipped: row.equipped,
            created_at: row.created_at,
            item: {
                id: row.item_id,
                name: row.name,
                description: row.description,
                type: row.type,
                rarity: row.rarity,
                value: row.value,
                stats: row.stats,
                created_at: row.created_at,
            },
        }));
    }

    static async addItemToInventory(
        userId: number,
        itemId: number,
        quantity: number = 1
    ): Promise<PlayerInventoryItem> {
        const result = await query(
            `
      INSERT INTO player_inventory (user_id, item_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, item_id)
      DO UPDATE SET quantity = player_inventory.quantity + $3
      RETURNING *
    `,
            [userId, itemId, quantity]
        );
        return result.rows[0];
    }

    static async removeItemFromInventory(
        userId: number,
        itemId: number,
        quantity: number = 1
    ): Promise<boolean> {
        const result = await query(
            `
      UPDATE player_inventory
      SET quantity = quantity - $3
      WHERE user_id = $1 AND item_id = $2 AND quantity >= $3
      RETURNING *
    `,
            [userId, itemId, quantity]
        );

        if (result.rows.length > 0) {
            // Remove entry if quantity reaches 0
            await query(
                'DELETE FROM player_inventory WHERE user_id = $1 AND item_id = $2 AND quantity <= 0',
                [userId, itemId]
            );
            return true;
        }
        return false;
    }

    static async equipItem(userId: number, itemId: number): Promise<boolean> {
        const result = await query(
            `
      UPDATE player_inventory
      SET equipped = true
      WHERE user_id = $1 AND item_id = $2
      RETURNING *
    `,
            [userId, itemId]
        );
        return result.rows.length > 0;
    }

    static async unequipItem(userId: number, itemId: number): Promise<boolean> {
        const result = await query(
            `
      UPDATE player_inventory
      SET equipped = false
      WHERE user_id = $1 AND item_id = $2
      RETURNING *
    `,
            [userId, itemId]
        );
        return result.rows.length > 0;
    }
}
