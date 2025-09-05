/**
 * Test constants and utilities
 * This file provides centralized constants for tests to avoid hardcoding values
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Read version from package.json to keep tests in sync
const packageJsonPath = join(__dirname, '..', '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

export const TEST_VERSION = packageJson.version;
export const TEST_BOT_NAME = 'Dice-o-lotl';

// Mock BOT_CONFIG factory for consistent testing
export const createMockBotConfig = (overrides: any = {}) => ({
    BOT_CONFIG: {
        name: TEST_BOT_NAME,
        version: TEST_VERSION,
        links: {
            github: 'https://github.com/test/repo',
        },
        features: ['RPG', 'Dice Rolling'],
        ...overrides,
    },
});
