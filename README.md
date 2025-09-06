# Dice-o-lotl Discord Bot

A feature-rich Discord bot with RPG mechanics and dice rolling features built using Discord.js v14 and TypeScript. Created for the AxolotlArmy community.

## ✨ What's New in v2.0.0

**BREAKING CHANGES**: The database schema has been updated to use `constitution` instead of `defense` for a more traditional D&D-style experience. Fresh database setup required.

- 🛡️ **Constitution System**: Character stats now use Constitution instead of Defense
- ⚔️ **Equipment Integration**: Profile shows equipped weapons and armor
- 🧑 **Improved Profile**: Better layout with visual separations and neutral person emoji
- 🗄️ **Fresh Database Setup**: Streamlined database setup with constitution-based schema
- 🧹 **Cleaned Codebase**: Removed redundant migration scripts for simpler maintenance

## 🚀 Features

- **Slash Commands**: Modern Discord slash command support with comprehensive command system
- **RPG System**: Character profiles, inventory management, stats, and more
- **Bot Information**: Detailed bot information and real-time health monitoring
- **Professional Logging**: Comprehensive startup logging with timestamps and file output
- **TypeScript**: Fully typed for better development experience and type safety
- **Modular Architecture**: Easy to extend with new commands and features
- **Event Handling**: Clean event-driven architecture
- **Centralized Configuration**: Professional metadata management system
- **Interactive UI**: Rich embeds with buttons for enhanced user experience
- **Activity Rotation**: Dynamic bot presence with rotating status messages

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

### 5. Database Setup

The bot requires a PostgreSQL database for RPG features. Set up the database with:

```bash
# Set up fresh database with constitution-based stats
npm run setup:fresh-db

# Test database connection
npm run test:db
```

**Database Features:**

- Character profiles
- Inventory system with equipment
- User synchronization with Discord
- Sample items and data

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

### Additional Scripts

```bash
# Clear Discord slash commands (useful for development)
npm run clear-commands

# Database setup and testing
npm run setup:fresh-db    # Set up fresh database
npm run test:db          # Test database connection

# Testing
npm test                 # Run all tests
npm run test:coverage    # Run tests with coverage

# Code quality
npm run lint             # Lint TypeScript code
npm run format           # Format code with Prettier
```

## 📁 Project Structure

```
dice-o-lotl/
├── src/
│   ├── commands/        # Command files organized by category
│   │   ├── general/     # General commands (ping, help, botinfo, status)
│   │   └── rpg/         # RPG-specific commands
│   ├── config/          # Bot configuration and metadata
│   ├── events/          # Discord.js event handlers
│   ├── handlers/        # Command and event loaders
│   ├── types/           # TypeScript type definitions
│   └── index.ts         # Main bot file
├── logs/                # Bot logs and startup information
├── scripts/             # Utility scripts (command clearing, etc.)
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Example environment variables
├── CHANGELOG.md         # Version history and release notes
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## 🎮 Available Commands

### General Commands

- `/ping` - Check bot latency and response time
- `/help` - Display comprehensive help information
- `/botinfo` - Display detailed bot information with interactive buttons
- `/status` - Show real-time bot health metrics and system status

### RPG Commands

- `/profile` - View and manage your character profile
- `/inventory` - Check and manage your inventory items
- `/stats` - View detailed character statistics (to be implemented)

### Command Features

- **Interactive Buttons**: Commands include buttons for easy navigation
- **Rich Embeds**: Professional, colorful embed responses
- **Real-time Data**: Live system metrics and bot statistics
- **Comprehensive Information**: Detailed technical specifications and features

## 🔧 Adding New Commands

1. Create a new file in `src/commands/[category]/[commandname].ts`
2. Use this template:

```typescript
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/Command';

const myCommand: Command = {
    data: new SlashCommandBuilder().setName('commandname').setDescription('Command description'),

    async execute(interaction: ChatInputCommandInteraction) {
        // Command logic here
        await interaction.reply('Command response!');
    },
};

