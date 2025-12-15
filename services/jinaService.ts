export const scrapeContent = async (url: string): Promise<string> => {
  try {
    // Using Jina Reader API
    const jinaUrl = `https://r.jina.ai/${url}`;
    const response = await fetch(jinaUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to scrape ${url}: ${response.statusText}`);
    }

    const text = await response.text();
    return text;
  } catch (error: any) {
    console.error("Scraping error:", error);
    throw new Error(`Scraping failed: ${error.message}`);
  }
};