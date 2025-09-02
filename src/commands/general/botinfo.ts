import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { Command } from '../../types/Command';
import { BOT_CONFIG, getBotInviteUrl, getBrandingEmbed } from '../../config/botConfig';

export default {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Display detailed information about Dice-o-lotl bot'),

    async execute(interaction) {
        const client = interaction.client;

        // Calculate uptime
        const uptime = client.uptime ? client.uptime : 0;
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // Get memory usage
        const memoryUsage = process.memoryUsage();
        const memoryUsed = Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100;

        // Create main info embed
        const embed = new EmbedBuilder()
            .setColor(BOT_CONFIG.branding.primaryColor)
            .setTitle(`${BOT_CONFIG.branding.emoji} ${BOT_CONFIG.name}`)
            .setDescription(BOT_CONFIG.description)
            .setThumbnail(client.user?.displayAvatarURL() || null)
            .addFields(
                {
                    name: '📊 Statistics',
                    value: [
                        `**Guilds:** ${client.guilds.cache.size}`,
                        `**Users:** ${client.users.cache.size}`,
                        `**Channels:** ${client.channels.cache.size}`,
                        `**Commands:** ${client.commands?.size || 0}`,
                    ].join('\n'),
                    inline: true,
                },
                {
                    name: '⚙️ System Info',
                    value: [
                        `**Version:** ${BOT_CONFIG.version}`,
                        `**Node.js:** ${process.version}`,
                        `**Memory:** ${memoryUsed} MB`,
                        `**Uptime:** ${uptimeString}`,
                    ].join('\n'),
                    inline: true,
                },
                {
                    name: '🚀 Features',
                    value: BOT_CONFIG.features.map((feature) => `• ${feature}`).join('\n'),
                    inline: false,
                },
                {
                    name: '👤 Developer',
                    value: `Created by **[${BOT_CONFIG.author.name}](${BOT_CONFIG.author.github})**`,
                    inline: true,
                },
                {
                    name: '📅 Bot Created',
                    value: client.user?.createdAt.toDateString() || 'Unknown',
                    inline: true,
                },
                {
                    name: '🛠️ Technical Stack',
                    value: [
                        `**Language:** ${BOT_CONFIG.technical.language}`,
                        `**Framework:** ${BOT_CONFIG.technical.framework}`,
                        `**Discord.js:** ${BOT_CONFIG.technical.discordJsVersion}`,
                    ].join('\n'),
                    inline: true,
                }
            )
            .setFooter({
                text: getBrandingEmbed().footer.text,
                iconURL: client.user?.displayAvatarURL(),
            })
            .setTimestamp();

        // Create buttons
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel('GitHub Repository')
                .setStyle(ButtonStyle.Link)
                .setURL(BOT_CONFIG.links.github)
                .setEmoji('📂'),
            new ButtonBuilder()
                .setLabel('Documentation')
                .setStyle(ButtonStyle.Link)
                .setURL(BOT_CONFIG.links.documentation)
                .setEmoji('📖'),
            new ButtonBuilder()
                .setLabel('Invite Bot')
                .setStyle(ButtonStyle.Link)
                .setURL(getBotInviteUrl(client.user?.id || ''))
                .setEmoji('➕')
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
} as Command;
