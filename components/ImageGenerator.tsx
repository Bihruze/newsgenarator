import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, RotateCcw, Palette, Loader2 } from 'lucide-react';
import { generateImage } from '../services/geminiService';

interface ImageGeneratorProps {
  initialPrompt: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ initialPrompt }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string | null>(null);

  // Update prompt if initialPrompt changes (e.g. new article generated)
  useEffect(() => {
    setPrompt(initialPrompt);
    setImageData(null);
    setLastUsedPrompt(null);
  }, [initialPrompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    try {
      const base64Data = await generateImage(prompt);
      setImageData(base64Data);
      setLastUsedPrompt(prompt);
    } catch (err: any) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setImageData(null);
    setLastUsedPrompt(null);
    setPrompt(initialPrompt);
    setError(null);
  };

  if (!initialPrompt) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 animate-in fade-in duration-500 pt-0">
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
           <ImageIcon className="w-6 h-6 text-green-600" />
           <h2 className="text-xl font-bold text-gray-800">Featured Image Generation (Seedream Text-to-Image)</h2>
        </div>

        {/* Reset Button */}
        <div className="mb-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Image
          </button>
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
           <label className="block text-sm font-medium text-gray-700 mb-2">Refine Image Prompt</label>
           <textarea 
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-sm focus:ring-1 focus:ring-green-500 outline-none resize-none h-24 leading-relaxed"
           />
        </div>

        {/* Generate Button */}
        <div className="mb-8">
           <button
             onClick={handleGenerate}
             disabled={isGenerating || !prompt.trim()}
             className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all shadow-sm ${
                isGenerating 
                ? 'bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-200' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-green-600 hover:border-green-300'
             }`}
           >
             {isGenerating ? (
               <>
                 <Loader2 className="w-4 h-4 animate-spin" />
                 Generating...
               </>
             ) : (
               <>
                 <Palette className="w-4 h-4 text-orange-500" />
                 Generate/Regenerate Image (Seedream)
               </>
             )}
           </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            Error: {error}
          </div>
        )}

        {/* Image Display */}
        {imageData && (
          <div className="animate-in fade-in duration-700">
             <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-900">
                <img 
                  src={`data:image/png;base64,${imageData}`} 
                  alt="Generated" 
                  className="w-full h-auto object-cover block"
                />
             </div>
             
             {lastUsedPrompt && (
                <div className="mt-3 text-xs text-gray-500 italic">
                   Generated using prompt: '{lastUsedPrompt}'
                </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};