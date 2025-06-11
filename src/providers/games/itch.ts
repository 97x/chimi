import * as cheerio from 'cheerio';
import { GameParser } from '../../models/game-parser';
import { IGameInfo, IGameResult, ISearch, IPrice, IGameScreenshots, IGameVideo } from '../../models/types';
import { HttpClient, ParserUtils } from '../../utils';

export class ItchIO extends GameParser {
  private httpClient: HttpClient;

  constructor() {
    super('https://itch.io', 'ItchIO', 'GAMES');
    this.httpClient = new HttpClient(this.baseUrl);
  }

  async search(query: string, page: number = 1): Promise<ISearch<IGameResult>> {
    try {
      const searchUrl = `/search?q=${encodeURIComponent(query)}&page=${page}`;
      const html = await this.httpClient.get(searchUrl);
      const $ = cheerio.load(html);

      const results: IGameResult[] = [];
      
      $('.game_cell').each((_, element) => {
        const gameResult = this.parseGameCell($, element);
        if (gameResult) {
          results.push(gameResult);
        }
      });

      const pagination = this.parsePagination($);

      return {
        currentPage: page,
        results,
        ...pagination
      };
    } catch (error) {
      throw new Error(`Failed to search games: ${error}`);
    }
  }

  async fetchNewAndPopular(page: number = 1): Promise<ISearch<IGameResult>> {
    return this.fetchGamesByCategory('new-and-popular', page);
  }

  async fetchTopSellers(page: number = 1): Promise<ISearch<IGameResult>> {
    return this.fetchGamesByCategory('top-sellers', page);
  }

  async fetchTopRated(page: number = 1): Promise<ISearch<IGameResult>> {
    return this.fetchGamesByCategory('top-rated', page);
  }

  async fetchNewest(page: number = 1): Promise<ISearch<IGameResult>> {
    return this.fetchGamesByCategory('newest', page);
  }

  async fetchGameInfo(gameUrl: string): Promise<IGameInfo> {
    try {
      const url = gameUrl.startsWith('http') ? gameUrl : `${this.baseUrl}${gameUrl}`;
      const html = await this.httpClient.get(url);
      const $ = cheerio.load(html);

      const title = $('.game_title').first().text().trim() || $('h1').first().text().trim();
      const description = $('.formatted_description, .user_formatted').first().text().trim();
      
      // Extract basic info
      const developer = this.extractDeveloper($);
      const cover = this.extractCoverImage($);
      const platforms = this.extractPlatforms($);
      const genres = this.extractGenres($);
      const tags = this.extractTags($);
      
      // Extract pricing info
      const { price, isFree, isOnSale, originalPrice } = this.extractPricingInfo($);
      
      // Extract media
      const screenshots = this.extractScreenshots($);
      const videos = this.extractVideos($);
      
      // Extract ratings
      const { rating, ratingCount } = this.extractRatingInfo($);
      
      // Extract release date
      const releaseDate = $('.game_info_panel_widget abbr, .release_date abbr').attr('title');

      return {
        id: ParserUtils.extractIdFromUrl(url),
        title,
        url,
        cover,
        description,
        developer,
        platforms,
        genres,
        tags,
        price,
        isFree,
        isOnSale,
        originalPrice,
        rating,
        ratingCount,
        releaseDate,
        // Additional metadata
        screenshots: screenshots.map(s => s.url),
        videos: videos.map(v => v.url)
      };
    } catch (error) {
      throw new Error(`Failed to fetch game info: ${error}`);
    }
  }

  private async fetchGamesByCategory(category: string, page: number): Promise<ISearch<IGameResult>> {
    try {
      const categoryUrl = `/games/${category}${page > 1 ? `?page=${page}` : ''}`;
      const html = await this.httpClient.get(categoryUrl);
      const $ = cheerio.load(html);

      const results: IGameResult[] = [];
      
      $('.game_cell, .game_cell_data').each((_, element) => {
        const gameResult = this.parseGameCell($, element);
        if (gameResult) {
          results.push(gameResult);
        }
      });

      const pagination = this.parsePagination($);

      return {
        currentPage: page,
        results,
        ...pagination
      };
    } catch (error) {
      throw new Error(`Failed to fetch ${category} games: ${error}`);
    }
  }

