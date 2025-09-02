# Dice-o-lotl Prompt Engineering Guide

This guide contains example prompts and instructions for extending your Dice-o-lotl Discord bot with AI-powered features.

## 🎯 Core System Prompts

### Character Creation System Prompt
```
You are an RPG game master helping create unique characters for players. When generating a character:

1. Assign base stats appropriate for their chosen class:
   - Strength: Physical power and melee damage
   - Intelligence: Magical power and mana
   - Dexterity: Speed and critical chance
   - Vitality: Health and defense
   - Wisdom: Mana regeneration and spell effectiveness
   - Luck: Item drops and critical damage

2. Create a brief but engaging backstory (2-3 sentences)
3. Suggest starting equipment based on class
4. Include one unique trait or ability

Format the response as JSON for easy parsing.
```

### Battle System Prompt
```
You are managing turn-based RPG combat. For each action:

1. Calculate damage based on:
   - Attacker's stats and equipment
   - Defender's defense and resistances
   - Any active buffs/debuffs
   - Critical hit chance

2. Describe the action cinematically in 1-2 sentences
3. Apply status effects if applicable
4. Check for victory/defeat conditions

Keep descriptions engaging but concise for Discord's character limits.
```

## 🎮 Feature-Specific Prompts

### Quest Generation
```
Generate a quest for a level {level} {class} character in a {setting} environment.

Requirements:
- Main objective clearly stated
- 2-3 optional objectives for bonus rewards
- Appropriate difficulty for character level
- Interesting NPCs with brief descriptions
- Rewards scaled to effort required

Format:
**Quest Name**: [Name]
**Giver**: [NPC Name and brief description]
**Main Objective**: [Clear goal]
**Optional Objectives**: 
- [Optional 1]
- [Optional 2]
**Rewards**: [XP], [Gold], [Items]
**Story**: [2-3 sentence hook]
```

### Item Generation
```
Create a {rarity} {item_type} suitable for level {level} characters.

Rarity tiers:
- Common: Basic stats, no special effects
- Uncommon: Improved stats, minor effects
- Rare: Good stats, one special property
- Epic: Excellent stats, unique effect
- Legendary: Best stats, game-changing effect

Include:
- Creative name reflecting the item's nature
- Flavor text (1-2 sentences of lore)
- Stats appropriate for item type and level
- Special effects for rare+ items
- Gold value based on rarity
```

### NPC Dialogue
```
You are {npc_name}, a {npc_role} in a fantasy RPG world. 

Character traits:
- Personality: {personality_traits}
- Knowledge: {what_they_know}
- Goals: {their_motivations}
- Speech pattern: {how_they_talk}

Respond to the player naturally while:
1. Staying in character
2. Providing helpful information when relevant
3. Offering quests or services if appropriate
4. Using fantasy-appropriate language
5. Keeping responses under 200 characters for Discord
```

## 🏗️ System Architecture Prompts

### Economy Balancing
```
Design economic values for a level {level} area considering:

1. Monster gold drops: {base_value} * level * (0.8-1.2 random)
2. Quest rewards: 5-10x monster drops
3. Item shop prices:
   - Consumables: 1-2 quest rewards
   - Equipment: 10-20 quest rewards
   - Special items: 50+ quest rewards

4. Maintenance costs:
   - Repairs: 10% of item value
   - Inn rest: 1 quest reward
   - Fast travel: 2-3 quest rewards

Ensure progression feels rewarding but not too fast.
```

### Skill System Design
```
Create a skill for the {class} class at level {level}:

Skill categories:
1. Damage: Direct harm to enemies
2. Utility: Buffs, debuffs, or movement
3. Defensive: Shields, healing, or mitigation
4. Ultimate: Powerful long-cooldown abilities

Include:
- Name and description
- Mana/stamina cost
- Cooldown period
- Damage/effect formula
- Upgrade path (how it improves with levels)
- Visual description for flavor
```

## 🎲 Random Event Prompts

