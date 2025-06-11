import { IGameInfo, IGameResult, ISearch } from './types';

export abstract class BaseParser {
  protected baseUrl: string;
  protected name: string;
  protected classPath: string;

  constructor(baseUrl: string, name: string, classPath: string) {
    this.baseUrl = baseUrl;
    this.name = name;
    this.classPath = classPath;
  }

  /**
   * Search for games
   */
  abstract search(query: string, page?: number): Promise<ISearch<IGameResult>>;

  /**
   * Get detailed game information
   */
  abstract fetchGameInfo(gameId: string): Promise<IGameInfo>;
}