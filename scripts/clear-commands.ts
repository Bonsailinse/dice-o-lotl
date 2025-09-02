import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';

// Load environment variables
config();

async function clearAllCommands() {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    try {
        console.log('🔍 Checking for commands to clean up...');

        // Check global commands
        try {
            const globalCommands = (await rest.get(
                Routes.applicationCommands(process.env.CLIENT_ID!)
            )) as any[];
            console.log(
                `🌍 Found ${globalCommands.length} global commands: ${globalCommands.map((cmd: any) => cmd.name).join(', ')}`
            );

            if (globalCommands.length > 0) {
                await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: [] });
                console.log('✅ Cleared all global commands');
            }
        } catch (error) {
            console.log('📄 No global commands found or error accessing them');
        }

        // Check guild commands
        if (process.env.GUILD_ID) {
            try {
                const guildCommands = (await rest.get(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID)
                )) as any[];
                console.log(
                    `🎯 Found ${guildCommands.length} guild commands: ${guildCommands.map((cmd: any) => cmd.name).join(', ')}`
                );

                if (guildCommands.length > 0) {
                    await rest.put(
                        Routes.applicationGuildCommands(
                            process.env.CLIENT_ID!,
                            process.env.GUILD_ID
                        ),
                        { body: [] }
                    );
                    console.log('✅ Cleared all guild commands');
                }
            } catch (error) {
                console.log('📄 No guild commands found or error accessing them');
            }
        }

        console.log(
            '🎉 Command cleanup completed! Restart the bot to register only your current commands.'
        );
    } catch (error) {
        console.error('❌ Error during command cleanup:', error);
    }
}

// Run the cleanup
clearAllCommands();
