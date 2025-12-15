import React from 'react';
import { GeneratedArticle } from '../types';
import { Copy, Check, FileCode } from 'lucide-react';

interface ArticleDisplayProps {
  article: GeneratedArticle | null;
}

export const ArticleDisplay: React.FC<ArticleDisplayProps> = ({ article }) => {
  const [copiedJson, setCopiedJson] = React.useState(false);
  const [copiedHtml, setCopiedHtml] = React.useState(false);

  if (!article) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(article, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyHtml = () => {
    // Helper to process markdown links [Anchor](URL) -> <a href="URL">Anchor</a>
    const processContent = (text: string) => {
       // Regex for standard markdown links [text](url)
       return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    };

    const sectionsHtml = article.content.sections.map(section => 
      `<h2>${section.heading}</h2>\n${section.paragraphs.map(p => `<p>${processContent(p)}</p>`).join('\n')}`
    ).join('\n\n');

    const htmlContent = `
<h1>${article.title}</h1>

<p>${processContent(article.content.intro)}</p>

${sectionsHtml}

<hr />

<h3>SEO Metadata</h3>
<p><strong>Slug:</strong> ${article.seo.slug}</p>
<p><strong>Meta Title:</strong> ${article.seo.metaTitle}</p>
<p><strong>Meta Description:</strong> ${article.seo.metaDescription}</p>
<p><strong>Excerpt:</strong> ${article.seo.excerpt}</p>
<p><strong>Image Prompt:</strong> ${article.seo.imagePrompt}</p>
<p><strong>Alt Text:</strong> ${article.seo.altText}</p>
`.trim();

    navigator.clipboard.writeText(htmlContent);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  // Helper to render text with clickable links if formatted as [Anchor](URL)
  const renderWithLinks = (text: string) => {
    // Split by the markdown link regex: [text](url)
    // Capturing groups: 1=text, 2=url
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

    return parts.map((part, index) => {
       const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
       if (match) {
         return (
           <a 
             key={index} 
             href={match[2]} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-blue-600 underline hover:text-blue-800"
           >
             {match[1]}
           </a>
         );
       }
       return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Generated Result</h2>
        <div className="flex gap-3">
          <button
            onClick={handleCopyHtml}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#FF4B4B] border border-[#FF4B4B] rounded hover:bg-red-600 transition-colors shadow-sm"
          >
            {copiedHtml ? <Check className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
            {copiedHtml ? 'Copied HTML' : 'Copy Article HTML'}
          </button>
          
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-sm"
          >
            {copiedJson ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copiedJson ? 'Copied JSON' : 'Copy JSON'}
          </button>
        </div>
      </div>

      {/* SEO Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">SEO Metadata</h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-600 block mb-1">Slug:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-red-600 break-all">{article.seo.slug}</code>
          </div>
          <div>
            <span className="font-semibold text-gray-600 block mb-1">Meta Title:</span>
            <p className="text-gray-800">{article.seo.metaTitle}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-600 block mb-1">Meta Description:</span>
            <p className="text-gray-800">{article.seo.metaDescription}</p>
          </div>
          <div>
             <span className="font-semibold text-gray-600 block mb-1">Excerpt:</span>
             <p className="text-gray-800 italic">{article.seo.excerpt}</p>
          </div>
        </div>
      </div>

      {/* Article Content Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>
        
        <div className="prose max-w-none text-gray-700">
          <p className="text-lg leading-relaxed mb-6 font-medium text-gray-600 border-l-4 border-red-500 pl-4">
            {renderWithLinks(article.content.intro)}
          </p>

          {article.content.sections && article.content.sections.map((section, idx) => (
            <div key={idx} className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-3">{section.heading}</h2>
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="mb-4 leading-relaxed">
                  {renderWithLinks(para)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Raw JSON Preview (Collapsed by default logic or simply listed below) */}
      <div className="mt-8">
        <details className="bg-gray-50 border border-gray-200 rounded-lg">
          <summary className="cursor-pointer p-4 font-medium text-gray-700 hover:bg-gray-100 select-none">
            View Raw JSON Output
          </summary>
          <div className="p-4 overflow-x-auto">
             <pre className="text-xs text-gray-600 font-mono">
               {JSON.stringify(article, null, 2)}
             </pre>
          </div>
        </details>
      </div>

    </div>
  );
};