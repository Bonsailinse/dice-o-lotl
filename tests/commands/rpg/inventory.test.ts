import inventoryCommand from '../../../src/commands/rpg/inventory';
import { createMockInteraction } from '../../utils/testUtils';
import { DatabaseService } from '../../../src/database/DatabaseService';

// Mock the database config to prevent actual database connections in tests
jest.mock('../../../src/config/database', () => ({
    testConnection: jest.fn().mockResolvedValue(true),
    query: jest.fn(),
    closePool: jest.fn(),
}));

// Mock Discord.js EmbedBuilder
jest.mock('discord.js', () => ({
    ...jest.requireActual('discord.js'),
    EmbedBuilder: jest.fn().mockImplementation(() => ({
        setTitle: jest.fn().mockReturnThis(),
        setColor: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        addFields: jest.fn().mockReturnThis(),
        setFooter: jest.fn().mockReturnThis(),
        setTimestamp: jest.fn().mockReturnThis(),
    })),
}));

// Mock DatabaseService
jest.mock('../../../src/database/DatabaseService');

const mockDatabaseService = DatabaseService as jest.Mocked<typeof DatabaseService>;

describe('Inventory Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock implementations
        mockDatabaseService.getUserByDiscordId.mockResolvedValue({
            id: 1,
            discord_id: '123456789',
            username: 'testuser',
            display_name: 'Test User',
            created_at: new Date(),
            updated_at: new Date(),
        });

        mockDatabaseService.createUser.mockResolvedValue({
            id: 1,
            discord_id: '123456789',
            username: 'testuser',
            display_name: 'Test User',
            created_at: new Date(),
            updated_at: new Date(),
        });

        // Mock inventory with sample items
        mockDatabaseService.getPlayerInventory.mockResolvedValue([
            {
                id: 1,
                user_id: 1,
                item_id: 1,
                quantity: 3,
                equipped: false,
                created_at: new Date(),
                item: {
                    id: 1,
                    name: 'Health Potion',
                    description: 'Restores 50 HP',
                    type: 'consumable',
                    rarity: 'common',
                    value: 25,
                    stats: {},
                    created_at: new Date(),
                },
            },
            {
                id: 2,
                user_id: 1,
                item_id: 2,
                quantity: 1,
                equipped: true,
                created_at: new Date(),
                item: {
                    id: 2,
                    name: 'Iron Sword',
                    description: 'A sturdy iron blade',
                    type: 'weapon',
                    rarity: 'common',
                    value: 100,
                    stats: {},
                    created_at: new Date(),
                },
            },
        ]);
    });

    it('should have correct command data', () => {
        expect(inventoryCommand.data).toBeDefined();
        expect(inventoryCommand.data.name).toBe('inventory');
        expect(inventoryCommand.data.description).toBe('Check your inventory');
    });

    it('should execute inventory command successfully', async () => {
        const mockInteraction = createMockInteraction({
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        await inventoryCommand.execute(mockInteraction as any);

        expect(mockInteraction.reply).toHaveBeenCalledWith({
            embeds: expect.any(Array),
        });

        const replyCall = mockInteraction.reply.mock.calls[0][0];
        expect(replyCall.embeds).toHaveLength(1);
    });

    it('should create embed with correct inventory information', async () => {
        const mockInteraction = createMockInteraction({
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        const mockEmbed = {
            setTitle: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await inventoryCommand.execute(mockInteraction as any);

        expect(mockEmbed.setTitle).toHaveBeenCalledWith('🎒 Inventory of testuser');
        expect(mockEmbed.setColor).toHaveBeenCalled();
        expect(mockEmbed.setFooter).toHaveBeenCalledWith({
            text: 'Tip: Use items during battles for strategic advantages!',
        });
        expect(mockEmbed.setTimestamp).toHaveBeenCalled();
    });

    it('should display correct inventory items from database', async () => {
        const mockInteraction = createMockInteraction({
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        const mockEmbed = {
            setTitle: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await inventoryCommand.execute(mockInteraction as any);

        const descriptionCall = mockEmbed.setDescription.mock.calls[0][0];
        expect(descriptionCall).toContain('**Weapons:**');
        expect(descriptionCall).toContain('⚔️ **Iron Sword** x1 *(equipped)*');
        expect(descriptionCall).toContain('**Consumables:**');
        expect(descriptionCall).toContain('🧪 **Health Potion** x3');
    });

    it('should display correct inventory statistics', async () => {
        const mockInteraction = createMockInteraction({
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        const mockEmbed = {
            setTitle: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await inventoryCommand.execute(mockInteraction as any);

        expect(mockEmbed.addFields).toHaveBeenCalledWith(
            { name: '📦 Total Items', value: '4', inline: true }, // 3 potions + 1 sword
            { name: '🎯 Unique Items', value: '2', inline: true },
            { name: '💎 Total Value', value: '175 gold', inline: true } // (3*25) + (1*100)
        );
    });

    it('should handle empty inventory', async () => {
        mockDatabaseService.getPlayerInventory.mockResolvedValue([]);

        const mockInteraction = createMockInteraction({
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        const mockEmbed = {
            setTitle: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await inventoryCommand.execute(mockInteraction as any);

        const descriptionCall = mockEmbed.setDescription.mock.calls[0][0];
        expect(descriptionCall).toBe('Your inventory is empty! Use commands to get some items.');
    });

    it('should create new user if not found', async () => {
        mockDatabaseService.getUserByDiscordId.mockResolvedValue(null);

        const mockInteraction = createMockInteraction({
            user: {
                id: '999999999',
                username: 'newuser',
                displayName: 'New User',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        await inventoryCommand.execute(mockInteraction as any);

        expect(mockDatabaseService.createUser).toHaveBeenCalledWith(
            '999999999',
            'newuser',
            'New User'
        );
    });

    it('should handle database errors gracefully', async () => {
        mockDatabaseService.getUserByDiscordId.mockRejectedValue(
            new Error('Database connection failed')
        );

        const mockInteraction = createMockInteraction({
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        await inventoryCommand.execute(mockInteraction as any);

        expect(mockInteraction.reply).toHaveBeenCalledWith({
            content: '❌ An error occurred while fetching your inventory. Please try again later.',
            ephemeral: true,
        });
    });
});
