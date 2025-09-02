import { Client, Events } from 'discord.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        console.log(`✅ Ready! Logged in as ${client.user?.tag}`);
        console.log(`📊 Serving ${client.guilds.cache.size} guilds`);
        
        // Set bot activity
        client.user?.setActivity('with dice rolling adventures', { type: 0 }); // 0 = Playing
    },
};
