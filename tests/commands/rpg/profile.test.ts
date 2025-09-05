import profileCommand from '../../../src/commands/rpg/profile';
import { createMockInteraction } from '../../utils/testUtils';
import { DatabaseService } from '../../../src/database/DatabaseService';

// Mock DatabaseService
jest.mock('../../../src/database/DatabaseService');

const mockDatabaseService = DatabaseService as jest.Mocked<typeof DatabaseService>;

describe('Profile Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Mock default profile response
        mockDatabaseService.getOrCreatePlayerProfile.mockResolvedValue({
            user: {
                id: 1,
                discord_id: '123456789',
                username: 'testuser',
                display_name: 'Test User',
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
                defense: 10,
                agility: 10,
                intelligence: 10,
                gold: 100,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    });

    it('should have correct command data', () => {
        expect(profileCommand.data).toBeDefined();
        expect(profileCommand.data.name).toBe('profile');
        expect(profileCommand.data.description).toBe('View your character profile and stats');
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

        expect(mockEmbed.setTitle).toHaveBeenCalledWith('⚔️ Profile of testuser');
        expect(mockEmbed.setColor).toHaveBeenCalledWith(0x00ae86);
        expect(mockEmbed.setThumbnail).toHaveBeenCalledWith('https://example.com/avatar.png');
        expect(mockEmbed.addFields).toHaveBeenCalled();
        expect(mockEmbed.setFooter).toHaveBeenCalledWith({
            text: 'Tip: Use /inventory to see your items!',
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
            { name: '💰 Gold', value: '100', inline: true },
            { name: '❤️ Health', value: '100/100', inline: true },
            { name: '💙 Mana', value: '50/50', inline: true },
            { name: '⚡ Stats', value: '\u200b', inline: true },
            { name: '💪 Strength', value: '10', inline: true },
            { name: '🛡️ Defense', value: '10', inline: true },
            { name: '💨 Agility', value: '10', inline: true },
            { name: '🧠 Intelligence', value: '10', inline: true }
        );
    });

    it('should handle database errors gracefully', async () => {
        mockDatabaseService.getOrCreatePlayerProfile.mockRejectedValue(
            new Error('Database connection failed')
        );

        const mockInteraction = createMockInteraction({
            user: {
                id: '123456789',
                username: 'testuser',
                displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
            },
        });

        await profileCommand.execute(mockInteraction as any);

        expect(mockInteraction.reply).toHaveBeenCalledWith({
            content: '❌ An error occurred while fetching your profile. Please try again later.',
            ephemeral: true,
        });
    });
});
