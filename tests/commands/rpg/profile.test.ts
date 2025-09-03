import profileCommand from '../../../src/commands/rpg/profile';
import { createMockInteraction } from '../../utils/testUtils';

describe('Profile Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should have correct command data', () => {
        expect(profileCommand.data).toBeDefined();
        expect(profileCommand.data.name).toBe('profile');
        expect(profileCommand.data.description).toBe('View your character profile and dice stats');
    });

    it('should execute profile command successfully', async () => {
        const mockInteraction = createMockInteraction({
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        await profileCommand.execute(mockInteraction as any);

        expect(mockInteraction.reply).toHaveBeenCalledWith({
            embeds: expect.any(Array),
        });

        const replyCall = mockInteraction.reply.mock.calls[0][0];
        expect(replyCall.embeds).toHaveLength(1);
    });

    it('should create embed with correct user information', async () => {
        const mockInteraction = createMockInteraction({
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        // Mock EmbedBuilder to capture the method calls
        const mockEmbed = {
            setTitle: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            setThumbnail: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        // Mock the EmbedBuilder constructor
        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await profileCommand.execute(mockInteraction as any);

        expect(mockEmbed.setTitle).toHaveBeenCalledWith("⚔️ testuser's Profile");
        expect(mockEmbed.setColor).toHaveBeenCalledWith(0x00ae86);
        expect(mockEmbed.setThumbnail).toHaveBeenCalledWith('https://example.com/avatar.png');
        expect(mockEmbed.addFields).toHaveBeenCalled();
        expect(mockEmbed.setFooter).toHaveBeenCalledWith({
            text: 'Tip: Use /help to see all available commands!',
        });
        expect(mockEmbed.setTimestamp).toHaveBeenCalled();
    });

    it('should display correct default profile values', async () => {
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
            setThumbnail: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await profileCommand.execute(mockInteraction as any);

        expect(mockEmbed.addFields).toHaveBeenCalledWith(
            { name: '📊 Level', value: '1', inline: true },
            { name: '✨ Experience', value: '0/100', inline: true },
            { name: '🎭 Class', value: 'Adventurer', inline: true },
            { name: '❤️ Health', value: '100/100', inline: true },
            { name: '💰 Gold', value: '50', inline: true },
            { name: '🏆 Achievements', value: '0', inline: true }
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

        await expect(profileCommand.execute(mockInteraction as any)).rejects.toThrow(
            'Network error'
        );
    });
});
