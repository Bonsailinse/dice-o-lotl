import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';
import { Command } from './types/Command';
import path from 'path';

// Load environment variables
config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Create a collection for commands
client.commands = new Collection<string, Command>();

// Main initialization function
async function init() {
    try {
        console.log('🤖 Starting Dice-o-lotl...');

        // Load commands
        await loadCommands(client, path.join(__dirname, 'commands'));

        // Load events
        await loadEvents(client, path.join(__dirname, 'events'));

        // Login to Discord
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('❌ Failed to initialize bot:', error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🔌 Shutting down bot...');
    client.destroy();
    process.exit(0);
});

// Start the bot
init();
