import { Client, GuildMember, User } from 'discord.js';
import { DatabaseService } from './DatabaseService';

export class UserSyncService {
    private static client: Client;

    static initialize(client: Client) {
        this.client = client;
    }

    /**
     * Sync all members from all guilds to the database
     */
    static async syncAllUsers(): Promise<void> {
        if (!this.client) {
            throw new Error('UserSyncService not initialized');
        }

        console.log('👥 Starting user synchronization...');
        let totalSynced = 0;
        let totalCreated = 0;
        let totalUpdated = 0;

        for (const [_guildId, guild] of this.client.guilds.cache) {
            try {
                console.log(
                    `📋 Syncing users from guild: ${guild.name} (${guild.memberCount} members)`
                );

                // Fetch all members to ensure we have complete data
                const members = await guild.members.fetch();

                for (const [_memberId, member] of members) {
                    // Skip bots
                    if (member.user.bot) continue;

                    try {
                        const result = await this.syncUser(member.user);
                        totalSynced++;
                        if (result.created) totalCreated++;
                        if (result.updated) totalUpdated++;
                    } catch (error) {
                        console.error(`❌ Failed to sync user ${member.user.username}:`, error);
                    }
                }
            } catch (error) {
                console.error(`❌ Failed to fetch members from guild ${guild.name}:`, error);
            }
        }

        console.log(
            `✅ User sync complete: ${totalSynced} users processed (${totalCreated} created, ${totalUpdated} updated)`
        );
    }

    /**
     * Sync a specific user to the database
     */
    static async syncUser(user: User): Promise<{ created: boolean; updated: boolean }> {
        try {
            const existingUser = await DatabaseService.getUserByDiscordId(user.id);

            if (!existingUser) {
                // Create new user
                await DatabaseService.createUser(
                    user.id,
                    user.username,
                    user.displayName || user.globalName || undefined
                );
                return { created: true, updated: false };
            } else {
                // Check if user data needs updating
                const displayName = user.displayName || user.globalName || undefined;
                const needsUpdate =
                    existingUser.username !== user.username ||
                    existingUser.display_name !== displayName;

                if (needsUpdate) {
                    await DatabaseService.updateUser(user.id, {
                        username: user.username,
                        display_name: displayName,
                    });
                    return { created: false, updated: true };
                }

                return { created: false, updated: false };
            }
        } catch (error) {
            console.error(`❌ Error syncing user ${user.username}:`, error);
            throw error;
        }
    }

    /**
     * Handle new member joining
     */
    static async handleMemberAdd(member: GuildMember): Promise<void> {
        if (member.user.bot) return;

        try {
            console.log(`👋 New member joined: ${member.user.username}`);
            const result = await this.syncUser(member.user);

            if (result.created) {
                console.log(`✅ Created database entry for new user: ${member.user.username}`);
            }
        } catch (error) {
            console.error(`❌ Failed to handle new member ${member.user.username}:`, error);
        }
    }

    /**
     * Handle member leaving
     * Note: We typically don't delete user data when they leave,
     * as they might rejoin and we want to preserve their progress
     */
    static async handleMemberRemove(member: GuildMember): Promise<void> {
        if (member.user.bot) return;

        console.log(`👋 Member left: ${member.user.username} (keeping data for potential return)`);
        // Optionally, you could mark the user as inactive or update a last_seen timestamp
        // For now, we'll keep their data intact
    }

    /**
     * Handle user updates (username/avatar changes)
     */
    static async handleUserUpdate(oldUser: User, newUser: User): Promise<void> {
        if (newUser.bot) return;

        try {
            const usernameChanged = oldUser.username !== newUser.username;
            const displayNameChanged = oldUser.displayName !== newUser.displayName;

            if (usernameChanged || displayNameChanged) {
                console.log(`👤 User updated: ${oldUser.username} → ${newUser.username}`);

                await DatabaseService.updateUser(newUser.id, {
                    username: newUser.username,
                    display_name: newUser.displayName || newUser.globalName || undefined,
                });

                console.log(`✅ Updated database for user: ${newUser.username}`);
            }
        } catch (error) {
            console.error(`❌ Failed to handle user update for ${newUser.username}:`, error);
        }
    }

    /**
     * Get statistics about synchronized users
     */
    static async getUserStats(): Promise<{ totalUsers: number; totalGuilds: number }> {
        if (!this.client) return { totalUsers: 0, totalGuilds: 0 };

        let totalUsers = 0;
        for (const [, guild] of this.client.guilds.cache) {
            const members = await guild.members.fetch();
            totalUsers += members.filter((member) => !member.user.bot).size;
        }

        return {
            totalUsers,
            totalGuilds: this.client.guilds.cache.size,
        };
    }
}
