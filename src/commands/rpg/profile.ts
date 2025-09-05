import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/Command';

// This is a mock implementation - in a real bot, you'd fetch this from a database
interface UserProfile {
    level: number;
    experience: number;
    class: string;
    health: number;
    maxHealth: number;
    gold: number;
}

const profileCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your character profile and dice stats'),

    async execute(interaction: ChatInputCommandInteraction) {
        // Mock data - replace with database fetch
        const userProfile: UserProfile = {
            level: 1,
            experience: 0,
            class: 'Adventurer',
            health: 100,
            maxHealth: 100,
            gold: 50,
        };

        const embed = new EmbedBuilder()
            .setTitle(`⚔️ ${interaction.user.username}'s Profile`)
            .setColor(0x00ae86)
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                { name: '📊 Level', value: `${userProfile.level}`, inline: true },
                { name: '✨ Experience', value: `${userProfile.experience}/100`, inline: true },
                { name: '🎭 Class', value: userProfile.class, inline: true },
                {
                    name: '❤️ Health',
                    value: `${userProfile.health}/${userProfile.maxHealth}`,
                    inline: true,
                },
                { name: '💰 Gold', value: `${userProfile.gold}`, inline: true },
                { name: '🏆 Achievements', value: '0', inline: true }
            )
            .setFooter({ text: 'Tip: Use /help to see all available commands!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

export default profileCommand;
