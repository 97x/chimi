# Chimi Scraper

**Chimi Scraper** is a TypeScript library designed for extracting comprehensive game data from itch.io. Built with a robust, scalable architecture, it enables developers to efficiently scrape game information and build powerful APIs for indie game aggregation platforms, analytics tools, and data-driven applications.

## Overview

Chimi Scraper provides programmatic access to itch.io's extensive game catalog through web scraping techniques.
### Key Capabilities

- **Comprehensive Game Discovery**: Access curated game collections including New & Popular, Top Sellers, Top Rated, and newest releases
- **Advanced Search**: Query games by keywords with pagination support
- **Rich Metadata Extraction**: Retrieve detailed game information including descriptions, screenshots, videos, pricing, platform compatibility, and developer information
- **Production-Ready Architecture**: Provider-based design with abstract base classes for easy extensibility
- **Type Safety**: Full TypeScript support with comprehensive interface definitions
- **Performance Optimized**: Minimal dependencies with efficient scraping algorithms

## Use Cases

### API Development
Build REST APIs for indie game platforms, enabling front-end applications to access itch.io data through standardized endpoints.

### Data Analytics
Create analytics dashboards and reporting tools by aggregating game data, pricing trends, and market insights.

### Game Discovery Platforms
Develop recommendation engines and discovery platforms that leverage itch.io's extensive catalog.

### Market Research
Collect data for market analysis, competitive research, and indie game industry trends.

## Installation

```bash
npm install chimi-scraper
```

## Quick Start

### TypeScript/ESM

```typescript
import { GAMES } from 'chimi-scraper';

const scraper = new GAMES.ItchIO();

// Fetch trending games
const trending = await scraper.fetchNewAndPopular(1);
console.log(`Found ${trending.results.length} trending games`);

// Search for specific games
const searchResults = await scraper.search('puzzle platformer', 1);
console.log(searchResults.results);

// Get detailed game information
const gameDetails = await scraper.fetchGameInfo(searchResults.results[0].url);
console.log(gameDetails);
```

### CommonJS/Node.js

```javascript
const { GAMES } = require('chimi-scraper');

const scraper = new GAMES.ItchIO();

async function fetchGames() {
  try {
    const topSellers = await scraper.fetchTopSellers(1);
    return topSellers.results;
  } catch (error) {
    console.error('Failed to fetch games:', error);
    throw error;
  }
}
```

## Building APIs with Chimi Scraper

Chimi Scraper is designed to be the foundation for building robust game data APIs. Here's how to create a RESTful API:

### Express.js API Example

```typescript
import express from 'express';
import { GAMES } from 'chimi-scraper';

const app = express();
const scraper = new GAMES.ItchIO();

// Get trending games
app.get('/api/games/trending', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const games = await scraper.fetchNewAndPopular(page);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending games' });
  }
});

// Search games
app.get('/api/games/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    
    const results = await scraper.search(query, page);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get detailed game information
app.get('/api/games/:id', async (req, res) => {
  try {
    const gameUrl = decodeURIComponent(req.params.id);
    const gameInfo = await scraper.fetchGameInfo(gameUrl);
    res.json(gameInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
});

app.listen(3000, () => {
  console.log('Game API running on port 3000');
});
```

### API Design Patterns

**RESTful Endpoints Structure:**
```
GET /api/games/trending?page=1
GET /api/games/top-sellers?page=1
GET /api/games/top-rated?page=1
GET /api/games/newest?page=1
GET /api/games/search?q=horror&page=1
GET /api/games/details/:gameId
```

