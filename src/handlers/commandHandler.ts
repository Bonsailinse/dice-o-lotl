import { Client, REST, Routes } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

// Function to validate command structure
function validateCommand(command: any, filePath: string): boolean {
    if (!command.default) {
        console.error(`❌ Command at ${filePath} has no default export`);
        return false;
    }

    if (!command.default.data) {
        console.error(`❌ Command at ${filePath} is missing "data" property`);
        return false;
    }

    if (!command.default.execute) {
        console.error(`❌ Command at ${filePath} is missing "execute" property`);
        return false;
    }

    if (typeof command.default.execute !== 'function') {
        console.error(`❌ Command at ${filePath} "execute" property is not a function`);
        return false;
    }

    return true;
}

export async function loadCommands(client: Client, commandsPath: string): Promise<void> {
    const commands: any[] = [];
    let loadedCount = 0;
    let skippedCount = 0;

    try {
        // Clear existing commands from client
        client.commands.clear();
        console.log('🗑️  Cleared existing commands from client');

        const commandFolders = await fs.readdir(commandsPath);
        console.log(`📁 Found ${commandFolders.length} command folders`);

        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            const stat = await fs.stat(folderPath);

            if (stat.isDirectory()) {
                console.log(`📂 Processing folder: ${folder}`);
                const commandFiles = await fs.readdir(folderPath);

                // In development (src), look for .ts files. In production (dist), look for .js files
                const isProductionBuild = __filename.includes('dist');
                const fileExtension = isProductionBuild ? '.js' : '.ts';
                const validFiles = commandFiles.filter(
                    (file) =>
                        file.endsWith(fileExtension) || (!isProductionBuild && file.endsWith('.js'))
                );

                console.log(`📄 Found ${validFiles.length} command files in ${folder}`);

                for (const file of validFiles) {
                    try {
                        const filePath = path.join(folderPath, file);

                        // Add timestamp to avoid module caching issues in development
                        const isProductionBuild = __filename.includes('dist');

                        let importUrl: string;
                        if (isProductionBuild) {
                            // In production, use relative paths from the dist directory
                            const relativePath = path.relative(path.dirname(__filename), filePath);
                            importUrl = './' + relativePath.replace(/\\/g, '/');
                        } else {
                            // In development, use file URLs with timestamps
                            const fileUrl = pathToFileURL(filePath).href;
                            importUrl = `${fileUrl}?t=${Date.now()}`;
                        }

                        const command = await import(importUrl);

                        if (validateCommand(command, `${folder}/${file}`)) {
                            const commandName = command.default.data.name;

                            // Check for duplicate command names
                            if (client.commands.has(commandName)) {
                                console.warn(
                                    `⚠️  Duplicate command name "${commandName}" found in ${folder}/${file} - overwriting previous`
                                );
                            }

                            client.commands.set(commandName, command.default);
                            commands.push(command.default.data.toJSON());
                            console.log(
                                `✅ Loaded command: ${commandName} (from ${folder}/${file})`
                            );
                            loadedCount++;
                        } else {
                            console.warn(`⚠️  Command at ${folder}/${file} failed validation`);
                            skippedCount++;
                        }
                    } catch (error) {
                        console.error(`❌ Error loading command ${folder}/${file}:`, error);
                        skippedCount++;
                    }
                }
            }
        }

        console.log(`📊 Command loading summary: ${loadedCount} loaded, ${skippedCount} skipped`);

        // Register commands with Discord (this will remove non-existing commands)
        await registerCommands(commands);
    } catch (error) {
        console.error('❌ Error loading commands:', error);
    }
}

// Utility function to explicitly clear all commands (use with caution)
async function _clearAllCommands(): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    try {
        console.log('🗑️  Clearing ALL commands...');

        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID),
                { body: [] }
            );
            console.log('✅ Cleared all guild commands');
        } else {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: [] });
            console.log('✅ Cleared all global commands');
        }
    } catch (error) {
        console.error('❌ Error clearing commands:', error);
        throw error;
    }
}

async function registerCommands(commands: any[]): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

    try {
        console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);
        console.log(`📝 Commands to register: ${commands.map((cmd) => cmd.name).join(', ')}`);

        // First, let's get the current commands to see what needs to be cleaned up
        let currentCommands: any[] = [];
        try {
            if (process.env.GUILD_ID) {
                currentCommands = (await rest.get(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID)
                )) as any[];
            } else {
                currentCommands = (await rest.get(
                    Routes.applicationCommands(process.env.CLIENT_ID!)
                )) as any[];
            }

            if (currentCommands.length > 0) {
                console.log(
                    `🗑️  Found ${currentCommands.length} existing commands: ${currentCommands.map((cmd: any) => cmd.name).join(', ')}`
                );
            }
        } catch {
            console.log('📄 No existing commands found or error fetching them');
        }

        let registeredCommands;

        // Register commands globally or to a specific guild (for development)
        if (process.env.GUILD_ID) {
            // Guild commands update instantly (good for development)
            console.log(`🎯 Registering commands to guild: ${process.env.GUILD_ID}`);
            registeredCommands = (await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID),
                { body: commands }
            )) as any[];
        } else {
            // Global commands (can take up to an hour to update)
            console.log('🌍 Registering commands globally');
            registeredCommands = (await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID!),
                { body: commands }
            )) as any[];
        }

        console.log(
            `✅ Successfully registered ${registeredCommands.length} application (/) commands.`
        );
        console.log(
            `📋 Registered commands: ${registeredCommands.map((cmd: any) => cmd.name).join(', ')}`
        );

        // Report on what was removed
        if (currentCommands.length > 0) {
            const removedCommands = currentCommands.filter(
                (oldCmd: any) =>
                    !registeredCommands.some((newCmd: any) => newCmd.name === oldCmd.name)
            );
            if (removedCommands.length > 0) {
                console.log(
                    `🗑️  Removed ${removedCommands.length} old commands: ${removedCommands.map((cmd: any) => cmd.name).join(', ')}`
                );
            }
        }

        // Note: PUT method automatically removes commands that are not in the body
        if (registeredCommands.length !== commands.length) {
            console.log(
                `⚠️  Mismatch: Expected ${commands.length}, got ${registeredCommands.length} registered`
            );
        }
    } catch (error) {
        console.error('❌ Error registering commands:', error);
        throw error; // Re-throw to handle in calling function
    }
}
