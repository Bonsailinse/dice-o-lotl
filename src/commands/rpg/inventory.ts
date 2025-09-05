import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { DatabaseService } from '../../database/DatabaseService';

const inventoryCommand: Command = {
    data: new SlashCommandBuilder().setName('inventory').setDescription('Check your inventory'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            // Get or create user
            let user = await DatabaseService.getUserByDiscordId(interaction.user.id);
            if (!user) {
                user = await DatabaseService.createUser(
                    interaction.user.id,
                    interaction.user.username,
                    interaction.user.displayName
                );
            }

            // Get player inventory
            const inventory = await DatabaseService.getPlayerInventory(user.id);

            // Group items by type for better organization
            const itemsByType: { [key: string]: typeof inventory } = {};
            inventory.forEach((invItem) => {
                if (invItem.item) {
                    const type = invItem.item.type;
                    if (!itemsByType[type]) itemsByType[type] = [];
                    itemsByType[type].push(invItem);
                }
            });

            const getItemEmoji = (type: string): string => {
                const typeEmojis: { [key: string]: string } = {
                    weapon: '⚔️',
                    armor: '🛡️',
                    consumable: '🧪',
                    misc: '📦',
                };
                return typeEmojis[type] || '❓';
            };

            const getRarityColor = (rarity: string): number => {
                const colors: { [key: string]: number } = {
                    common: 0x9ca3af,
                    uncommon: 0x10b981,
                    rare: 0x3b82f6,
                    epic: 0x8b5cf6,
                    legendary: 0xf59e0b,
                };
                return colors[rarity] || 0x9ca3af;
            };

            let inventoryDescription = '';
            let totalItems = 0;

            if (Object.keys(itemsByType).length === 0) {
                inventoryDescription = 'Your inventory is empty! Use commands to get some items.';
            } else {
                const typeOrder = ['weapon', 'armor', 'consumable', 'misc'];

                for (const type of typeOrder) {
                    if (itemsByType[type]) {
                        inventoryDescription += `**${type.charAt(0).toUpperCase() + type.slice(1)}s:**\n`;
                        itemsByType[type].forEach((invItem) => {
                            if (invItem.item) {
                                const emoji = getItemEmoji(invItem.item.type);
                                const equippedText = invItem.equipped ? ' *(equipped)*' : '';
                                inventoryDescription += `${emoji} **${invItem.item.name}** x${invItem.quantity}${equippedText}\n`;
                                totalItems += invItem.quantity;
                            }
                        });
                        inventoryDescription += '\n';
                    }
                }
            }

            // Find the most valuable item for embed color
            let embedColor = 0x5865f2;
            if (inventory.length > 0) {
                const mostValuableItem = inventory.reduce((prev, current) =>
                    current.item && prev.item && current.item.value > prev.item.value
                        ? current
                        : prev
                );
                if (mostValuableItem.item) {
                    embedColor = getRarityColor(mostValuableItem.item.rarity);
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(`🎒 Inventory of ${interaction.user.username}`)
                .setColor(embedColor)
                .setDescription(inventoryDescription)
                .addFields(
                    {
                        name: '📦 Total Items',
                        value: `${totalItems}`,
                        inline: true,
                    },
                    {
                        name: '🎯 Unique Items',
                        value: `${inventory.length}`,
                        inline: true,
                    },
                    {
                        name: '💎 Total Value',
                        value: `${inventory.reduce((sum, invItem) => sum + (invItem.item ? invItem.item.value * invItem.quantity : 0), 0)} gold`,
                        inline: true,
                    }
                )
                .setFooter({ text: 'Tip: Use items during battles for strategic advantages!' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error in inventory command:', error);
            await interaction.reply({
                content:
                    '❌ An error occurred while fetching your inventory. Please try again later.',
                ephemeral: true,
            });
        }
    },
};

export default inventoryCommand;
