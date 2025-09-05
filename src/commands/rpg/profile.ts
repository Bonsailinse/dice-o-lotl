import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { DatabaseService } from '../../database/DatabaseService';

const profileCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your character profile and stats'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            // Get or create user and profile
            let user = await DatabaseService.getUserByDiscordId(interaction.user.id);
            if (!user) {
                user = await DatabaseService.createUser(
                    interaction.user.id,
                    interaction.user.username,
                    interaction.user.displayName
                );
            }

            const { profile } = await DatabaseService.getOrCreatePlayerProfile(interaction.user.id);

            // Calculate experience needed for next level
            const expForNextLevel = profile.level * 100;
            const expProgress = Math.min(profile.experience, expForNextLevel);

            const embed = new EmbedBuilder()
                .setTitle(`⚔️ Profile of ${interaction.user.username}`)
                .setColor(0x00ae86)
                .setThumbnail(interaction.user.displayAvatarURL())
                .addFields(
                    { name: '📊 Level', value: `${profile.level}`, inline: true },
                    {
                        name: '✨ Experience',
                        value: `${expProgress}/${expForNextLevel}`,
                        inline: true,
                    },
                    { name: '💰 Gold', value: `${profile.gold}`, inline: true },
                    {
                        name: '❤️ Health',
                        value: `${profile.health}/${profile.max_health}`,
                        inline: true,
                    },
                    {
                        name: '💙 Mana',
                        value: `${profile.mana}/${profile.max_mana}`,
                        inline: true,
                    },
                    { name: '⚡ Stats', value: '\u200b', inline: true },
                    { name: '💪 Strength', value: `${profile.strength}`, inline: true },
                    { name: '🛡️ Defense', value: `${profile.defense}`, inline: true },
                    { name: '💨 Agility', value: `${profile.agility}`, inline: true },
                    { name: '🧠 Intelligence', value: `${profile.intelligence}`, inline: true }
                )
                .setFooter({ text: 'Tip: Use /inventory to see your items!' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in profile command:', error);
            await interaction.reply({
                content:
                    '❌ An error occurred while fetching your profile. Please try again later.',
                ephemeral: true,
            });
        }
    },
};

export default profileCommand;
