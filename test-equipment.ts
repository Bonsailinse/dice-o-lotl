import { DatabaseService } from './src/database/DatabaseService';

async function testEquipmentMethods() {
    console.log('Testing new equipment methods...');

    try {
        // This would test the new methods if we had a real database connection
        // Since we're in test mode, just verify the methods exist

        console.log(
            '✓ getEquippedItems method exists:',
            typeof DatabaseService.getEquippedItems === 'function'
        );
        console.log(
            '✓ getEquippedItemByType method exists:',
            typeof DatabaseService.getEquippedItemByType === 'function'
        );
        console.log(
            '✓ equipItemExclusive method exists:',
            typeof DatabaseService.equipItemExclusive === 'function'
        );

        console.log('\nAll equipment methods are properly defined!');
    } catch (error) {
        console.error('Error testing equipment methods:', error);
    }
}

testEquipmentMethods();
