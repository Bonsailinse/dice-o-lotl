import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import { Command } from '../../types/Command';
import { UserSyncService } from '../../database/UserSyncService';

const syncCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('sync')
        .setDescription('Synchronize all server members with the database (Admin only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();

            // Get current stats
            const statsBefore = await UserSyncService.getUserStats();

            const embed = new EmbedBuilder()
                .setTitle('🔄 User Synchronization')
                .setColor(0x00ae86)
                .setDescription('Starting user synchronization...')
                .addFields(
                    { name: '📊 Guilds', value: `${statsBefore.totalGuilds}`, inline: true },
                    { name: '👥 Total Users', value: `${statsBefore.totalUsers}`, inline: true },
                    { name: '⏳ Status', value: 'In Progress...', inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            // Perform sync
            await UserSyncService.syncAllUsers();

            // Update embed with completion
            const completedEmbed = new EmbedBuilder()
                .setTitle('✅ User Synchronization Complete')
                .setColor(0x00ff00)
                .setDescription('All server members have been synchronized with the database.')
                .addFields(
                    { name: '📊 Guilds', value: `${statsBefore.totalGuilds}`, inline: true },
                    { name: '👥 Total Users', value: `${statsBefore.totalUsers}`, inline: true },
                    { name: '✅ Status', value: 'Complete', inline: true }
                )
                .setFooter({
                    text: 'Users are automatically synced when they join/leave or update their profiles.',
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [completedEmbed] });
        } catch (error) {
            console.error('Error in sync command:', error);

            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ Synchronization Failed')
                .setColor(0xff0000)
                .setDescription('An error occurred during user synchronization.')
                .addFields({
                    name: 'Error',
                    value: error instanceof Error ? error.message : 'Unknown error',
                    inline: false,
                })
                .setTimestamp();

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};

export default syncCommand;
