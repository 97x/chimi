// Base types for the itch scraper library

export interface ITitle {
  romaji?: string;
  english?: string;
  native?: string;
  userPreferred?: string;
}

export interface IImage {
  extraLarge?: string;
  large?: string;
  medium?: string;
  color?: string;
}

export interface IPrice {
  amount: number;
  currency: string;
  formatted: string;
}

export interface IGameInfo {
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

export interface IGameResult {
  id: string;
  title: string;
  url: string;
  image?: string;
  price?: IPrice;
  isFree: boolean;
  platforms?: string[];
  developer?: string;
}

export interface ISearch<T> {
  currentPage?: number;
  hasNextPage?: boolean;
  totalPages?: number;
  totalResults?: number;
  results: T[];
}

export interface IGameScreenshots {
  url: string;
  thumbnail?: string;
}

export interface IGameVideo {
  url: string;
  thumbnail?: string;
  title?: string;
  type?: 'trailer' | 'gameplay' | 'other';
}

export enum GamePlatform {
  WINDOWS = 'Windows',
  MAC = 'macOS',
  LINUX = 'Linux',
  ANDROID = 'Android',
  WEB = 'Web',
  IOS = 'iOS'
}

export enum GameGenre {
  ACTION = 'Action',
  ADVENTURE = 'Adventure',
  PUZZLE = 'Puzzle',
  STRATEGY = 'Strategy',
  SIMULATION = 'Simulation',
  RPG = 'RPG',
  PLATFORMER = 'Platformer',
  FIGHTING = 'Fighting',
  RACING = 'Racing',
  SPORTS = 'Sports',
  HORROR = 'Horror',
  VISUAL_NOVEL = 'Visual Novel',
  EDUCATIONAL = 'Educational',
  MUSIC = 'Music',
  ARCADE = 'Arcade'
}