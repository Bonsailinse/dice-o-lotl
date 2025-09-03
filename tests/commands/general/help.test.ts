import helpCommand from '../../../src/commands/general/help';
import { createMockInteraction } from '../../utils/testUtils';

describe('Help Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should have correct command data', () => {
        expect(helpCommand.data).toBeDefined();
        expect(helpCommand.data.name).toBe('help');
        expect(helpCommand.data.description).toBe('Get information about the bot and its commands');
    });

    it('should execute help command successfully', async () => {
        const mockInteraction = createMockInteraction();

        await helpCommand.execute(mockInteraction as any);

        expect(mockInteraction.reply).toHaveBeenCalledWith({
            embeds: expect.any(Array),
        });

        const replyCall = mockInteraction.reply.mock.calls[0][0];
        expect(replyCall.embeds).toHaveLength(1);
    });

    it('should create embed with correct help information', async () => {
        const mockInteraction = createMockInteraction();

        const mockEmbed = {
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await helpCommand.execute(mockInteraction as any);

        expect(mockEmbed.setTitle).toHaveBeenCalledWith('🎮 Dice-o-lotl Help');
        expect(mockEmbed.setDescription).toHaveBeenCalledWith(
            'Welcome to Dice-o-lotl! Here are the available commands:'
        );
        expect(mockEmbed.setColor).toHaveBeenCalledWith(0x7289da);
        expect(mockEmbed.setFooter).toHaveBeenCalledWith({ text: 'Dice-o-lotl v1.0.0' });
        expect(mockEmbed.setTimestamp).toHaveBeenCalled();
    });

    it('should include general commands section', async () => {
        const mockInteraction = createMockInteraction();

        const mockEmbed = {
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await helpCommand.execute(mockInteraction as any);

        const addFieldsCalls = mockEmbed.addFields.mock.calls[0];
        const generalCommandsField = addFieldsCalls.find(
            (field: any) => field.name === '📌 General Commands'
        );

        expect(generalCommandsField).toBeDefined();
        expect(generalCommandsField.value).toContain('/help');
        expect(generalCommandsField.value).toContain('/ping');
        expect(generalCommandsField.value).toContain('/info');
    });

    it('should include RPG commands section', async () => {
        const mockInteraction = createMockInteraction();

        const mockEmbed = {
            setTitle: jest.fn().mockReturnThis(),
            setDescription: jest.fn().mockReturnThis(),
            setColor: jest.fn().mockReturnThis(),
            addFields: jest.fn().mockReturnThis(),
            setFooter: jest.fn().mockReturnThis(),
            setTimestamp: jest.fn().mockReturnThis(),
        };

        const { EmbedBuilder } = require('discord.js');
        EmbedBuilder.mockReturnValue(mockEmbed);

        await helpCommand.execute(mockInteraction as any);

        const addFieldsCalls = mockEmbed.addFields.mock.calls[0];
        const rpgCommandsField = addFieldsCalls.find(
            (field: any) => field.name === '⚔️ RPG Commands'
        );

        expect(rpgCommandsField).toBeDefined();
        expect(rpgCommandsField.value).toContain('/profile');
        expect(rpgCommandsField.value).toContain('/inventory');
        expect(rpgCommandsField.value).toContain('/stats');
    });

    it('should handle interaction errors gracefully', async () => {
        const mockInteraction = createMockInteraction({
            reply: jest.fn().mockRejectedValue(new Error('Network error')),
        });

        await expect(helpCommand.execute(mockInteraction as any)).rejects.toThrow('Network error');
    });
});
