# Chimi

A TypeScript library for scraping game data from itch.io with a clean, scalable architecture. This library provides an intuitive API for fetching game information from various itch.io endpoints.

## Features

- 🎮 **Multiple Game Categories**: New & Popular, Top Sellers, Top Rated, Newest games
- 🔍 **Search Functionality**: Search for games by query
- 📋 **Detailed Game Info**: Fetch comprehensive metadata including descriptions, screenshots, videos, pricing, platforms
- 🏗️ **Clean Architecture**: Follows modern software design patterns for maintainability
- 📦 **TypeScript Support**: Full TypeScript support with proper type definitions
- ⚡ **Lightweight & Fast**: Minimal dependencies, optimized for performance

## Installation

```bash
npm install chimi
```

## Usage

### Basic Usage

```typescript
import { GAMES } from 'chimi';

const itch = new GAMES.ItchIO();

// Get new and popular games
const newAndPopular = await itch.fetchNewAndPopular(1);
console.log(newAndPopular.results);

// Get top sellers
const topSellers = await itch.fetchTopSellers(1);
console.log(topSellers.results);

// Get top rated games
const topRated = await itch.fetchTopRated(1);
console.log(topRated.results);

// Get newest games
const newest = await itch.fetchNewest(1);
console.log(newest.results);

// Search for games
const searchResults = await itch.search('horror', 1);
console.log(searchResults.results);

// Get detailed game information
const gameInfo = await itch.fetchGameInfo('https://example.itch.io/game-url');
console.log(gameInfo);
```

### CommonJS Usage

```javascript
const { GAMES } = require('chimi');

const itch = new GAMES.ItchIO();

async function getGames() {
  try {
    const games = await itch.fetchNewAndPopular(1);
    console.log(games.results);
  } catch (error) {
    console.error('Error fetching games:', error);
  }
}

getGames();
```

## API Reference

### ItchIO Class

#### Methods

##### `fetchNewAndPopular(page?: number): Promise<ISearch<IGameResult>>`
Fetches new and popular games from itch.io.

##### `fetchTopSellers(page?: number): Promise<ISearch<IGameResult>>`
Fetches top selling games from itch.io.

##### `fetchTopRated(page?: number): Promise<ISearch<IGameResult>>`
Fetches top rated games from itch.io.

##### `fetchNewest(page?: number): Promise<ISearch<IGameResult>>`
Fetches newest games from itch.io.

##### `search(query: string, page?: number): Promise<ISearch<IGameResult>>`
Searches for games based on a query string.

##### `fetchGameInfo(gameUrl: string): Promise<IGameInfo>`
Fetches detailed information about a specific game.

### Types

#### `IGameResult`
```typescript
interface IGameResult {
  id: string;
  title: string;
  url: string;
  image?: string;
  price?: IPrice;
  isFree: boolean;
  platforms?: string[];
  developer?: string;
}
```

#### `IGameInfo`
```typescript
interface IGameInfo {
  id: string;
  title: string;
  url: string;
  image?: string;
  cover?: string;
  description?: string;
  genres?: string[];
  tags?: string[];
  price?: IPrice;
  isFree: boolean;
  isOnSale?: boolean;
  originalPrice?: IPrice;
  platforms?: string[];
  releaseDate?: string;
  rating?: number;
  ratingCount?: number;
  developer?: string;
  publisher?: string;
  screenshots?: string[];
  videos?: string[];
}
```

#### `ISearch<T>`
```typescript
interface ISearch<T> {
  currentPage?: number;
  hasNextPage?: boolean;
  totalPages?: number;
  totalResults?: number;
  results: T[];
}
```

## Architecture

This library follows modern architectural patterns for maintainability and scalability:

- **Provider-based architecture**: Each platform (itch.io) is implemented as a provider
- **Abstract base classes**: Common functionality is shared through abstract parsers
- **Type safety**: Full TypeScript support with comprehensive type definitions
- **Modular design**: Easy to extend and maintain

### Project Structure

```
src/
├── models/           # Type definitions and abstract classes
│   ├── types.ts      # Interface definitions
│   ├── base-parser.ts # Base parser abstract class
│   └── game-parser.ts # Game-specific parser abstract class
├── providers/        # Platform-specific implementations
│   └── games/
│       └── itch.ts   # Itch.io provider implementation
├── utils/           # Utility functions
│   ├── http.ts      # HTTP client utilities
│   └── parser.ts    # Parsing helper functions
└── index.ts         # Main entry point
```

## Error Handling

All methods throw descriptive errors when requests fail:

```typescript
try {
  const games = await itch.fetchNewAndPopular(1);
} catch (error) {
  console.error('Failed to fetch games:', error.message);
}
```

## Rate Limiting

The library includes built-in request headers to appear as a regular browser, helping to avoid rate limiting. For production use with high traffic, consider implementing additional rate limiting on your end.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. When contributing:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Follow the established architectural patterns

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [itch.io](https://itch.io) - The platform this library scrapes data from