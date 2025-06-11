import { BaseParser } from './base-parser';
import { IGameInfo, IGameResult, ISearch } from './types';

export abstract class GameParser extends BaseParser {
  /**
   * Get new and popular games
   */
  abstract fetchNewAndPopular(page?: number): Promise<ISearch<IGameResult>>;

  /**
   * Get top sellers
   */
  abstract fetchTopSellers(page?: number): Promise<ISearch<IGameResult>>;

  /**
   * Get top rated games
   */
  abstract fetchTopRated(page?: number): Promise<ISearch<IGameResult>>;

  /**
   * Get newest games
   */
  abstract fetchNewest(page?: number): Promise<ISearch<IGameResult>>;

  /**
   * Search for games (inherited from BaseParser)
   */
  abstract search(query: string, page?: number): Promise<ISearch<IGameResult>>;

  /**
   * Get detailed game information (inherited from BaseParser)
   */
  abstract fetchGameInfo(gameId: string): Promise<IGameInfo>;
}