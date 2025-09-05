import { Events, ActivityType } from 'discord.js';
import readyEvent from '../../src/events/ready';
import { TEST_VERSION } from '../utils/testConstants';

// Mock botConfig with centralized version
jest.mock('../../src/config/botConfig', () => ({
    BOT_CONFIG: {
        name: 'Test Bot',
        version: require('../utils/testConstants').TEST_VERSION,
        links: {
            github: 'https://github.com/test/repo',
        },
        features: ['RPG', 'Dice Rolling'],
    },
}));

describe('Ready Event', () => {
    let consoleSpy: jest.SpyInstance;
    let setIntervalSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        setIntervalSpy = jest.spyOn(global, 'setInterval').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        setIntervalSpy.mockRestore();
    });

    it('should have correct event properties', () => {
        expect(readyEvent.name).toBe(Events.ClientReady);
        expect(readyEvent.once).toBe(true);
    });

    it('should log startup information', () => {
        const mockClient = {
            user: {
                tag: 'TestBot#1234',
                id: '123456789',
                setActivity: jest.fn(),
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
            shard: {
                ids: [0],
            },
        };

        readyEvent.execute(mockClient as any);

        expect(consoleSpy).toHaveBeenCalledWith('✅ Test Bot is now ready!');
        expect(consoleSpy).toHaveBeenCalledWith('🤖 Logged in as: TestBot#1234');
        expect(consoleSpy).toHaveBeenCalledWith('🆔 Bot ID: 123456789');
        expect(consoleSpy).toHaveBeenCalledWith('📊 Serving 5 guilds');
        expect(consoleSpy).toHaveBeenCalledWith('👥 Connected to 100 users');
        expect(consoleSpy).toHaveBeenCalledWith('🌐 Shard ID: 0');
        expect(consoleSpy).toHaveBeenCalledWith(`📝 Version: ${TEST_VERSION}`);
        expect(consoleSpy).toHaveBeenCalledWith('🔗 Support: https://github.com/test/repo');
    });

    it('should handle missing shard information', () => {
        const mockClient = {
            user: {
                tag: 'TestBot#1234',
                id: '123456789',
                setActivity: jest.fn(),
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
            shard: null,
        };

        readyEvent.execute(mockClient as any);

        expect(consoleSpy).toHaveBeenCalledWith('🌐 Shard ID: No sharding');
    });

    it('should set initial activity', () => {
        const mockClient = {
            user: {
                tag: 'TestBot#1234',
                id: '123456789',
                setActivity: jest.fn(),
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
            shard: null,
        };

        readyEvent.execute(mockClient as any);

        expect(mockClient.user.setActivity).toHaveBeenCalledWith({
            name: 'with dice rolling adventures',
            type: ActivityType.Playing,
        });
    });

    it('should set up activity rotation interval', () => {
        const mockClient = {
            user: {
                tag: 'TestBot#1234',
                id: '123456789',
                setActivity: jest.fn(),
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
            shard: null,
        };

        readyEvent.execute(mockClient as any);

        expect(setIntervalSpy).toHaveBeenCalledWith(
            expect.any(Function),
            30 * 60 * 1000 // 30 minutes
        );
    });

    it('should log bot features', () => {
        const mockClient = {
            user: {
                tag: 'TestBot#1234',
                id: '123456789',
                setActivity: jest.fn(),
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
            shard: null,
        };

        readyEvent.execute(mockClient as any);

        expect(consoleSpy).toHaveBeenCalledWith('🎮 Bot features: RPG, Dice Rolling');
    });

    it('should handle missing user gracefully', () => {
        const mockClient = {
            user: null,
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
            shard: null,
        };

        expect(() => {
            readyEvent.execute(mockClient as any);
        }).not.toThrow();

        expect(consoleSpy).toHaveBeenCalledWith('🤖 Logged in as: undefined');
        expect(consoleSpy).toHaveBeenCalledWith('🆔 Bot ID: undefined');
    });
});
