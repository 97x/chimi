import { GAMES, IGameResult, IGameInfo } from '../src';

async function demonstrateItchScraper() {
  console.log('Chimi Demo\n');
  
  // Initialize the itch.io provider
  const itch = new GAMES.ItchIO();
  
  try {
    // Example 1: Get new and popular games
    console.log('=== New & Popular Games ===');
    const newAndPopular = await itch.fetchNewAndPopular(1);
    console.log(`Found ${newAndPopular.results.length} games`);
    console.log('Sample game:', newAndPopular.results[0]);
    
    // Example 2: Search for specific games
    console.log('\n=== Search Results ===');
    const searchResults = await itch.search('puzzle', 1);
    console.log(`Found ${searchResults.results.length} puzzle games`);
    
    // Example 3: Get detailed game information
    if (searchResults.results.length > 0) {
      console.log('\n=== Detailed Game Info ===');
      const gameInfo: IGameInfo = await itch.fetchGameInfo(searchResults.results[0].url);
      console.log('Game Title:', gameInfo.title);
      console.log('Developer:', gameInfo.developer);
      console.log('Description:', gameInfo.description?.substring(0, 100) + '...');
      console.log('Screenshots:', gameInfo.screenshots?.length || 0);
      console.log('Platforms:', gameInfo.platforms);
      console.log('Free:', gameInfo.isFree);
    }
    
    // Example 4: Get top sellers
    console.log('\n=== Top Sellers ===');
    const topSellers = await itch.fetchTopSellers(1);
    console.log(`Found ${topSellers.results.length} top selling games`);
    
    // Example 5: Pagination example
    console.log('\n=== Pagination Info ===');
    console.log('Current page:', topSellers.currentPage);
    console.log('Has next page:', topSellers.hasNextPage);
    console.log('Total pages:', topSellers.totalPages || 'Unknown');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the demo
demonstrateItchScraper();