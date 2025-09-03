import { Events, MessageFlags } from 'discord.js';
import interactionCreateEvent from '../../src/events/interactionCreate';

describe('InteractionCreate Event', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn();
    });

    it('should have correct event name', () => {
        expect(interactionCreateEvent.name).toBe(Events.InteractionCreate);
    });

    it('should return early if interaction is not a chat input command', async () => {
        const mockInteraction = {
            isChatInputCommand: jest.fn(() => false),
        };

        await interactionCreateEvent.execute(mockInteraction as any);

        expect(mockInteraction.isChatInputCommand).toHaveBeenCalled();
    });

    it('should execute command when found', async () => {
        const mockCommand = {
            execute: jest.fn(),
        };

        const mockInteraction = {
            isChatInputCommand: jest.fn(() => true),
            commandName: 'ping',
            client: {
                commands: {
                    get: jest.fn(() => mockCommand),
                },
            },
        };

        await interactionCreateEvent.execute(mockInteraction as any);

        expect(mockInteraction.client.commands.get).toHaveBeenCalledWith('ping');
        expect(mockCommand.execute).toHaveBeenCalledWith(mockInteraction);
    });

    it('should log error when command is not found', async () => {
        const mockInteraction = {
            isChatInputCommand: jest.fn(() => true),
            commandName: 'unknown',
            client: {
                commands: {
                    get: jest.fn(() => undefined),
                },
            },
        };

        await interactionCreateEvent.execute(mockInteraction as any);

        expect(console.error).toHaveBeenCalledWith('No command matching unknown was found.');
    });

    it('should handle command execution errors with reply', async () => {
        const mockCommand = {
            execute: jest.fn().mockRejectedValue(new Error('Command failed')),
        };

        const mockInteraction = {
            isChatInputCommand: jest.fn(() => true),
            commandName: 'ping',
            client: {
                commands: {
                    get: jest.fn(() => mockCommand),
                },
            },
            replied: false,
            deferred: false,
            reply: jest.fn(),
            followUp: jest.fn(),
        };

        await interactionCreateEvent.execute(mockInteraction as any);

        expect(console.error).toHaveBeenCalledWith('Error executing ping:', expect.any(Error));
        expect(mockInteraction.reply).toHaveBeenCalledWith({
            content: 'There was an error while executing this command!',
            flags: MessageFlags.Ephemeral,
        });
    });

    it('should handle command execution errors with followUp when already replied', async () => {
        const mockCommand = {
            execute: jest.fn().mockRejectedValue(new Error('Command failed')),
        };

        const mockInteraction = {
            isChatInputCommand: jest.fn(() => true),
            commandName: 'ping',
            client: {
                commands: {
                    get: jest.fn(() => mockCommand),
                },
            },
            replied: true,
            deferred: false,
            reply: jest.fn(),
            followUp: jest.fn(),
        };

        await interactionCreateEvent.execute(mockInteraction as any);

        expect(console.error).toHaveBeenCalledWith('Error executing ping:', expect.any(Error));
        expect(mockInteraction.followUp).toHaveBeenCalledWith({
            content: 'There was an error while executing this command!',
            flags: MessageFlags.Ephemeral,
        });
    });

    it('should handle command execution errors with followUp when deferred', async () => {
        const mockCommand = {
            execute: jest.fn().mockRejectedValue(new Error('Command failed')),
        };

        const mockInteraction = {
            isChatInputCommand: jest.fn(() => true),
            commandName: 'ping',
            client: {
                commands: {
                    get: jest.fn(() => mockCommand),
                },
            },
            replied: false,
            deferred: true,
            reply: jest.fn(),
            followUp: jest.fn(),
        };

        await interactionCreateEvent.execute(mockInteraction as any);

        expect(console.error).toHaveBeenCalledWith('Error executing ping:', expect.any(Error));
        expect(mockInteraction.followUp).toHaveBeenCalledWith({
            content: 'There was an error while executing this command!',
            flags: MessageFlags.Ephemeral,
        });
    });

    it('should handle reply errors gracefully', async () => {
        const mockCommand = {
            execute: jest.fn().mockRejectedValue(new Error('Command failed')),
        };

        const mockInteraction = {
            isChatInputCommand: jest.fn(() => true),
            commandName: 'ping',
            client: {
                commands: {
                    get: jest.fn(() => mockCommand),
                },
            },
            replied: false,
            deferred: false,
            reply: jest.fn().mockRejectedValue(new Error('Reply failed')),
            followUp: jest.fn(),
        };

        await interactionCreateEvent.execute(mockInteraction as any);

        expect(console.error).toHaveBeenCalledWith('Error executing ping:', expect.any(Error));
        expect(console.error).toHaveBeenCalledWith(
            'Failed to send error message:',
            expect.any(Error)
        );
    });
});
