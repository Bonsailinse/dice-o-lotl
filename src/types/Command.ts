import { ChatInputCommandInteraction, SlashCommandBuilder, CommandInteraction, Client, Collection } from 'discord.js';

export interface Command {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    cooldown?: number; // Cooldown in seconds
}

// Extend the Discord.js Client to include our command collection
declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>;
    }
}
