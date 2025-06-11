// Main entry point for the chimi library
// Clean, scalable architecture for itch.io game data scraping

import { ItchIO } from './providers/games/itch';

// Export the provider classes
export const GAMES = {
  ItchIO: ItchIO,
};

// Export types and models
export * from './models';
export * from './utils';

// Export providers
export * from './providers';

// Default export for convenience
export default {
  GAMES,
};