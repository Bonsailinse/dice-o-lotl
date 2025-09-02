import { Client, Events, ActivityType } from 'discord.js';
import { BOT_CONFIG } from '../config/botConfig';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        console.log('🎯 ====================================');
        console.log(`✅ ${BOT_CONFIG.name} is now ready!`);
        console.log(`🤖 Logged in as: ${client.user?.tag}`);
        console.log(`🆔 Bot ID: ${client.user?.id}`);
        console.log(`📊 Serving ${client.guilds.cache.size} guilds`);
        console.log(`👥 Connected to ${client.users.cache.size} users`);
        console.log(`🌐 Shard ID: ${client.shard?.ids || 'No sharding'}`);
        console.log(`📈 Uptime: Starting...`);
        console.log(`📝 Version: ${BOT_CONFIG.version}`);
        console.log(`🔗 Support: ${BOT_CONFIG.links.github}`);
        console.log('🎯 ====================================');
        
        // Set bot activity with rotation
        const activities = [
            { name: 'with dice rolling adventures', type: ActivityType.Playing },
            { name: 'RPG campaigns unfold', type: ActivityType.Watching },
            { name: 'to /help for commands', type: ActivityType.Listening },
            { name: `${BOT_CONFIG.version} • /help`, type: ActivityType.Custom }
        ];
        
        let currentActivity = 0;
        
        // Set initial activity
        client.user?.setActivity(activities[currentActivity]);
        
        // Rotate activities every 30 minutes
        setInterval(() => {
            currentActivity = (currentActivity + 1) % activities.length;
            client.user?.setActivity(activities[currentActivity]);
        }, 30 * 60 * 1000); // 30 minutes
        
        // Log additional startup info
        console.log(`🎮 Bot features: ${BOT_CONFIG.features.join(', ')}`);
        console.log(`📅 Started at: ${new Date().toISOString()}`);
    },
};
