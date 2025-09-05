import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { testConnection } from '../src/config/database';
import { createTables, insertSampleItems } from '../src/database/migrations';
import { UserSyncService } from '../src/database/UserSyncService';

// Load environment variables
dotenv.config();

async function testUserSync() {
    console.log('🧪 Testing user synchronization...\n');

    try {
        // Test database connection
        console.log('1. Testing database connection...');
        const connected = await testConnection();
        if (!connected) {
            throw new Error('Failed to connect to database');
        }

        // Ensure tables exist
        console.log('2. Ensuring database tables exist...');
        await createTables();
        await insertSampleItems();

        // Create Discord client
        console.log('3. Creating Discord client...');
        const client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
        });

        // Login and test sync
        console.log('4. Connecting to Discord...');
        await client.login(process.env.DISCORD_TOKEN);

        console.log('5. Waiting for client ready...');
        await new Promise<void>((resolve) => {
            client.once('ready', async () => {
                console.log(`✅ Bot connected as ${client.user?.tag}`);

                try {
                    // Initialize user sync service
                    console.log('6. Initializing user sync service...');
                    UserSyncService.initialize(client);

                    // Get stats before sync
                    const statsBefore = await UserSyncService.getUserStats();
                    console.log(
                        `📊 Found ${statsBefore.totalUsers} users across ${statsBefore.totalGuilds} guilds`
                    );

                    // Perform sync
                    console.log('7. Starting user synchronization...');
                    await UserSyncService.syncAllUsers();

                    // Get stats after sync
                    const statsAfter = await UserSyncService.getUserStats();
                    console.log(`📊 Sync complete: ${statsAfter.totalUsers} users processed`);

                    console.log('\n✅ User sync test completed successfully!');
                } catch (error) {
                    console.error('❌ User sync test failed:', error);
                } finally {
                    client.destroy();
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error('\n❌ User sync test failed:', error);
        process.exit(1);
    }

    process.exit(0);
}

testUserSync();
