import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { loadCommands } from './handlers/commandHandler';
import { loadEvents } from './handlers/eventHandler';
import { Command } from './types/Command';
import { BOT_CONFIG } from './config/botConfig';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// Load environment variables
config();

// Export BOT_CONFIG for use in other files (backward compatibility)
export const BOT_INFO = BOT_CONFIG;

// Set NODE_ENV if not already set
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

// Setup logging
const logsDir = path.join(__dirname, '..', 'logs');
const startupLogPath = path.join(logsDir, 'startup.log');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Clear the startup log file before each start
fs.writeFileSync(startupLogPath, '');

// Store original console methods before overriding
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Custom logging function that writes to both console and file
function logToFile(message: string, isError: boolean = false) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    // Write to console using original methods
    if (isError) {
        originalConsoleError(message);
    } else {
        originalConsoleLog(message);
    }

    // Append to file
    fs.appendFileSync(startupLogPath, logMessage);
}

// Override console.log and console.error for startup logging
console.log = (...args: any[]) => {
    const message = args.join(' ');
    logToFile(message, false);
};

console.error = (...args: any[]) => {
    const message = args.join(' ');
    logToFile(message, true);
};

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
        console.log('🎲 ====================================');
        console.log(`🤖 Starting ${BOT_INFO.name} v${BOT_INFO.version}`);
        console.log(`📝 ${BOT_INFO.description}`);
        console.log(`👤 Created by: ${BOT_INFO.author.name}`);
        console.log(`🔗 GitHub: ${BOT_INFO.links.github}`);
        console.log('🎲 ====================================');
        console.log('');

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
    logToFile('\n🔌 Shutting down bot...');

    // Restore original console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    client.destroy();
    process.exit(0);
});

// Start the bot
init();