export default myCommand;
```

## ⚙️ Configuration System

Dice-o-lotl features a comprehensive configuration system for easy customization:

### Bot Configuration (`src/config/botConfig.ts`)

- **Centralized Metadata**: All bot information in one place
- **TypeScript Interfaces**: Type-safe configuration management
- **Branding Settings**: Colors, emojis, and visual identity
- **Technical Specifications**: Version tracking and system requirements
- **Links and Support**: GitHub, documentation, and support server links

### Key Configuration Features

- **Professional Branding**: Consistent colors and styling across all commands
- **Version Management**: Synchronized versioning between package.json and bot config
- **Feature Tracking**: Comprehensive list of bot capabilities
- **Support Integration**: Built-in links to documentation and support resources

### Customizing the Bot

1. Edit `src/config/botConfig.ts` to update bot metadata
2. Modify branding colors, emojis, and descriptions
3. Update author information and support links
4. Add new features to the features array

## 📊 Bot Information System

The bot includes a sophisticated information and monitoring system:

### `/botinfo` Command Features

- **Comprehensive Statistics**: Guild count, user count, command count
- **System Information**: Memory usage, uptime, Node.js version
- **Interactive Buttons**: Direct links to GitHub, documentation, and invite
- **Professional Presentation**: Rich embeds with consistent branding

### `/status` Command Features

- **Real-time Health Metrics**: Live system status and performance
- **Latency Monitoring**: WebSocket and API response times
- **Resource Usage**: Memory consumption and system specifications
- **Health Status Indicators**: Color-coded status based on performance

## 📝 Development Tips

1. **Type Safety**: Always define interfaces for your data structures
2. **Centralized Configuration**: Use `src/config/botConfig.ts` for all bot metadata
3. **Error Handling**: Wrap command executions in try-catch blocks
4. **Professional Branding**: Use `getBrandingEmbed()` for consistent styling
5. **Logging**: Leverage the built-in logging system for debugging
6. **Database**: Consider adding a database (PostgreSQL, MongoDB) for persistent data
7. **Cooldowns**: Implement command cooldowns to prevent spam
8. **Permissions**: Add role-based command restrictions
9. **Version Management**: Keep versions synchronized between package.json and botConfig.ts
10. **Documentation**: Update CHANGELOG.md for all new features and changes

### New Feature Development

- Follow the established command structure in `/commands/general/` and `/commands/rpg/`
- Use the centralized configuration system for consistency
- Implement rich embeds with interactive buttons for better UX
- Include proper TypeScript typing for all new features
- Add comprehensive logging for debugging and monitoring

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
- [Bot Repository](https://github.com/Bonsailinse/dice-o-lotl)
- [Release Notes](https://github.com/Bonsailinse/dice-o-lotl/blob/main/CHANGELOG.md)

## 🔄 Version History

Current Version: **v1.1.0**

### Recent Updates (v1.1.0)

- ✨ Added comprehensive bot metadata system
- 🎯 New `/botinfo` command with interactive buttons
- 📊 New `/status` command for health monitoring
- 🎨 Professional branding and consistent styling
- 📝 Enhanced logging and startup information
- ⚙️ Centralized configuration management
- 🔄 Activity rotation system

For detailed version history, see [CHANGELOG.md](CHANGELOG.md).

## 🦎 AxolotlArmy Community

Dice-o-lotl is created for the AxolotlArmy community!

- **Support Server**: [dc.axolotl.army](https://dc.axolotl.army)
- **Website**: [axolotl.army](https://axolotl.army)
- **Developer**: [Bonsailinse](https://github.com/Bonsailinse)

## 🔄 Recent Changes (v1.4.1)

### 🔧 Improvements

- **Enhanced Deployment Guide**: Reorganized workflow structure for better clarity
- **Quality Assurance**: Pre-commit checks now prioritized as first step in deployment process
- **Code Cleanup**: Removed unused imports and improved code organization

### Previous Features (v1.4.0)

- **PostgreSQL Database Integration**: Complete database backend with user profiles and inventories
- **Real-time User Sync**: Automatic Discord user synchronization with database
- **Enhanced RPG System**: Database-backed character profiles with stats, levels, and inventories

### 🐛 Bug Fixes

- **ESLint Compliance**: Resolved require() import violations in test files
- **Test Stability**: Improved EmbedBuilder mocking and test reliability

> **For Developers**: To update the bot version, simply change the version in `package.json` and rebuild. All components will automatically reflect the new version.

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Support & Issues

- **GitHub Issues**: [Report bugs or request features](https://github.com/Bonsailinse/dice-o-lotl/issues)
- **Discord Support**: Join our [support server](https://dc.axolotl.army)
- **Documentation**: Check the `/botinfo` command in Discord for quick links

## 📄 License

This project is licensed under the MIT License.
