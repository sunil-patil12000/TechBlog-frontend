import axios from 'axios';

/**
 * Interface for a broken link report
 */
export interface BrokenLinkReport {
  url: string;
  statusCode: number;
  message: string;
  foundOn: string[];
  date: Date;
}

/**
 * Class for checking and reporting broken links
 */
export class LinkChecker {
  private static instance: LinkChecker;
  private brokenLinks: Map<string, BrokenLinkReport>;
  private checkedUrls: Set<string>;
  private isEnabled: boolean;

  constructor() {
    this.brokenLinks = new Map();
    this.checkedUrls = new Set();
    // Only enable in development by default
    this.isEnabled = process.env.NODE_ENV === 'development' || false;
  }

  public static getInstance(): LinkChecker {
    if (!LinkChecker.instance) {
      LinkChecker.instance = new LinkChecker();
    }
    return LinkChecker.instance;
  }

  /**
   * Enable or disable link checking
   */
  public setEnabled(isEnabled: boolean): void {
    this.isEnabled = isEnabled;
  }

  /**
   * Check if a URL is valid
   */
  public async checkUrl(url: string, currentPage: string): Promise<boolean> {
    if (!this.isEnabled) return true;
    
    // Skip if already checked
    if (this.checkedUrls.has(url)) {
      // If it's broken, add the current page to the foundOn list
      if (this.brokenLinks.has(url)) {
        const report = this.brokenLinks.get(url)!;
        if (!report.foundOn.includes(currentPage)) {
          report.foundOn.push(currentPage);
        }
        return false;
      }
      return true;
    }
    
    // Skip checking external URLs
    if (url.startsWith('http') || url.startsWith('//')) {
      return true;
    }
    
    // Skip non-page URLs (e.g. images, CSS, JavaScript, API)
    const skipExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.woff', '.woff2', '.ttf'];
    if (skipExtensions.some(ext => url.endsWith(ext))) {
      return true;
    }
    
    try {
      this.checkedUrls.add(url);
      
      // For internal links, make a HEAD request to check if the page exists
      const response = await axios.head(url);
      return true;
    } catch (error: any) {
      // If error, add to broken links
      const statusCode = error.response?.status || 0;
      const message = error.message || 'Unknown error';
      
      this.brokenLinks.set(url, {
        url,
        statusCode,
        message,
        foundOn: [currentPage],
        date: new Date()
      });
      
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[LinkChecker] Broken link: ${url} (${statusCode}) on page: ${currentPage}`);
      }
      
      return false;
    }
  }

  /**
   * Check multiple URLs at once
   */
  public async checkUrls(urls: string[], currentPage: string): Promise<{
    validUrls: string[];
    brokenUrls: string[];
  }> {
    if (!this.isEnabled) return { validUrls: urls, brokenUrls: [] };
    
    const results = await Promise.all(
      urls.map(async url => ({
        url,
        isValid: await this.checkUrl(url, currentPage)
      }))
    );
    
    return {
      validUrls: results.filter(r => r.isValid).map(r => r.url),
      brokenUrls: results.filter(r => !r.isValid).map(r => r.url)
    };
  }

  /**
   * Get all broken links
   */
  public getBrokenLinks(): BrokenLinkReport[] {
    return Array.from(this.brokenLinks.values());
  }

  /**
   * Clear all broken links
   */
  public clearBrokenLinks(): void {
    this.brokenLinks.clear();
  }

  /**
   * Clear all checked URLs
   */
  public clearCheckedUrls(): void {
    this.checkedUrls.clear();
  }

  /**
   * Reset everything
   */
  public reset(): void {
    this.clearBrokenLinks();
    this.clearCheckedUrls();
  }
}

// Export a singleton instance
export const linkChecker = LinkChecker.getInstance(); 