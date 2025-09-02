import { Client, REST, Routes } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { Command } from '../types/Command';

export async function loadCommands(client: Client, commandsPath: string): Promise<void> {
    const commands: any[] = [];
    
    try {
        const commandFolders = await fs.readdir(commandsPath);
        
        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            const stat = await fs.stat(folderPath);
            
            if (stat.isDirectory()) {
                const commandFiles = await fs.readdir(folderPath);
                const tsFiles = commandFiles.filter(file => file.endsWith('.ts') || file.endsWith('.js'));
                
                for (const file of tsFiles) {
                    const filePath = path.join(folderPath, file);
                    const command = await import(filePath);
                    
                    if ('data' in command.default && 'execute' in command.default) {
                        client.commands.set(command.default.data.name, command.default);
                        commands.push(command.default.data.toJSON());
                        console.log(`✅ Loaded command: ${command.default.data.name}`);
                    } else {
                        console.warn(`⚠️  Command at ${filePath} is missing required "data" or "execute" property`);
                    }
                }
            }
        }
        
        // Register commands with Discord
        await registerCommands(commands);
        
    } catch (error) {
        console.error('❌ Error loading commands:', error);
    }
}

async function registerCommands(commands: any[]): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    
    try {
        console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);
        
        // Register commands globally or to a specific guild (for development)
        if (process.env.GUILD_ID) {
            // Guild commands update instantly (good for development)
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID),
                { body: commands }
            );
        } else {
            // Global commands (can take up to an hour to update)
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID!),
                { body: commands }
            );
        }
        
        console.log(`✅ Successfully reloaded ${commands.length} application (/) commands.`);
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}
