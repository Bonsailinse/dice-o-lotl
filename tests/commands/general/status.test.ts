import statusCommand from '../../../src/commands/general/status';
import { createMockInteraction } from '../../utils/testUtils';

// Mock botConfig
jest.mock('../../../src/config/botConfig', () => ({
    BOT_CONFIG: {
        name: 'Test Bot',
        version: '1.0.0',
    },
}));

describe('Status Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock process properties
        Object.defineProperty(process, 'memoryUsage', {
            value: jest.fn(() => ({
                heapUsed: 50 * 1024 * 1024, // 50 MB
                heapTotal: 100 * 1024 * 1024, // 100 MB
                external: 10 * 1024 * 1024,
                rss: 120 * 1024 * 1024,
                arrayBuffers: 5 * 1024 * 1024,
            })),
            configurable: true,
        });

        Object.defineProperty(process, 'version', {
            value: 'v18.0.0',
            configurable: true,
        });

        Object.defineProperty(process, 'platform', {
            value: 'linux',
            configurable: true,
        });

        Object.defineProperty(process, 'arch', {
            value: 'x64',
            configurable: true,
        });
    });

    it('should have correct command data', () => {
        expect(statusCommand.data).toBeDefined();
        expect(statusCommand.data.name).toBe('status');
        expect(statusCommand.data.description).toBe(
            'Display current bot status and health metrics'
        );
    });

    it('should execute status command successfully', async () => {
        const mockInteraction = createMockInteraction({
            client: {
                uptime: 3661000, // 1 hour, 1 minute, 1 second
                ws: {
                    ping: 50,
                },
                guilds: {
                    cache: {
                        size: 5,
                    },
                },
                users: {
                    cache: {
                        size: 100,
                    },
                },
                channels: {
                    cache: {
                        size: 50,
                    },
                },
                commands: {
                    size: 10,
                },
                user: {
                    displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
                },
            },
            createdTimestamp: Date.now() - 100, // 100ms ago
        });

        await statusCommand.execute(mockInteraction as any);

        expect(mockInteraction.reply).toHaveBeenCalledWith({
            embeds: expect.any(Array),
        });
    });

    it('should create embed with correct status information', async () => {
        const mockInteraction = createMockInteraction({
            client: {
                uptime: 3661000, // 1 hour, 1 minute, 1 second
                ws: {
                    ping: 50,
                },
                guilds: {
                    cache: {
                        size: 5,
                    },
                },
                users: {
                    cache: {
                        size: 100,
                    },
                },
                channels: {
                    cache: {
                        size: 50,
                    },
                },
                commands: {
                    size: 10,
                },
                user: {
                    displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
                },
            },
            createdTimestamp: Date.now() - 100,
        });

        const mockEmbed = {
            setColor: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await statusCommand.execute(mockInteraction as any);

        expect(mockEmbed.setTitle).toHaveBeenCalledWith('📊 Test Bot Status');
        expect(mockEmbed.setDescription).toHaveBeenCalledWith('**Health:** 🟢 Excellent');
        expect(mockEmbed.setTimestamp).toHaveBeenCalled();
    });

    it('should calculate health status correctly for excellent performance', async () => {
        const mockInteraction = createMockInteraction({
            client: {
                uptime: 1000,
                ws: {
                    ping: 50, // < 100ms
                },
                guilds: { cache: { size: 1 } },
                users: { cache: { size: 1 } },
                channels: { cache: { size: 1 } },
                commands: { size: 1 },
                user: { displayAvatarURL: jest.fn() },
            },
            createdTimestamp: Date.now(),
        });

        // Mock memory usage for excellent performance (< 500 MB)
        Object.defineProperty(process, 'memoryUsage', {
            value: jest.fn(() => ({
                heapUsed: 50 * 1024 * 1024, // 50 MB
                heapTotal: 100 * 1024 * 1024,
                external: 0,
                rss: 120 * 1024 * 1024,
                arrayBuffers: 5 * 1024 * 1024,
            })),
            configurable: true,
        });

        const mockEmbed = {
            setColor: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await statusCommand.execute(mockInteraction as any);

        expect(mockEmbed.setColor).toHaveBeenCalledWith(0x00ff00); // Green for excellent
        expect(mockEmbed.setDescription).toHaveBeenCalledWith('**Health:** 🟢 Excellent');
    });

    it('should calculate health status correctly for poor performance', async () => {
        const mockInteraction = createMockInteraction({
            client: {
                uptime: 1000,
                ws: {
                    ping: 600, // > 500ms
                },
                guilds: { cache: { size: 1 } },
                users: { cache: { size: 1 } },
                channels: { cache: { size: 1 } },
                commands: { size: 1 },
                user: { displayAvatarURL: jest.fn() },
            },
            createdTimestamp: Date.now(),
        });

        // Mock memory usage for poor performance (> 2000 MB)
        Object.defineProperty(process, 'memoryUsage', {
            value: jest.fn(() => ({
                heapUsed: 2100 * 1024 * 1024, // 2100 MB
                heapTotal: 3000 * 1024 * 1024,
                external: 0,
                rss: 3500 * 1024 * 1024,
                arrayBuffers: 5 * 1024 * 1024,
            })),
            configurable: true,
        });

        const mockEmbed = {
            setColor: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await statusCommand.execute(mockInteraction as any);

        expect(mockEmbed.setColor).toHaveBeenCalledWith(0xff0000); // Red for poor
        expect(mockEmbed.setDescription).toHaveBeenCalledWith('**Health:** 🔴 Poor');
    });

    it('should format uptime correctly', async () => {
        const mockInteraction = createMockInteraction({
            client: {
                uptime: 90061000, // 1 day, 1 hour, 1 minute, 1 second
                ws: { ping: 50 },
                guilds: { cache: { size: 1 } },
                users: { cache: { size: 1 } },
                channels: { cache: { size: 1 } },
                commands: { size: 1 },
                user: { displayAvatarURL: jest.fn() },
            },
            createdTimestamp: Date.now(),
        });

        const mockEmbed = {
            setColor: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await statusCommand.execute(mockInteraction as any);

        const addFieldsCalls = mockEmbed.addFields.mock.calls[0];
        const uptimeField = addFieldsCalls.find((field: any) => field.name === '⏱️ Uptime');

        expect(uptimeField.value).toMatch(/1d 1h 1m 1s/);
    });

    it('should handle zero uptime', async () => {
        const mockInteraction = createMockInteraction({
            client: {
                uptime: null, // No uptime
                ws: { ping: 50 },
                guilds: { cache: { size: 1 } },
                users: { cache: { size: 1 } },
                channels: { cache: { size: 1 } },
                commands: { size: 1 },
                user: { displayAvatarURL: jest.fn() },
            },
            createdTimestamp: Date.now(),
        });

        const mockEmbed = {
            setColor: jest.fn().mockReturnThis(),
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await statusCommand.execute(mockInteraction as any);

        const addFieldsCalls = mockEmbed.addFields.mock.calls[0];
        const uptimeField = addFieldsCalls.find((field: any) => field.name === '⏱️ Uptime');

        expect(uptimeField.value).toBe('0s');
    });
});
