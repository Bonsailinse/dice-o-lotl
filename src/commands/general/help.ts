import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/Command';

const helpCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get information about the bot and its commands'),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle('🎮 Dice-o-lotl Help')
            .setDescription('Welcome to Dice-o-lotl! Here are the available commands:')
            .setColor(0x7289DA)
            .addFields(
                { 
                    name: '📌 General Commands', 
                    value: '`/help` - Show this help message\n`/ping` - Check bot latency\n`/info` - Get bot information',
                    inline: false 
                },
                { 
                    name: '⚔️ RPG Commands', 
                    value: '`/profile` - View your RPG profile\n`/inventory` - Check your inventory\n`/stats` - View your character stats',
                    inline: false 
                },
                { 
                    name: '🎯 Getting Started', 
                    value: 'Use `/profile` to create your character and start your RPG journey!',
                    inline: false 
                }
            )
            .setFooter({ text: 'Dice-o-lotl v1.0.0' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    },
};

export default helpCommand;
