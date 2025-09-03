// Test utilities for creating mock Discord.js objects and common test helpers

export const createMockClient = (overrides = {}) => ({
    commands: new Map(),
    user: {
        id: '123456789',
        username: 'TestBot',
        tag: 'TestBot#1234',
        setActivity: jest.fn(),
    },
    guilds: {
        cache: {
            size: 1,
        },
    },
    users: {
        cache: {
            size: 10,
        },
    },
    ws: {
        ping: 50,
    },
    shard: null,
    ...overrides,
});

export const createMockInteraction = (overrides = {}) => ({
    reply: jest.fn(),
    editReply: jest.fn(),
    followUp: jest.fn(),
    deferReply: jest.fn(),
    user: {
        id: '123456789',
        username: 'testuser',
        displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
    },
    client: createMockClient(),
    commandName: 'test',
    options: {
        getString: jest.fn(),
        getInteger: jest.fn(),
        getBoolean: jest.fn(),
        getUser: jest.fn(),
        getChannel: jest.fn(),
    },
    isChatInputCommand: jest.fn(() => true),
    replied: false,
    deferred: false,
    ...overrides,
});

export const createMockCommand = (overrides = {}) => ({
    data: {
        name: 'test',
        description: 'Test command',
        setName: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        toJSON: jest.fn(() => ({ name: 'test', description: 'Test command' })),
    },
    execute: jest.fn(),
    cooldown: undefined,
    ...overrides,
});

export const createMockEmbed = () => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setColor: jest.fn().mockReturnThis(),
    setThumbnail: jest.fn().mockReturnThis(),
    addFields: jest.fn().mockReturnThis(),
    setFooter: jest.fn().mockReturnThis(),
    setTimestamp: jest.fn().mockReturnThis(),
    setAuthor: jest.fn().mockReturnThis(),
    setImage: jest.fn().mockReturnThis(),
    setURL: jest.fn().mockReturnThis(),
});

export const createMockSlashCommandBuilder = () => ({
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    addStringOption: jest.fn().mockReturnThis(),
    addIntegerOption: jest.fn().mockReturnThis(),
    addBooleanOption: jest.fn().mockReturnThis(),
    addUserOption: jest.fn().mockReturnThis(),
    addChannelOption: jest.fn().mockReturnThis(),
    addRoleOption: jest.fn().mockReturnThis(),
    addMentionableOption: jest.fn().mockReturnThis(),
    addNumberOption: jest.fn().mockReturnThis(),
    addAttachmentOption: jest.fn().mockReturnThis(),
    addSubcommand: jest.fn().mockReturnThis(),
    addSubcommandGroup: jest.fn().mockReturnThis(),
    toJSON: jest.fn(() => ({})),
});

export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockConsole = () => {
    const originalConsole = console;
    const mockedMethods = {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    };

    beforeEach(() => {
        Object.assign(console, mockedMethods);
    });

    afterEach(() => {
        Object.assign(console, originalConsole);
    });

    return mockedMethods;
};
