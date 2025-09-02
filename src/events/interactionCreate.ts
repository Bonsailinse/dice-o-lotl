import { Events, Interaction, InteractionReplyOptions, MessageFlags } from 'discord.js';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);

            const errorMessage = 'There was an error while executing this command!';
            const replyOptions: InteractionReplyOptions = {
                content: errorMessage,
                flags: MessageFlags.Ephemeral,
            };

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(replyOptions);
                } else {
                    await interaction.reply(replyOptions);
                }
            } catch (replyError) {
                console.error('Failed to send error message:', replyError);
            }
        }
    },
};
