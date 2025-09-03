# Changelog

All notable changes to Dice-o-lotl will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-09-04

### Added

- Comprehensive unit testing framework with Jest and TypeScript support
- 63 unit tests covering all commands, events, handlers, and integration scenarios
- Mock infrastructure for Discord.js components (SlashCommandBuilder, EmbedBuilder, Client, Events)
- Test utilities for creating mock interactions and clients
- GitHub Actions CI/CD workflow for automated testing on push and pull requests
- Test coverage for ping, help, status, profile, inventory commands
- Event testing for ready and interactionCreate handlers
- Command handler testing with file system and dynamic import mocking
- Integration tests for end-to-end command execution flows

### Technical

- Jest testing framework configuration with ts-jest
- Discord.js v14.16.3 comprehensive mocking including ActivityType and MessageFlags
- Test scripts: test, test:watch, test:coverage, test:ci
- Mock objects for Collection, Map, and other Discord.js utilities
- TypeScript type declarations for test environment
- Process mocking for memory usage and performance testing

## [1.1.0] - 2025-09-03

### Added

- Comprehensive bot metadata system
- Bot configuration file for centralized metadata management
- Enhanced startup logging with detailed bot information
- `/botinfo` command to display comprehensive bot information
- `/status` command to show real-time bot health metrics
- Activity rotation system for bot presence
- Detailed package.json metadata

### Changed

- Improved console logging with timestamps and file output
- Enhanced ready event with detailed startup information
- Restructured bot information management

### Technical

- Added TypeScript interfaces for bot configuration
- Centralized metadata in `src/config/botConfig.ts`
- Enhanced error handling and logging system

## [1.0.0] - 2025-09-02

### Added

- Initial release of Dice-o-lotl Discord bot
- Basic slash command system
- RPG character profiles and inventory management
- Help and ping commands
- TypeScript support with modern Discord.js v14
- Event-driven architecture
- Modular command structure

### Features

- `/help` - Display available commands
- `/ping` - Check bot latency
- `/profile` - Manage RPG character profile
- `/inventory` - Manage character inventory

### Technical

- Discord.js v14.16.3
- TypeScript v5.5.4
- Node.js 18+ support
- ESLint and Prettier configuration
- Development and production build scripts
