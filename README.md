# Dice-o-lotl Discord Bot

A feature-rich Discord bot with RPG mechanics and dice rolling features built using Discord.js v14 and TypeScript. Named after the adorable axolotl, this bot brings fun dice-based adventures to your Discord server!

## 🚀 Features

- **Slash Commands**: Modern Discord slash command support
- **RPG System**: Character profiles, inventory, stats, and more
- **TypeScript**: Fully typed for better development experience
- **Modular Architecture**: Easy to extend with new commands and features
- **Event Handling**: Clean event-driven architecture

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- A Discord Bot Token
- Discord Application ID

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your bot credentials:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_application_id_here
   GUILD_ID=your_development_guild_id_here  # Optional, for faster command updates during development
   ```

### 3. Create Your Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section
4. Click "Add Bot"
5. Copy the bot token and add it to your `.env` file
6. Enable the necessary intents:
   - Presence Intent (if needed)
   - Server Members Intent
   - Message Content Intent

### 4. Invite Your Bot

1. In the Discord Developer Portal, go to OAuth2 → URL Generator
2. Select scopes: `bot` and `applications.commands`
3. Select bot permissions:
   - Send Messages
   - Use Slash Commands
   - Read Message History
   - Embed Links
   - Add Reactions
   - Manage Messages (optional)
4. Copy the generated URL and open it to invite your bot

## 🏃‍♂️ Running the Bot

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 📁 Project Structure

```
dice-o-lotl/
├── src/
│   ├── commands/        # Command files organized by category
│   │   ├── general/     # General commands (ping, help, etc.)
│   │   └── rpg/         # RPG-specific commands
│   ├── events/          # Discord.js event handlers
│   ├── handlers/        # Command and event loaders
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Main bot file
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Example environment variables
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## 🎮 Available Commands

### General Commands
- `/ping` - Check bot latency
- `/help` - Display help information

### RPG Commands
- `/profile` - View your character profile
- `/inventory` - Check your inventory items
- `/stats` - View detailed character statistics (to be implemented)

## 🔧 Adding New Commands

1. Create a new file in `src/commands/[category]/[commandname].ts`
2. Use this template:

```typescript
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';

const myCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('commandname')
        .setDescription('Command description'),
    
    async execute(interaction: ChatInputCommandInteraction) {
        // Command logic here
        await interaction.reply('Command response!');
    },
};

export default myCommand;
```

## 🎯 Prompt Engineering Tips

When creating prompts for your RPG bot features, consider:

### Character Generation Prompts
```
"Generate a fantasy character with the following attributes:
- Class: [Warrior/Mage/Rogue/etc.]
- Background: [Brief backstory]
- Starting stats based on class
- Unique traits or abilities"
```

### Quest Generation
```
"Create a quest for a level [X] character:
- Quest name and description
- Objectives (main and optional)
- Rewards (experience, gold, items)
- Difficulty rating
- NPCs involved"
```

### Item Generation
```
"Generate a [rarity] [item type] for RPG gameplay:
- Item name and description
- Stats/effects
- Value in gold
- Level requirement
- Special properties or lore"
```

## 📝 Development Tips

1. **Type Safety**: Always define interfaces for your data structures
2. **Error Handling**: Wrap command executions in try-catch blocks
3. **Database**: Consider adding a database (PostgreSQL, MongoDB) for persistent data
4. **Cooldowns**: Implement command cooldowns to prevent spam
5. **Permissions**: Add role-based command restrictions

## 🐛 Troubleshooting

### Bot is not responding to commands
- Ensure the bot has proper permissions in your server
- Check that slash commands are registered (may take up to an hour globally)
- Verify your bot token is correct

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Check that your Node.js version is 18.0.0 or higher

## 📚 Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📄 License

This project is licensed under the MIT License.
