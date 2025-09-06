# Changelog

All notable changes to Dice-o-lotl will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-09-06

### BREAKING CHANGES

⚠️ **Database Schema Breaking Change**: The `defense` column has been renamed to `constitution` in the `player_profiles` table. This requires fresh database setup.

### Changed

- **BREAKING**: Renamed database column `player_profiles.defense` to `player_profiles.constitution`
- **BREAKING**: Updated TypeScript interface `PlayerProfile.defense` to `PlayerProfile.constitution`
- **BREAKING**: Sample armor items now use `constitution` stats instead of `defense`
- Profile command now displays "Constitution" and uses actual `constitution` database field
- Profile embed layout improved with better visual separation between sections
- Equipment section added to profile with weapon and armor display slots

### Added

- Equipment integration in profile command showing equipped weapons and armor
- Database methods for equipment management:
  - `getEquippedItems()` - Get all equipped items for a user
  - `getEquippedItemByType()` - Get equipped item of specific type
  - `equipItemExclusive()` - Equip item and auto-unequip others of same type
- Fresh database setup script `npm run setup:fresh-db` for constitution-based schema
- Comprehensive database setup documentation in README

### Removed

- Redundant database migration scripts (constitution setup uses fresh database only)
- Outdated `fixTables.ts` and related migration files
- Separate constitution documentation (consolidated into README)

### Fixed

- Profile emoji changed from sword (⚔️) to neutral person (🧑) in title
- Equipment display properly shows "None equipped" when no items are equipped
- All tests updated to work with constitution-based schema

### Migration Required

**For existing installations**: Run `npm run setup:fresh-db` to recreate database with constitution schema. This will clear existing data.

## [1.4.1] - 2025-09-06

### Fixed

- Deployment guide workflow structure now follows logical sequence
- Pre-commit quality checks moved to step 1 for better workflow organization
- Removed unused UserSyncService import from main index file

## [1.4.0] - 2025-09-06

### Added

- Complete PostgreSQL database integration with connection pooling
- DatabaseService for managing user profiles, inventories, and items
- UserSyncService for real-time Discord user synchronization
- Automatic user sync on bot startup and guild member events
- Database migrations with sample items and proper table structure
- New sync command for manual user database synchronization
- Guild member event handlers (add, remove, update)
- Deployment automation scripts with semantic versioning
- Comprehensive test coverage for database-backed functionality

### Changed

- Ready event is now async to support user synchronization
- RPG commands (profile, inventory) now use database backend instead of mock data
- Documentation moved to dedicated docs/ folder for better organization
- Improved test suite with proper DatabaseService mocking

### Fixed

- Emoji encoding issues in profile command
- Test suite updated to handle async operations and database integration
- Database table structure with proper SERIAL primary keys and foreign key relationships

## [1.3.0] - 2025-09-05

### Added

- Centralized version management system - version is now managed from a single source (package.json)
- Test utilities for dynamic version handling in test suites
- Comprehensive version synchronization across all components

### Changed

- Version references in bot commands, status displays, and startup logs now automatically read from package.json
- Help command footer now uses dynamic version from centralized configuration
- Test mocks now use dynamic version from package.json instead of hardcoded values
- Enhanced ESLint configuration to properly handle test file requirements

### Fixed

- Eliminated hardcoded version numbers throughout the codebase
- Resolved ESLint violations related to require() imports in test files
- Improved EmbedBuilder mocking strategy in test files
- Cleaned up temporary files from refactoring process

### Technical

- Implemented automatic version propagation from package.json to all bot components
- Enhanced test infrastructure with centralized constants and utilities
- Improved maintainability by reducing version management to a single point of control
- All version updates now require only a single change in package.json

## [1.2.2] - 2025-09-04

### Fixed

- Added `"type": "module"` to package.json to eliminate ESLint module type warning
- Renamed jest.config.js to jest.config.cjs for CommonJS compatibility
- Renamed eslint.config.js to eslint.config.mjs for ES module clarity
- Improved module type declarations and configuration consistency

### Technical

- Enhanced ES module support and configuration
- Eliminated performance overhead warning from ESLint module type detection
- Maintained compatibility between Jest (CommonJS) and ESLint (ES module) configurations

## [1.2.1] - 2025-09-04

### Fixed

- Updated ESLint configuration to v9 format (eslint.config.js)
- Fixed all ESLint errors and warnings in source code
- Removed unused imports and variables to improve code quality
- Fixed quote consistency throughout the codebase (single quotes)
- Removed legacy .eslintrc.json configuration file

### Technical

- Migrated from .eslintrc.json to eslint.config.js for ESLint v9 compatibility
- Updated linting rules to be more permissive for Discord.js bot development
- Fixed CI/CD pipeline lint step compatibility

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
