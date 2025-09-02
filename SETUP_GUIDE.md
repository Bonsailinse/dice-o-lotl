# 🚀 Dice-o-lotl Discord Bot - Complete Setup Guide

## Prerequisites Installation

### 1. Install Node.js (Required)

Node.js is not currently installed on your system. Please install it first:

1. **Download Node.js**:
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the **LTS version** (recommended)
   - Choose the Windows Installer (.msi) for your system (64-bit)

2. **Install Node.js**:
   - Run the downloaded installer
   - Follow the installation wizard
   - Make sure to check "Add to PATH" option
   - The installer will also install npm (Node Package Manager)

3. **Verify Installation**:
   - Open a new PowerShell or Command Prompt window
   - Run: `node --version`
   - Run: `npm --version`
   - Both commands should return version numbers

### 2. Visual Studio Code Extensions (Recommended)

Install these VS Code extensions for the best development experience:

1. **ESLint** - For code linting
2. **Prettier** - For code formatting
3. **TypeScript and JavaScript Language Features** (usually pre-installed)
4. **Discord.js Snippets** - For Discord.js code snippets

## Project Setup (After Installing Node.js)

### 1. Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

### 2. Set Up Your Discord Bot

1. **Create a Discord Application**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application"
   - Give your application a name (e.g., "Dice-o-lotl")
   - Click "Create"

2. **Create a Bot User**:
   - In your application, go to the "Bot" section
   - Click "Add Bot"
   - Click "Yes, do it!"

3. **Get Your Bot Token**:
   - In the Bot section, click "Reset Token"
   - Click "Copy" to copy your bot token
   - **IMPORTANT**: Keep this token secret!

4. **Get Your Application ID**:
   - Go to "General Information" section
   - Copy the "Application ID"

5. **Configure Bot Permissions**:
   - In the Bot section, scroll to "Privileged Gateway Intents"
   - Enable these intents:
     - ✅ Presence Intent
     - ✅ Server Members Intent
     - ✅ Message Content Intent

### 3. Configure Environment Variables

1. Create a `.env` file in the project root:
   ```bash
   copy .env.example .env
   ```

2. Edit the `.env` file and add your credentials:
   ```env
   DISCORD_TOKEN=paste_your_bot_token_here
   CLIENT_ID=paste_your_application_id_here
   GUILD_ID=paste_your_test_server_id_here
   ```

3. **Get Your Guild (Server) ID**:
   - Open Discord
   - Go to Settings → Advanced
   - Enable "Developer Mode"
   - Right-click your test server
   - Click "Copy Server ID"

### 4. Invite Your Bot to a Server

1. **Generate Invite Link**:
   - In Discord Developer Portal, go to your application
   - Go to "OAuth2" → "URL Generator"
   - Select these scopes:
     - ✅ `bot`
     - ✅ `applications.commands`
   - Select these bot permissions:
     - ✅ Send Messages
     - ✅ Use Slash Commands
     - ✅ Read Message History
     - ✅ Embed Links
     - ✅ Attach Files
     - ✅ Add Reactions
     - ✅ Use External Emojis
     - ✅ Manage Messages (optional)

2. **Invite the Bot**:
   - Copy the generated URL
   - Open it in your browser
   - Select your test server
   - Click "Authorize"

## Running Your Bot

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Testing Your Bot

1. Once the bot is running, you should see:
   ```
   🤖 Starting RPG Discord Bot...
   ✅ Ready! Logged in as YourBot#1234
   📊 Serving 1 guilds
   ```

2. In your Discord server, try these commands:
   - `/ping` - Check if the bot responds
   - `/help` - See all available commands
   - `/profile` - View your RPG profile

## Troubleshooting

### "Cannot find module" errors
- Make sure you've run `npm install`
- Delete `node_modules` folder and run `npm install` again

### Bot not responding to commands
- Check that the bot is online in your server
- Verify the bot has proper permissions
- Commands may take up to an hour to register globally
- Use a GUILD_ID in `.env` for instant command updates during development

### "Invalid Token" error
- Double-check your bot token in the `.env` file
- Make sure there are no extra spaces or quotes
- Regenerate the token if necessary

### PowerShell Execution Policy Error
If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Next Steps

1. **Customize Commands**: Add new commands in `src/commands/`
2. **Add Database**: Integrate PostgreSQL or MongoDB for persistent data
3. **Implement Features**: Use the prompts in `PROMPTS.md` for AI integration
4. **Deploy**: Consider hosting on services like:
   - Heroku
   - Railway
   - VPS (DigitalOcean, AWS, etc.)
   - Raspberry Pi (for home hosting)

## Resources

- [Discord.js Guide](https://discordjs.guide/)
- [Discord.js Documentation](https://discord.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
