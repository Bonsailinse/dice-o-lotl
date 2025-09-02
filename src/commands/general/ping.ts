import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';

const pingCommand: Command = {
    data: new SlashCommandBuilder().setName('ping').setDescription("Check the bot's latency"),

    async execute(interaction: ChatInputCommandInteraction) {
        const startTime = Date.now();

        await interaction.reply('🏓 Pinging...');

        const endTime = Date.now();
        const latency = endTime - startTime;
        const apiLatency = Math.round(interaction.client.ws.ping);

        await interaction.editReply(
            `🏓 Pong!\n` + `📊 **Latency:** ${latency}ms\n` + `🌐 **API Latency:** ${apiLatency}ms`
        );
    },
};

export default pingCommand;
