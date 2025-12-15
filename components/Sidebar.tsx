import React from 'react';
import { AppState, Language, PromoMode } from '../types';
import { RefreshCw, CircleHelp } from 'lucide-react';

interface SidebarProps {
  state: AppState;
  onChange: (key: keyof AppState, value: any) => void;
  onGenerate: () => void;
  isProcessing: boolean;
}

const LANGUAGES: Language[] = [
  'English', 'Japanese', 'Thai', 'French', 'German', 'Turkish', 'Spanish', 'Italian'
];

const PROMO_COINS = [
  'None', 
  'Best Wallet', 
  'Bitcoin', 
  'Bitcoin Hyper', 
  'Dogecoin', 
  'Ethereum', 
  'Maxi Doge', 
  'Pepenode', 
  'Pepe Unchained', 
  'Shiba Inu', 
  'Snorter Token', 
  'Solana', 
  'Solaxy', 
  'SUBBD', 
  'XRP'
];

export const Sidebar: React.FC<SidebarProps> = ({ state, onChange, onGenerate, isProcessing }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof AppState, value);
  };

  return (
    <div className="w-full md:w-[400px] bg-gray-50 h-screen overflow-y-auto border-r border-gray-200 flex flex-col font-sans text-sm">
      <div className="p-5 flex flex-col gap-6">
        
        {/* Source URLs */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Enter Source URLs (one per line):</label>
          <textarea
            name="sourceUrls"
            value={state.sourceUrls}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none resize-y h-24"
            placeholder="https://coinmarketcap.com/..."
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Keywords (one per line, first is primary):</label>
          <textarea
            name="keywords"
            value={state.keywords}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none resize-y h-16"
            placeholder="Bitcoin\nCrypto\nETF"
          />
        </div>

        {/* Link Definitions */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Link Definitions (Format: Anchor: [Text] Link: [URL]):</label>
          <textarea
            name="linkDefinitions"
            value={state.linkDefinitions}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none resize-y h-24"
            placeholder={`Anchor: \nLink: `}
          />
        </div>

        {/* Language */}
        <div>
           <label className="block text-gray-700 font-medium mb-1">Target Language:</label>
           <select
            name="selectedLanguage"
            value={state.selectedLanguage}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 outline-none"
           >
             {LANGUAGES.map(lang => (
               <option key={lang} value={lang}>{lang}</option>
             ))}
           </select>
        </div>

        {/* News Angle */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">News Angle / Focus:</label>
          <input
            type="text"
            name="newsAngle"
            value={state.newsAngle}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Number of Sections Slider */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Number of Main Content Sections: <span className="text-red-500 font-bold">{state.numSections}</span></label>
          <input
            type="range"
            name="numSections"
            min="1"
            max="10"
            value={state.numSections}
            onChange={handleInputChange}
            className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>

        {/* Additional Content */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Additional Content (can be treated as another source or additional instruction):</label>
          <textarea
            name="additionalContent"
            value={state.additionalContent}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none resize-y h-24"
          />
        </div>

        {/* Promotional Content */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Select Promotional Content:</label>
          <select
            name="promoCoin"
            value={state.promoCoin}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-blue-500 outline-none"
          >
            {PROMO_COINS.map(coin => (
              <option key={coin} value={coin}>{coin}</option>
            ))}
          </select>
        </div>

        {/* Override Promo Text */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Paste Promotional Text (overrides selection):</label>
          <textarea
            name="customPromoText"
            value={state.customPromoText}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none resize-y h-24"
          />
        </div>

        {/* Promo Mode */}
        <div>
           <div className="flex items-center gap-1 mb-2">
             <label className="text-gray-700 font-medium">Promotional Section Mode</label>
             <CircleHelp className="w-4 h-4 text-gray-400" />
           </div>
           
           <div className="flex flex-col gap-2">
             <label className="flex items-center gap-2 cursor-pointer">
               <input 
                  type="radio" 
                  name="promoMode" 
                  value="Full" 
                  checked={state.promoMode === 'Full'} 
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-500 focus:ring-red-500 accent-red-500"
               />
               <span>Full promotional section + CTA</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
               <input 
                  type="radio" 
                  name="promoMode" 
                  value="CTA Only" 
                  checked={state.promoMode === 'CTA Only'} 
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-500 focus:ring-red-500 accent-red-500"
               />
               <span>CTA only (skip promotional paragraphs)</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
               <input 
                  type="radio" 
                  name="promoMode" 
                  value="No CTA" 
                  checked={state.promoMode === 'No CTA'} 
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-500 focus:ring-red-500 accent-red-500"
               />
               <span>No CTA (skip promotional content)</span>
             </label>
           </div>
        </div>

        {/* Utility Buttons */}
        <div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50 transition-colors text-xs font-medium">
            <RefreshCw className="w-3.5 h-3.5" />
            Reload CTA Cache
          </button>
        </div>
        
        <div className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-gray-700 text-xs flex items-center gap-1">
                 Debug CTA Data <CircleHelp className="w-3 h-3 text-gray-400"/>
            </span>
        </div>

        {/* Upload As */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Upload as:</label>
          <div className="flex flex-col gap-2">
             <label className="flex items-center gap-2 cursor-pointer">
               <input 
                  type="radio" 
                  name="uploadType" 
                  value="Post" 
                  checked={state.uploadType === 'Post'} 
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-500 focus:ring-red-500 accent-red-500"
               />
               <span>Post</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
               <input 
                  type="radio" 
                  name="uploadType" 
                  value="Page" 
                  checked={state.uploadType === 'Page'} 
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-500 focus:ring-red-500 accent-red-500"
               />
               <span>Page</span>
             </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="sticky bottom-0 bg-gray-50 pt-4 pb-6 mt-auto border-t border-gray-200">
           <button
             onClick={onGenerate}
             disabled={isProcessing}
             className={`w-full py-2.5 px-4 rounded font-medium text-white shadow-md transition-all flex items-center justify-center gap-2 ${
               isProcessing 
                 ? 'bg-red-400 cursor-not-allowed' 
                 : 'bg-[#FF4B4B] hover:bg-red-600'
             }`}
           >
             {isProcessing ? (
               <>
                 <RefreshCw className="w-4 h-4 animate-spin" />
                 Processing...
               </>
             ) : (
               <>
                 🚀 Generate Article
               </>
             )}
           </button>
        </div>

      </div>
    </div>
  );
};