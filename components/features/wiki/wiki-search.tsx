"use client";

import { useState } from 'react';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { wikiService } from '@/lib/services/wiki-service';
import { WikiSearchResult } from '@/lib/types/wiki-types';

export default function WikiSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<WikiSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<WikiSearchResult | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    setSelectedArticle(null);
    
    try {
      const searchResults = await wikiService.search(searchQuery);
      setResults(searchResults);
      if (searchResults.length === 0) {
        setError('No results found. Try a different search term.');
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticle = async (pageId: number) => {
    setLoading(true);
    setError('');
    
    try {
      const article = await wikiService.getArticle(pageId);
      setSelectedArticle(article);
    } catch (err) {
      setError('Failed to fetch article content. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Wikipedia Search</CardTitle>
          <CardDescription>Search for articles on Wikipedia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Search Wikipedia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.length > 0 && !selectedArticle && (
              <Card className="border col-span-1">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">Search Results</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[60vh] p-4">
                    <div className="space-y-3">
                      {results.map((result) => (
                        <div 
                          key={result.pageId} 
                          className="border p-3 rounded-md hover:bg-accent cursor-pointer transition-colors"
                          onClick={() => fetchArticle(result.pageId)}
                        >
                          <h3 className="font-medium">{result.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {result.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
            
            {selectedArticle && (
              <Card className="border col-span-1 md:col-span-2">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{selectedArticle.title}</CardTitle>
                    <CardDescription>
                      <a 
                        href={`https://en.wikipedia.org/?curid=${selectedArticle.pageId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm hover:underline"
                      >
                        View on Wikipedia
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedArticle(null)}
                  >
                    Back to Results
                  </Button>
                </CardHeader>
                <Separator />
                <CardContent className="p-4">
                  <ScrollArea className="h-[60vh]">
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedArticle.content || '' }} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
            
            {!selectedArticle && results.length === 0 && !loading && !error && (
              <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground/40" />
                <h3 className="mt-4 text-lg font-medium">Search Wikipedia</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter a search term to find articles on Wikipedia
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}