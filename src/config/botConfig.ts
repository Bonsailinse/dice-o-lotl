/**
 * Bot Configuration and Metadata
 * This file contains all the bot's metadata, configuration, and constants
 */

export interface BotConfig {
    name: string;
    version: string;
    description: string;
    author: {
        name: string;
        github: string;
        email?: string;
        website?: string;
    };
    links: {
        github: string;
        documentation: string;
        supportServer?: string;
        inviteUrl?: string;
        website?: string;
    };
    features: string[];
    permissions: {
        required: string[];
        recommended: string[];
    };
    technical: {
        nodeVersion: string;
        discordJsVersion: string;
        typescriptVersion: string;
        language: string;
        framework: string;
    };
    branding: {
        primaryColor: number;
        secondaryColor: number;
        emoji: string;
        mascot: string;
    };
    support: {
        documentation: string;
        issues: string;
        discussions?: string;
    };
}

export const BOT_CONFIG: BotConfig = {
    name: 'Dice-o-lotl',
    version: '1.1.0',
    description:
        'A Discord bot with RPG and dice rolling features built using Discord.js and TypeScript. Created for the AxolotlArmy community.',

    author: {
        name: 'Bonsailinse',
        github: 'https://github.com/Bonsailinse',
        email: 'bonsailinse@axolotl.army',
        website: 'https://axolotl.army',
    },

    links: {
        github: 'https://github.com/Bonsailinse/dice-o-lotl',
        documentation: 'https://github.com/Bonsailinse/dice-o-lotl#readme',
        supportServer: 'https://dc.axolotl.army',
        inviteUrl:
            'https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147870784&integration_type=0&scope=bot+applications.commands',
        website: 'https://github.com/Bonsailinse/dice-o-lotl',
    },

    features: [
        'Slash Commands',
        'RPG Character System',
        'Inventory Management',
        'Dice Rolling',
        'Profile Statistics',
        'Help System',
        'TypeScript Support',
        'Modern Discord.js v14',
        'Event-Driven Architecture',
        'Modular Command Structure',
    ],

    permissions: {
        required: ['Send Messages', 'Use Slash Commands', 'Embed Links', 'Read Message History'],
        recommended: ['Manage Messages', 'Add Reactions', 'Use External Emojis', 'Attach Files'],
    },

    technical: {
        nodeVersion: '>=18.0.0',
        discordJsVersion: '^14.16.3',
        typescriptVersion: '^5.5.4',
        language: 'TypeScript',
        framework: 'Discord.js',
    },

    branding: {
        primaryColor: 0x00ae86, // Teal color
        secondaryColor: 0x7289da, // Discord blurple
        emoji: '🎲', // Dice
        mascot: '🦎', // Axolotl emoji
    },

    support: {
        documentation: 'https://github.com/Bonsailinse/dice-o-lotl/blob/main/README.md',
        issues: 'https://github.com/Bonsailinse/dice-o-lotl/issues',
        discussions: 'https://github.com/Bonsailinse/dice-o-lotl/discussions',
    },
};

// Export individual components for easy access
export const { name, version, description, author, links, features } = BOT_CONFIG;

// Helper functions
export const getBotInviteUrl = (clientId: string): string => {
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=2147870784&integration_type=0&scope=bot+applications.commands`;
};

export const getFormattedVersion = (): string => {
    return `v${version}`;
};

export const getFormattedFeatures = (): string => {
    return features.map((feature) => `• ${feature}`).join('\n');
};

export const getBrandingEmbed = () => {
    return {
        color: BOT_CONFIG.branding.primaryColor,
        footer: {
            text: `${BOT_CONFIG.name} ${getFormattedVersion()} • Made with 🎲 and caffeine`,
            icon_url: undefined, // Will be set dynamically with bot's avatar
        },
    };
};
