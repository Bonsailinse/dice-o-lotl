import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { BOT_CONFIG } from '../../config/botConfig';

export default {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Display current bot status and health metrics'),

    async execute(interaction) {
        const client = interaction.client;

        // Calculate uptime
        const uptime = client.uptime ? client.uptime : 0;
        const uptimeString = formatUptime(uptime);

        // Get system metrics
        const memoryUsage = process.memoryUsage();
        const memoryUsed = Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100;
        const memoryTotal = Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100;

        // Calculate ping
        const ping = client.ws.ping;

        // Determine health status
        const getHealthStatus = () => {
            if (ping < 100 && memoryUsed < 500) return { status: '🟢 Excellent', color: 0x00ff00 };
            if (ping < 200 && memoryUsed < 1000) return { status: '🟡 Good', color: 0xffff00 };
            if (ping < 500 && memoryUsed < 2000) return { status: '🟠 Fair', color: 0xff8000 };
            return { status: '🔴 Poor', color: 0xff0000 };
        };

        const health = getHealthStatus();

        const embed = new EmbedBuilder()
            .setColor(health.color)
            .setTitle(`📊 ${BOT_CONFIG.name} Status`)
            .setDescription(`**Health:** ${health.status}`)
            .addFields(
                {
                    name: '🏓 Latency',
                    value: [
                        `**WebSocket:** ${ping}ms`,
                        `**API:** ${Date.now() - interaction.createdTimestamp}ms`,
                    ].join('\n'),
                    inline: true,
                },
                {
                    name: '💾 Memory Usage',
                    value: [
                        `**Used:** ${memoryUsed} MB`,
                        `**Total:** ${memoryTotal} MB`,
                        `**Usage:** ${Math.round((memoryUsed / memoryTotal) * 100)}%`,
                    ].join('\n'),
                    inline: true,
                },
                {
                    name: '⏱️ Uptime',
                    value: uptimeString,
                    inline: true,
                },
                {
                    name: '🌐 Connections',
                    value: [
                        `**Guilds:** ${client.guilds.cache.size}`,
                        `**Users:** ${client.users.cache.size}`,
                        `**Channels:** ${client.channels.cache.size}`,
                    ].join('\n'),
                    inline: true,
                },
                {
                    name: '⚙️ System',
                    value: [
                        `**Node.js:** ${process.version}`,
                        `**Platform:** ${process.platform}`,
                        `**Arch:** ${process.arch}`,
                    ].join('\n'),
                    inline: true,
                },
                {
                    name: '🎮 Bot Info',
                    value: [
                        `**Version:** ${BOT_CONFIG.version}`,
                        `**Commands:** ${client.commands?.size || 0}`,
                        '**Events:** Active',
                    ].join('\n'),
                    inline: true,
                }
            )
            .setFooter({
                text: 'Last updated',
                iconURL: client.user?.displayAvatarURL(),
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    },
} as Command;

function formatUptime(uptime: number): string {
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.length > 0 ? parts.join(' ') : '0s';
}
