# Testing Documentation

This document describes the testing setup and guidelines for the Dice-o-lotl Discord bot.

## Testing Framework

We use **Jest** as our testing framework with TypeScript support via `ts-jest`.

## Test Structure

```
tests/
├── setup.ts                    # Test configuration and global mocks
├── utils/
│   └── testUtils.ts            # Test utilities and helper functions
├── commands/
│   ├── general/
│   │   ├── ping.test.ts        # Unit tests for ping command
│   │   ├── help.test.ts        # Unit tests for help command
│   │   └── status.test.ts      # Unit tests for status command
│   └── rpg/
│       ├── profile.test.ts     # Unit tests for profile command
│       └── inventory.test.ts   # Unit tests for inventory command
├── handlers/
│   └── commandHandler.test.ts  # Unit tests for command handler
├── events/
│   ├── ready.test.ts           # Unit tests for ready event
│   └── interactionCreate.test.ts # Unit tests for interaction handler
└── integration/
    └── commands.integration.test.ts # Integration tests
```

## Available Scripts

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests in CI mode (no watch, with coverage)

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode (for development)

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm run test:coverage
```

### Run specific test file

```bash
npm test -- ping.test.ts
```

### Run tests matching a pattern

```bash
npm test -- --testNamePattern="should execute"
```

## Test Categories

### Unit Tests

- Test individual functions and commands in isolation
- Mock external dependencies (Discord.js, file system, etc.)
- Focus on logic and edge cases

### Integration Tests

- Test multiple components working together
- Verify command flows end-to-end
- Test error handling across components

## Writing Tests

### Command Tests

When testing commands, follow this pattern:

```typescript
import commandName from '../../../src/commands/category/commandName';

describe('Command Name', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should have correct command data', () => {
        expect(commandName.data.name).toBe('commandname');
        expect(commandName.data.description).toBeDefined();
    });

    it('should execute successfully', async () => {
        const mockInteraction = global.createMockInteraction();

        await commandName.execute(mockInteraction);

        expect(mockInteraction.reply).toHaveBeenCalled();
    });
});
```

### Event Tests

When testing events:

```typescript
import eventName from '../../src/events/eventName';

describe('Event Name', () => {
    it('should have correct event properties', () => {
        expect(eventName.name).toBe(Events.EventName);
    });

    it('should handle event correctly', async () => {
        const mockClient = createMockClient();

        await eventName.execute(mockClient);

        // Assert expected behavior
    });
});
```

## Mocking Guidelines

### Discord.js Mocking

Discord.js objects are mocked in `tests/setup.ts`. Common mocks include:

- `SlashCommandBuilder`
- `EmbedBuilder`
- `Client`
- `Collection`
- Interaction objects

### Custom Mocks

Use the utilities in `tests/utils/testUtils.ts`:

- `createMockClient()` - Creates a mock Discord client
- `createMockInteraction()` - Creates a mock interaction
- `createMockCommand()` - Creates a mock command

## Coverage Requirements

We aim for:

- **80%** overall code coverage
- **90%** for critical paths (command execution, error handling)
- **100%** for utility functions

## CI/CD Integration

Tests run automatically on:

- Every push to `main` and `develop` branches
- Every pull request to `main`
- Multiple Node.js versions (18.x, 20.x)

## Debugging Tests

### Common Issues

1. **Mock not working**: Ensure mocks are cleared with `jest.clearAllMocks()` in `beforeEach`
2. **Type errors**: Use `as any` for complex Discord.js type mocking
3. **Async issues**: Always `await` async operations in tests

### Debugging Tips

```bash
# Run single test file with verbose output
npm test -- --verbose ping.test.ts

# Run tests with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Show console.log in tests
npm test -- --verbose --no-coverage
```

## Best Practices

1. **Test naming**: Use descriptive test names that explain the expected behavior
2. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
3. **Mock external dependencies**: Don't rely on actual Discord API or file system
4. **Test edge cases**: Include error conditions and boundary values
5. **Keep tests focused**: One test should verify one specific behavior

## Contributing

When adding new features:

1. Write tests for new commands/functions
2. Ensure existing tests still pass
3. Aim for high test coverage
4. Update this documentation if needed
