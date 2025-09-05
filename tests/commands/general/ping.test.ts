import pingCommand from '../../../src/commands/general/ping';

// Helper function to create mock interaction
function createMockInteraction(overrides = {}) {
    return {
        reply: jest.fn(),
        editReply: jest.fn(),
        followUp: jest.fn(),
        deferReply: jest.fn(),
        user: {
            id: '123456789',
            username: 'testuser',
            displayAvatarURL: jest.fn(() => 'https://example.com/avatar.png'),
        },
        client: {
            ws: {
                ping: 50,
            },
            user: {
                username: 'TestBot',
                tag: 'TestBot#0001',
            },
        },
        commandName: 'ping',
        options: {
            getString: jest.fn(),
            getInteger: jest.fn(),
            getBoolean: jest.fn(),
            getUser: jest.fn(),
            getChannel: jest.fn(),
        },
        ...overrides,
    };
}

describe('Ping Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should have correct command data', () => {
        expect(pingCommand.data).toBeDefined();
        expect(pingCommand.data.name).toBe('ping');
        expect(pingCommand.data.description).toBe('Check the latency');
    });

    it('should execute ping command successfully', async () => {
        const mockInteraction = createMockInteraction();

        await pingCommand.execute(mockInteraction as any);

        expect(mockInteraction.reply).toHaveBeenCalledWith('🏓 Pinging...');
        expect(mockInteraction.editReply).toHaveBeenCalledWith(expect.stringContaining('🏓 Pong!'));
        expect(mockInteraction.editReply).toHaveBeenCalledWith(
            expect.stringContaining('📊 **Latency:**')
        );
        expect(mockInteraction.editReply).toHaveBeenCalledWith(
            expect.stringContaining('🌐 **API Latency:** 50ms')
        );
    });

    it('should calculate latency correctly', async () => {
        const mockInteraction = createMockInteraction();

        await pingCommand.execute(mockInteraction as any);

        const editReplyCall = mockInteraction.editReply.mock.calls[0][0];
        expect(editReplyCall).toMatch(/📊 \*\*Latency:\*\* \d+ms/);
    });

    it('should handle interaction errors gracefully', async () => {
        const mockInteraction = createMockInteraction({
            reply: jest.fn().mockRejectedValue(new Error('Network error')),
        });

        await expect(pingCommand.execute(mockInteraction as any)).rejects.toThrow('Network error');
    });
});
