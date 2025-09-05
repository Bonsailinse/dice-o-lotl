import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/Command';

// Mock inventory items
interface InventoryItem {
    name: string;
    quantity: number;
    emoji: string;
}

const inventoryCommand: Command = {
    data: new SlashCommandBuilder().setName('inventory').setDescription('Check your inventory'),

    async execute(interaction: ChatInputCommandInteraction) {
        // Mock inventory data - replace with database fetch
        const inventory: InventoryItem[] = [
            { name: 'Health Potion', quantity: 3, emoji: '🧪' },
            { name: 'Iron Sword', quantity: 1, emoji: '⚔️' },
            { name: 'Leather Armor', quantity: 1, emoji: '🛡️' },
            { name: 'Bread', quantity: 5, emoji: '🍞' },
        ];

        const inventoryList =
            inventory.length > 0
                ? inventory
                      .map((item) => `${item.emoji} **${item.name}** x${item.quantity}`)
                      .join('\n')
                : 'Your inventory is empty!';

        const embed = new EmbedBuilder()
            .setTitle(`🎒 ${interaction.user.username}'s Inventory`)
            .setColor(0x5865f2)
            .setDescription(inventoryList)
            .addFields(
                {
                    name: '📦 Total Items',
                    value: `${inventory.reduce((sum, item) => sum + item.quantity, 0)}`,
                    inline: true,
                },
                { name: '🎯 Inventory Slots', value: `${inventory.length}/20`, inline: true }
            )
            .setFooter({ text: 'Tip: Use items during battles for strategic advantages!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

export default inventoryCommand;
