import { Client } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

export async function loadEvents(client: Client, eventsPath: string): Promise<void> {
    try {
        const eventFiles = await fs.readdir(eventsPath);

        // In development (src), look for .ts files. In production (dist), look for .js files
        const isProductionBuild = __filename.includes('dist');
        const fileExtension = isProductionBuild ? '.js' : '.ts';
        const validFiles = eventFiles.filter(
            (file) => file.endsWith(fileExtension) || (!isProductionBuild && file.endsWith('.js'))
        );

        for (const file of validFiles) {
            const filePath = path.join(eventsPath, file);

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

            const event = await import(importUrl);

            if (event.default.once) {
                client.once(event.default.name, (...args) => event.default.execute(...args));
            } else {
                client.on(event.default.name, (...args) => event.default.execute(...args));
            }

            console.log(`✅ Loaded event: ${event.default.name}`);
        }
    } catch (error) {
        console.error('❌ Error loading events:', error);
    }
}