**Response Caching:**
```typescript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 }); // 10 minute cache

app.get('/api/games/trending', async (req, res) => {
  const cacheKey = `trending-${req.query.page || 1}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }
  
  const games = await scraper.fetchNewAndPopular(parseInt(req.query.page) || 1);
  cache.set(cacheKey, games);
  res.json(games);
});
```

## API Reference

### Core Classes

#### `GAMES.ItchIO`
The primary scraper class for itch.io game data extraction.

**Constructor:**
```typescript
const scraper = new GAMES.ItchIO();
```

**Methods:**

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `fetchNewAndPopular` | `page?: number` | `Promise<ISearch<IGameResult>>` | Retrieves games from itch.io's "New & Popular" section |
| `fetchTopSellers` | `page?: number` | `Promise<ISearch<IGameResult>>` | Retrieves top-selling games with sales data |
| `fetchTopRated` | `page?: number` | `Promise<ISearch<IGameResult>>` | Retrieves highest-rated games by user ratings |
| `fetchNewest` | `page?: number` | `Promise<ISearch<IGameResult>>` | Retrieves recently published games |
| `search` | `query: string, page?: number` | `Promise<ISearch<IGameResult>>` | Searches games by keyword with pagination |
| `fetchGameInfo` | `gameUrl: string` | `Promise<IGameInfo>` | Retrieves comprehensive game metadata |

### TypeScript Interfaces

#### `IGameResult`
Basic game information returned from list operations:

```typescript
interface IGameResult {
  id: string;           // Unique game identifier
  title: string;        // Game title
  url: string;          // Direct link to game page
  image?: string;       // Thumbnail image URL
  price?: IPrice;       // Pricing information
  isFree: boolean;      // Free game indicator
  platforms?: string[]; // Supported platforms
  developer?: string;   // Developer/publisher name
}
```

#### `IGameInfo`
Comprehensive game metadata from detailed scraping:

```typescript
interface IGameInfo {
  id: string;
  title: string;
  url: string;
  image?: string;
  cover?: string;       // High-resolution cover image
  description?: string; // Full game description
  genres?: string[];    // Game categories/genres
  tags?: string[];      // User-generated tags
  price?: IPrice;
  isFree: boolean;
  isOnSale?: boolean;   // Sale status indicator
  originalPrice?: IPrice; // Pre-sale pricing
  platforms?: string[]; // Platform compatibility
  releaseDate?: string; // Publication date
  rating?: number;      // Average user rating
  ratingCount?: number; // Number of ratings
  developer?: string;
  publisher?: string;
  screenshots?: string[]; // Game screenshot URLs
  videos?: string[];    // Trailer/video URLs
}
```

#### `ISearch<T>`
Paginated search results container:

```typescript
interface ISearch<T> {
  currentPage?: number;   // Current page number
  hasNextPage?: boolean;  // Next page availability
  totalPages?: number;    // Total page count (when available)
  totalResults?: number;  // Total result count (when available)
  results: T[];          // Array of results
}
```

#### `IPrice`
Pricing information structure:

```typescript
interface IPrice {
  amount: number;     // Numeric price value
  currency: string;   // Currency code (typically "USD")
  formatted: string;  // Display-formatted price string
}
```

## Architecture

Chimi Scraper employs a robust, extensible architecture designed for enterprise-grade applications:

### Design Principles

- **Provider Pattern**: Platform-specific implementations (itch.io) are encapsulated as providers, enabling easy extension to additional gaming platforms
- **Abstract Base Classes**: Common scraping functionality is abstracted into base classes, promoting code reuse and consistency
- **Type Safety**: Comprehensive TypeScript definitions ensure compile-time error detection and enhanced developer experience
- **Separation of Concerns**: Clear separation between data models, HTTP utilities, parsing logic, and provider implementations

### Project Structure

```
chimi-scraper/
├── src/
│   ├── models/                 # Core type definitions and interfaces
│   │   ├── types.ts           # Data structure definitions
│   │   ├── base-parser.ts     # Abstract scraper foundation
│   │   └── game-parser.ts     # Game-specific scraping contracts
│   ├── providers/             # Platform implementations
│   │   └── games/
│   │       └── itch.ts        # itch.io scraping implementation
│   ├── utils/                 # Shared utilities
│   │   ├── http.ts           # HTTP client with retry logic
│   │   └── parser.ts         # HTML parsing helpers
│   └── index.ts              # Public API exports
├── examples/                  # Implementation examples
├── dist/                     # Compiled JavaScript output
└── README.md
```

## Best Practices

### Error Handling
Implement comprehensive error handling for production applications:

```typescript
import { GAMES } from 'chimi-scraper';

const scraper = new GAMES.ItchIO();

async function safelyFetchGames(category: string, page: number = 1) {
  try {
    switch (category) {
      case 'trending':
        return await scraper.fetchNewAndPopular(page);
      case 'top-sellers':
        return await scraper.fetchTopSellers(page);
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  } catch (error) {
    console.error(`Failed to fetch ${category} games:`, error);
    return { results: [], hasNextPage: false, currentPage: page };
  }
}
```

### Rate Limiting & Production Considerations

For high-traffic applications, implement proper rate limiting and caching:

```typescript
import rateLimit from 'express-rate-limit';

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### Response Optimization

Optimize API responses for bandwidth efficiency:

```typescript
app.get('/api/games/trending', async (req, res) => {
  const games = await scraper.fetchNewAndPopular(1);
  
  // Return only essential fields for list views
  const optimizedResults = games.results.map(game => ({
    id: game.id,
    title: game.title,
    url: game.url,
    image: game.image,
    isFree: game.isFree,
    platforms: game.platforms
  }));
  
  res.json({
    ...games,
    results: optimizedResults
  });
});
```

## Performance Considerations

- **Concurrent Requests**: Implement request queuing for bulk operations
- **Caching Strategy**: Cache responses for frequently requested data
- **Connection Pooling**: Reuse HTTP connections for efficiency
- **Error Recovery**: Implement exponential backoff for failed requests

## Contributing

We welcome contributions from the developer community. Please follow these guidelines:

### Development Setup
```bash
git clone https://github.com/97x/chimi.git
cd chimi
npm install
npm run build
```

### Contribution Guidelines
1. **Code Quality**: Maintain TypeScript strict mode compliance
2. **Testing**: Add comprehensive tests for new features
3. **Documentation**: Update relevant documentation and type definitions
4. **Architecture**: Follow established patterns and design principles

### Pull Request Process
1. Fork the repository and create a feature branch
2. Implement changes with appropriate tests
3. Ensure all existing tests pass
4. Update documentation as needed
5. Submit a pull request with a clear description

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Resources

- **Documentation**: [GitHub Repository](https://github.com/97x/chimi)
- **Issues**: [Report bugs and request features](https://github.com/97x/chimi/issues)
- **itch.io Platform**: [Official itch.io website](https://itch.io)

---

**Note**: This library is designed for legitimate data access and should be used in compliance with itch.io's terms of service and robots.txt guidelines. Always implement appropriate rate limiting and respect the platform's resources.
