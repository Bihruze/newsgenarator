import React, { useState, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ArticleDisplay } from './components/ArticleDisplay';
import { ImageGenerator } from './components/ImageGenerator';
import { AppState, GeneratedArticle, LogEntry } from './types';
import { scrapeContent } from './services/jinaService';
import { generateArticle } from './services/geminiService';
import { FileText, Loader2 } from 'lucide-react';

const INITIAL_STATE: AppState = {
  sourceUrls: '',
  keywords: '',
  linkDefinitions: '',
  newsAngle: '',
  numSections: 3,
  additionalContent: '',
  promoCoin: 'None',
  customPromoText: '',
  promoMode: 'Full',
  uploadType: 'Post',
  selectedLanguage: 'English'
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<GeneratedArticle | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date(), message, type }]);
    setTimeout(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleStateChange = useCallback((key: keyof AppState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = async () => {
    if (!state.sourceUrls.trim() && !state.additionalContent.trim()) {
      addLog("Please provide at least one source URL or additional content.", 'error');
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setLogs([]); // Clear previous logs
    addLog("Starting generation process...", 'info');

    try {
      // 1. Parse URLs
      const urls = state.sourceUrls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
      const scrapedContents: string[] = [];

      // 2. Scrape content
      if (urls.length > 0) {
        addLog(`Found ${urls.length} source URL(s). Starting extraction...`, 'info');
        for (const url of urls) {
           addLog(`Extracting content from ${url} using Jina...`, 'info');
           try {
             const content = await scrapeContent(url);
             scrapedContents.push(content);
             addLog(`Successfully extracted content from ${url}`, 'success');
           } catch (e: any) {
             addLog(`Failed to extract ${url}: ${e.message}`, 'error');
           }
        }
      }

      if (scrapedContents.length === 0 && !state.additionalContent) {
        throw new Error("No content could be extracted from URLs and no additional content provided.");
      }

      // 3. Generate with Gemini
      addLog(`Generating article with Gemini (${state.selectedLanguage})...`, 'info');
      const generatedArticle = await generateArticle(scrapedContents, state);
      
      setResult(generatedArticle);
      addLog("Article generated successfully!", 'success');

    } catch (error: any) {
      console.error(error);
      addLog(error.message || "An unexpected error occurred", 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Left Column */}
      <Sidebar 
        state={state} 
        onChange={handleStateChange} 
        onGenerate={handleGenerate}
        isProcessing={isProcessing}
      />

      {/* Main Content - Right Column */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <div className="h-16 border-b border-gray-200 flex items-center px-8 bg-white shrink-0">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
             <span className="text-2xl">📝</span>
             News AI Generator
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 relative">
          
          {/* Default Empty State */}
          {!isProcessing && !result && logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <FileText className="w-16 h-16 mb-4 opacity-20" />
               <p>Configure settings and click Generate to start.</p>
            </div>
          )}

          {/* Logs / Progress Overlay */}
          {(isProcessing || logs.length > 0) && !result && (
             <div className="max-w-2xl mx-auto mt-12 p-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">Process Log</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto font-mono text-xs">
                    {logs.map((log, i) => (
                      <div key={i} className={`flex gap-2 ${
                        log.type === 'error' ? 'text-red-600' : 
                        log.type === 'success' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                         <span className="opacity-50">[{log.timestamp.toLocaleTimeString()}]</span>
                         <span>{log.message}</span>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex items-center gap-2 text-blue-600 animate-pulse mt-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Working...
                      </div>
                    )}
                    <div ref={logsEndRef} />
                  </div>
                </div>
             </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="pb-20">
              <ArticleDisplay article={result} />
              
              {/* Featured Image Generation Section */}
              {result.seo.imagePrompt && (
                 <ImageGenerator initialPrompt={result.seo.imagePrompt} />
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;