### Random Encounters
```
Generate a random encounter for a party traveling through {location}:

Types:
1. Combat: Monsters appropriate for area
2. Social: NPCs with quests or information  
3. Environmental: Weather, obstacles, discoveries
4. Treasure: Hidden caches or rare resources
5. Mystery: Puzzles or strange phenomena

Keep it engaging and level-appropriate. Include:
- Initial description (2-3 sentences)
- Player choices available
- Potential outcomes based on choices
- Rewards or consequences
```

### Dungeon Generation
```
Design a {size} dungeon themed around {theme}:

Room types:
- Entrance: Safe area with dungeon lore
- Combat: Monster encounters
- Puzzle: Challenges requiring thought
- Treasure: Rewards for exploration
- Boss: Climactic encounter
- Secret: Hidden areas with bonus loot

For each room provide:
1. Brief description
2. Contents (monsters/puzzles/loot)
3. Connections to other rooms
4. Environmental hazards if any
```

## 💡 Implementation Tips

### Using AI Responses
1. **Parse JSON**: When possible, request JSON formatted responses for easy integration
2. **Validate Output**: Always validate AI responses before using in-game
3. **Cache Results**: Store generated content to reduce API calls
4. **Fallback Options**: Have default content if AI generation fails

### Prompt Optimization
1. **Be Specific**: Clear constraints produce better results
2. **Provide Examples**: Show desired format in the prompt
3. **Set Limits**: Specify character/word limits for Discord
4. **Test Variations**: Try different phrasings for better results

### Integration Example
```javascript
async function generateQuest(level, playerClass) {
    const prompt = `Generate a quest for a level ${level} ${playerClass} character...`;
    
    try {
        const response = await aiService.generate(prompt);
        const quest = parseQuestResponse(response);
        
        // Validate quest data
        if (!quest.name || !quest.objectives) {
            return getDefaultQuest(level);
        }
        
        return quest;
    } catch (error) {
        console.error('Quest generation failed:', error);
        return getDefaultQuest(level);
    }
}
```

## 🎨 Creative Prompts

### World Building
```
Describe a {type} location in the game world:

Include:
- Name with cultural influence
- Physical description (climate, terrain, architecture)
- Notable landmarks or features
- Common creatures or inhabitants
- One interesting secret or legend
- How it connects to neighboring areas

Keep it rich but concise for loading screens.
```

### Lore Generation
```
Write a lore entry for {subject} in the style of an ancient tome:

Guidelines:
- Use archaic but readable language
- Include historical events or figures
- Add mystery or unresolved questions
- Reference other lore elements
- 100-150 words maximum
- End with scholar's notes or warnings
```

## 📊 Analytics Prompts

### Player Behavior Analysis
```
Analyze this player data and suggest personalized content:

Stats: {player_stats}
Play style: {favorite_activities}
Progress: {completion_rates}

Recommend:
1. Next quest suited to their style
2. Items they might enjoy
3. Areas to explore
4. Skills to develop
5. Challenges at their level
```

### Balance Testing
```
Evaluate if this {content_type} is balanced:

Stats: {numerical_values}
Level requirement: {level}
Comparable content: {similar_items}

Check for:
- Power creep compared to existing content
- Appropriate risk vs reward
- Fun factor vs frustration
- Progression curve impact
- Potential exploits

Suggest adjustments if needed.
```

## 🚀 Advanced Integration

### Dynamic Story Generation
```
Continue this RPG story based on player choices:

Story so far: {previous_events}
Player choice: {selected_option}
Character state: {health, inventory, allies}
World state: {major_events, faction_standings}

Generate:
1. Immediate consequence (1-2 sentences)
2. New situation description
3. 3-4 new choices for the player
4. Hidden consequences to track
5. Hints about optimal path

Maintain continuity and character voice.
```

### Adaptive Difficulty
```
Adjust encounter difficulty based on:

Player performance: {recent_battles}
Current level: {level}
Equipment quality: {gear_score}
Party composition: {party_members}

Modify:
- Enemy health: ±20% based on performance
- Enemy damage: ±15% based on deaths
- Number of enemies: ±1 based on clear speed
- Reward quality: Better for struggling players
- Special mechanics: Add/remove based on skill

Keep it challenging but fair.
```

Remember: These prompts are templates. Customize them based on your bot's specific needs and your community's preferences!
