import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

export class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  async get(url: string, config?: AxiosRequestConfig): Promise<string> {
    try {
      const response: AxiosResponse = await axios.get(url, {
        baseURL: this.baseURL,
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        ...config,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`HTTP request failed: ${error}`);
    }
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<string> {
    try {
      const response: AxiosResponse = await axios.post(url, data, {
        baseURL: this.baseURL,
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Content-Type': 'application/json',
        },
        ...config,
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`HTTP request failed: ${error}`);
    }
  }
}