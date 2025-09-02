import { Client } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';

export async function loadEvents(client: Client, eventsPath: string): Promise<void> {
    try {
        const eventFiles = await fs.readdir(eventsPath);
        const tsFiles = eventFiles.filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        
        for (const file of tsFiles) {
            const filePath = path.join(eventsPath, file);
            const event = await import(filePath);
            
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