  private parseGameCell($: cheerio.CheerioAPI, element: any): IGameResult | null {
    try {
      const $game = $(element);
      
      const title = $game.find('.game_title, .title').first().text().trim();
      const gameLink = $game.find('.game_link, a').first().attr('href');
      const url = gameLink ? ParserUtils.toAbsoluteUrl(gameLink, this.baseUrl) : '';
      
      if (!title || !url) {
        return null;
      }

      const image = $game.find('.game_thumb img, img').first().attr('src');
      const priceText = $game.find('.price, .game_price').first().text().trim();
      const price = ParserUtils.parsePrice(priceText);
      const isFree = !price;
      
      const platforms = ParserUtils.parsePlatforms($, element);
      const developer = $game.find('.game_author, .author').first().text().trim();

      return {
        id: ParserUtils.extractIdFromUrl(url),
        title,
        url,
        image,
        price,
        isFree,
        platforms,
        developer
      };
    } catch (error) {
      console.warn('Failed to parse game cell:', error);
      return null;
    }
  }

  private parsePagination($: cheerio.CheerioAPI): { hasNextPage: boolean; totalPages?: number } {
    const paginationText = $('.pager_label').text();
    const match = paginationText.match(/Page (\d+) of (\d+)/);
    
    if (match) {
      const currentPage = parseInt(match[1]);
      const totalPages = parseInt(match[2]);
      return {
        hasNextPage: currentPage < totalPages,
        totalPages
      };
    }

    // Check for next page link
    const hasNextPage = $('.next_page').length > 0;
    return { hasNextPage };
  }

  private extractDeveloper($: cheerio.CheerioAPI): string {
    return $('.game_author a, .user_name').first().text().trim();
  }

  private extractCoverImage($: cheerio.CheerioAPI): string | undefined {
    return $('.game_thumb img, .header_image img, .cover_image img').first().attr('src');
  }

  private extractPlatforms($: cheerio.CheerioAPI): string[] {
    const platforms: string[] = [];
    
    if ($('.icon-windows, .fa-windows').length > 0) platforms.push('Windows');
    if ($('.icon-apple, .fa-apple').length > 0) platforms.push('macOS');
    if ($('.icon-linux, .fa-linux').length > 0) platforms.push('Linux');
    if ($('.icon-android, .fa-android').length > 0) platforms.push('Android');
    if ($('.icon-html5, .fa-html5').length > 0) platforms.push('Web');

    return platforms;
  }

  private extractGenres($: cheerio.CheerioAPI): string[] {
    const genres: string[] = [];
    
    $('.game_genre, .genre_tag, .classification_tag').each((_, element) => {
      const genre = $(element).text().trim();
      if (genre) genres.push(genre);
    });

    return genres;
  }

  private extractTags($: cheerio.CheerioAPI): string[] {
    const tags: string[] = [];
    
    $('.game_tag_link, .tag').each((_, element) => {
      const tag = $(element).text().trim();
      if (tag) tags.push(tag);
    });

    return tags;
  }

  private extractPricingInfo($: cheerio.CheerioAPI): {
    price?: IPrice;
    isFree: boolean;
    isOnSale?: boolean;
    originalPrice?: IPrice;
  } {
    const priceElement = $('.buy_btn .price, .price').first();
    const priceText = priceElement.text().trim();
    
    let price = ParserUtils.parsePrice(priceText);
    let isFree = !price;
    let isOnSale = false;
    let originalPrice: IPrice | undefined;

    // Check for sale pricing
    const originalPriceElement = $('.original_price');
    if (originalPriceElement.length > 0) {
      const originalPriceText = originalPriceElement.text().trim();
      originalPrice = ParserUtils.parsePrice(originalPriceText);
      if (originalPrice) {
        isOnSale = true;
      }
    }

    return { price, isFree, isOnSale, originalPrice };
  }

  private extractScreenshots($: cheerio.CheerioAPI): IGameScreenshots[] {
    const screenshots: IGameScreenshots[] = [];
    
    $('.screenshot img, .screenshot_list img').each((_, element) => {
      const url = $(element).attr('src') || $(element).attr('data-src');
      if (url) {
        screenshots.push({ url });
      }
    });

    return screenshots;
  }

  private extractVideos($: cheerio.CheerioAPI): IGameVideo[] {
    const videos: IGameVideo[] = [];
    
    // YouTube embeds
    $('iframe[src*="youtube.com"], iframe[src*="youtu.be"]').each((_, element) => {
      const url = $(element).attr('src');
      if (url) {
        videos.push({
          url,
          type: 'trailer'
        });
      }
    });

    // Vimeo embeds
    $('iframe[src*="vimeo.com"]').each((_, element) => {
      const url = $(element).attr('src');
      if (url) {
        videos.push({
          url,
          type: 'trailer'
        });
      }
    });

    return videos;
  }

  private extractRatingInfo($: cheerio.CheerioAPI): { rating?: number; ratingCount?: number } {
    const ratingText = $('.aggregate_rating, .rating_value').text();
    const rating = ratingText ? parseFloat(ratingText) : undefined;
    
    const ratingCountText = $('.rating_count').text();
    const ratingCount = ParserUtils.parseNumber(ratingCountText);

    return { rating, ratingCount };
  }
}