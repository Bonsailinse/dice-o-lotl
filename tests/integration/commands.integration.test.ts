// Mock database config to prevent actual database connections in CI
jest.mock('../../src/config/database', () => ({
    testConnection: jest.fn().mockResolvedValue(undefined),
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    closePool: jest.fn().mockResolvedValue(undefined),
}));

// Mock DatabaseService
jest.mock('../../src/database/DatabaseService');

import { createMockClient, createMockInteraction, createMockCommand } from '../utils/testUtils';
import pingCommand from '../../src/commands/general/ping';
import profileCommand from '../../src/commands/rpg/profile';
import helpCommand from '../../src/commands/general/help';
import inventoryCommand from '../../src/commands/rpg/inventory';
import { DatabaseService } from '../../src/database/DatabaseService';

const mockDatabaseService = DatabaseService as jest.Mocked<typeof DatabaseService>;

describe('Integration Tests', () => {
    let mockClient: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup DatabaseService mocks
        mockDatabaseService.getOrCreatePlayerProfile.mockResolvedValue({
            user: {
                id: 1,
                discord_id: '123456789',
                username: 'testuser',
                created_at: new Date(),
                updated_at: new Date(),
            },
            profile: {
                id: 1,
                user_id: 1,
                level: 1,
                experience: 0,
                health: 100,
                max_health: 100,
                mana: 50,
                max_mana: 50,
                strength: 10,
                constitution: 10,
                agility: 10,
                intelligence: 10,
                gold: 100,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        mockDatabaseService.getUserByDiscordId.mockResolvedValue({
            id: 1,
            discord_id: '123456789',
            username: 'testuser',
            created_at: new Date(),
            updated_at: new Date(),
        });

        mockDatabaseService.createUser.mockResolvedValue({
            id: 1,
            discord_id: '123456789',
            username: 'testuser',
            created_at: new Date(),
            updated_at: new Date(),
        });

        mockDatabaseService.getPlayerInventory.mockResolvedValue([
            {
                id: 1,
                user_id: 1,
                item_id: 1,
                quantity: 1,
                equipped: false,
                created_at: new Date(),
                item: {
                    id: 1,
                    name: 'Test Item',
                    description: 'A test item',
                    type: 'weapon',
                    rarity: 'common',
                    value: 10,
                    stats: {},
                    created_at: new Date(),
                },
            },
        ]);

        // Mock equipment methods
        mockDatabaseService.getEquippedItemByType.mockResolvedValue(null);

        mockClient = createMockClient({
            commands: new Map(),
        });

        // Add commands to client
        mockClient.commands.set('ping', pingCommand);
        mockClient.commands.set('profile', profileCommand);
        mockClient.commands.set('help', helpCommand);
        mockClient.commands.set('inventory', inventoryCommand);
    });

    describe('Command Integration', () => {
        it('should execute ping command flow', async () => {
            const mockInteraction = createMockInteraction({
                commandName: 'ping',
                client: mockClient,
            });

            const command = mockClient.commands.get('ping');
            await command.execute(mockInteraction);

            expect(mockInteraction.reply).toHaveBeenCalledWith('🏓 Pinging...');
            expect(mockInteraction.editReply).toHaveBeenCalledWith(
                expect.stringContaining('🏓 Pong!')
            );
        });

        it('should execute profile command flow', async () => {
            const mockInteraction = createMockInteraction({
                commandName: 'profile',
                client: mockClient,
                user: {
                    id: '123456789',
                    username: 'testuser',
                    displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
                },
            });

            const command = mockClient.commands.get('profile');
            await command.execute(mockInteraction);

            expect(mockInteraction.reply).toHaveBeenCalledWith({
                embeds: expect.any(Array),
            });
        });

        it('should execute help command flow', async () => {
            const mockInteraction = createMockInteraction({
                commandName: 'help',
                client: mockClient,
            });

            const command = mockClient.commands.get('help');
            await command.execute(mockInteraction);

            expect(mockInteraction.reply).toHaveBeenCalledWith({
                embeds: expect.any(Array),
            });
        });

        it('should execute inventory command flow', async () => {
            const mockInteraction = createMockInteraction({
                commandName: 'inventory',
                client: mockClient,
                user: {
                    id: '123456789',
                    username: 'testuser',
                    displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
                },
            });

            const command = mockClient.commands.get('inventory');
            await command.execute(mockInteraction);

            expect(mockInteraction.reply).toHaveBeenCalledWith({
                embeds: expect.any(Array),
            });
        });
    });

    describe('Command Collection', () => {
        it('should have all commands available', () => {
            expect(mockClient.commands.has('ping')).toBe(true);
            expect(mockClient.commands.has('profile')).toBe(true);
            expect(mockClient.commands.has('help')).toBe(true);
            expect(mockClient.commands.has('inventory')).toBe(true);
        });

        it('should return undefined for non-existent commands', () => {
            expect(mockClient.commands.get('nonexistent')).toBeUndefined();
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle command execution errors gracefully', async () => {
            const faultyCommand = createMockCommand({
                execute: jest.fn().mockRejectedValue(new Error('Command failed')),
            });

            mockClient.commands.set('faulty', faultyCommand);

            const mockInteraction = createMockInteraction({
                commandName: 'faulty',
                client: mockClient,
            });

            await expect(faultyCommand.execute(mockInteraction)).rejects.toThrow('Command failed');
        });

        it('should handle reply failures', async () => {
            const mockInteraction = createMockInteraction({
                commandName: 'ping',
                client: mockClient,
                reply: jest.fn().mockRejectedValue(new Error('Reply failed')),
            });

            const command = mockClient.commands.get('ping');
            await expect(command.execute(mockInteraction)).rejects.toThrow('Reply failed');
        });
    });

    describe('Command Data Validation', () => {
        it('should have valid command data for all commands', () => {
            const commands = [pingCommand, profileCommand, helpCommand, inventoryCommand];

            commands.forEach((command) => {
                expect(command.data).toBeDefined();
                expect(command.data.name).toBeDefined();
                expect(command.data.description).toBeDefined();
                expect(typeof command.execute).toBe('function');
            });
        });

        it('should have unique command names', () => {
            const commands = [pingCommand, profileCommand, helpCommand, inventoryCommand];
            const names = commands.map((cmd) => cmd.data.name);
            const uniqueNames = new Set(names);

            expect(uniqueNames.size).toBe(names.length);
        });
    });

    describe('Response Validation', () => {
        it('should ensure all commands respond to interactions', async () => {
            const commands = [
                { name: 'ping', command: pingCommand },
                { name: 'profile', command: profileCommand },
                { name: 'help', command: helpCommand },
                { name: 'inventory', command: inventoryCommand },
            ];

            for (const { name, command } of commands) {
                const mockInteraction = createMockInteraction({
                    commandName: name,
                    client: mockClient,
                    user: {
                        id: '123456789',
                        username: 'testuser',
                        displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
                    },
                });

                await command.execute(mockInteraction as any);

                // Each command should either reply or editReply
                const hasResponded =
                    mockInteraction.reply.mock.calls.length > 0 ||
                    mockInteraction.editReply.mock.calls.length > 0;

                expect(hasResponded).toBe(true);
            }
        });
    });
});
