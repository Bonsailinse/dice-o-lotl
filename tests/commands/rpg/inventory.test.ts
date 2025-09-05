import inventoryCommand from '../../../src/commands/rpg/inventory';
import { createMockInteraction } from '../../utils/testUtils';

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

describe('Inventory Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
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

        expect(mockEmbed.setTitle).toHaveBeenCalledWith("🎒 testuser's Inventory");
        expect(mockEmbed.setColor).toHaveBeenCalledWith(0x5865f2);
        expect(mockEmbed.setFooter).toHaveBeenCalledWith({
            text: 'Tip: Use items during battles for strategic advantages!',
        });
        expect(mockEmbed.setTimestamp).toHaveBeenCalled();
    });

    it('should display correct default inventory items', async () => {
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
        expect(descriptionCall).toContain('🧪 **Health Potion** x3');
        expect(descriptionCall).toContain('⚔️ **Iron Sword** x1');
        expect(descriptionCall).toContain('🛡️ **Leather Armor** x1');
        expect(descriptionCall).toContain('🍞 **Bread** x5');
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
            { name: '📦 Total Items', value: '10', inline: true }, // 3+1+1+5=10
            { name: '🎯 Inventory Slots', value: '4/20', inline: true }
        );
    });

    it('should handle interaction errors gracefully', async () => {
        const mockInteraction = createMockInteraction({
            reply: jest.fn().mockRejectedValue(new Error('Network error')),
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        await expect(inventoryCommand.execute(mockInteraction as any)).rejects.toThrow(
            'Network error'
        );
    });
});
