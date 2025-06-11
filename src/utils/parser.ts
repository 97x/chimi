import * as cheerio from 'cheerio';
import { IPrice, GamePlatform } from '../models/types';

export class ParserUtils {
  /**
   * Extract price information from text
   */
  static parsePrice(priceText: string): IPrice | undefined {
    if (!priceText || priceText.toLowerCase().includes('free')) {
      return undefined;
    }

    const priceMatch = priceText.match(/\$?([0-9.]+)/);
    if (priceMatch) {
      return {
        amount: parseFloat(priceMatch[1]),
        currency: 'USD',
        formatted: priceText.trim()
      };
    }

    return undefined;
  }

  /**
   * Extract platforms from icon classes
   */
  static parsePlatforms($: cheerio.CheerioAPI, element: any): string[] {
    const platforms: string[] = [];
    const $element = $(element);

    // Check for platform icons
    if ($element.find('.icon-windows, .fa-windows').length > 0) {
      platforms.push(GamePlatform.WINDOWS);
    }
    if ($element.find('.icon-apple, .fa-apple').length > 0) {
      platforms.push(GamePlatform.MAC);
    }
    if ($element.find('.icon-linux, .fa-linux').length > 0) {
      platforms.push(GamePlatform.LINUX);
    }
    if ($element.find('.icon-android, .fa-android').length > 0) {
      platforms.push(GamePlatform.ANDROID);
    }
    if ($element.find('.icon-html5, .fa-html5').length > 0) {
      platforms.push(GamePlatform.WEB);
    }

    return platforms;
  }

  /**
   * Clean and extract text content
   */
  static cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Extract ID from URL
   */
  static extractIdFromUrl(url: string): string {
    const match = url.match(/\/([^\/]+)$/);
    return match ? match[1] : url;
  }

  /**
   * Convert relative URL to absolute
   */
  static toAbsoluteUrl(url: string, baseUrl: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  /**
   * Parse numeric values from text
   */
  static parseNumber(text: string): number | undefined {
    const match = text.match(/([0-9,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    return undefined;
  }
}