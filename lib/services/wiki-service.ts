"use client";

import { WikiSearchResult } from '../types/wiki-types';

class WikiService {
  private baseUrl = 'https://en.wikipedia.org/w/api.php';
  
  async search(query: string): Promise<WikiSearchResult[]> {
    // In a real implementation, this would call the Wikipedia API
    // For demo purposes, return mock data
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            pageId: 1,
            title: `${query} - Main Article`,
            snippet: `This is the main article about ${query}. It contains comprehensive information about the subject including its history, significance, and various aspects.`
          },
          {
            pageId: 2,
            title: `History of ${query}`,
            snippet: `Explore the rich history and evolution of ${query} from its early origins to modern developments and how it has shaped our world today.`
          },
          {
            pageId: 3,
            title: `${query} in Popular Culture`,
            snippet: `Discover how ${query} has influenced and been represented in literature, film, music, and other forms of media throughout different time periods.`
          }
        ]);
      }, 800);
    });
  }
  
  async getArticle(pageId: number): Promise<WikiSearchResult> {
    // In a real implementation, this would fetch the full article content
    // For demo purposes, return mock article content
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          pageId: pageId,
          title: pageId === 1 ? "Main Article" : pageId === 2 ? "History" : "In Popular Culture",
          snippet: "Article summary...",
          content: `<h1>Article Title</h1>
                    <p>This is a sample Wikipedia article content. In a real implementation, this would contain the actual article text fetched from Wikipedia's API.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <h2>Section 1</h2>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <h2>Section 2</h2>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`
        });
      }, 800);
    });
  }
}

export const wikiService = new WikiService();