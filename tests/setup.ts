// Test setup file for Jest
// This file runs before each test suite

// Mock console methods to reduce noise in test output
const originalConsole = console;

beforeAll(() => {
    global.console = {
        ...originalConsole,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };
});

afterAll(() => {
    global.console = originalConsole;
});

// Mock Discord.js modules that are commonly used
jest.mock('discord.js', () => {
    function MockSlashCommandBuilder() {
        const builder = {
            name: '',
            description: '',
            setName(name: string) {
                builder.name = name;
                return builder;
            },
            setDescription(description: string) {
                builder.description = description;
                return builder;
            },
            addStringOption() {
                return builder;
            },
            addIntegerOption() {
                return builder;
            },
            addBooleanOption() {
                return builder;
            },
            addUserOption() {
                return builder;
            },
            addChannelOption() {
                return builder;
            },
            toJSON() {
                return {
                    name: builder.name,
                    description: builder.description,
                };
            },
        };
        return builder;
    }

    return {
        Client: jest.fn(),
        Collection: jest.fn(() => ({
            set: jest.fn(),
            get: jest.fn(),
            has: jest.fn(),
            clear: jest.fn(),
            delete: jest.fn(),
            forEach: jest.fn(),
        })),
        REST: jest.fn(),
        Routes: {
            applicationCommands: jest.fn(),
            applicationGuildCommands: jest.fn(),
        },
        SlashCommandBuilder: MockSlashCommandBuilder,
        EmbedBuilder: jest.fn(() => ({
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            setThumbnail: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        })),
        Events: {
            ClientReady: 'ready',
            InteractionCreate: 'interactionCreate',
        },
        ActivityType: {
            Playing: 0,
            Streaming: 1,
            Listening: 2,
            Watching: 3,
            Custom: 4,
            Competing: 5,
        },
        MessageFlags: {
            Ephemeral: 1 << 6, // 64
        },
        GatewayIntentBits: {
            Guilds: 1,
            GuildMessages: 512,
            MessageContent: 32768,
        },
    };
});
