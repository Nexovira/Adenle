import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  Zap, 
  Layers, 
  Cpu, 
  Code2, 
  GraduationCap, 
  BookOpen, 
  Share2, 
  Mic, 
  MicOff, 
  AlertCircle,
  History,
  Clock,
  X,
  Trash2,
  CornerDownLeft
} from 'lucide-react';
import { ActiveEcosystemView, CurrencyCode } from '../types';
import { WhatsAppSupportButton } from './WhatsAppSupportButton';
import { formatCurrency } from '../lib/currency';
import { 
  getSearchHistory, 
  saveSearchQuery, 
  removeSearchQuery, 
  clearSearchHistory 
} from '../lib/searchHistory';

interface HeroAISearchProps {
  onOpenAI: (query?: string) => void;
  onNavigate: (view: ActiveEcosystemView) => void;
  currentCurrency: CurrencyCode;
  whatsappPhone?: string;
}

export const HeroAISearch: React.FC<HeroAISearchProps> = ({
  onOpenAI,
  onNavigate,
  currentCurrency,
  whatsappPhone = '+2348006392832',
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const recognitionRef = useRef<any>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Initialize search history from local storage and listen for changes
  useEffect(() => {
    setSearchHistory(getSearchHistory());

    const handleHistoryChange = (e: any) => {
      if (e.detail?.history) {
        setSearchHistory(e.detail.history);
      } else {
        setSearchHistory(getSearchHistory());
      }
    };

    window.addEventListener('nexovira_search_history_changed', handleHistoryChange);
    return () => {
      window.removeEventListener('nexovira_search_history_changed', handleHistoryChange);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsInputFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const sampleIntentPrompts = [
    { label: 'Refrigerators under ₦500k', query: 'Find me a refrigerator under ₦500,000', intent: 'Product' },
    { label: 'Learn Web Development', query: 'I want to learn full-stack web development', intent: 'Course' },
    { label: 'Build My Website', query: 'I need someone to build my e-commerce website', intent: 'Service' },
    { label: 'E-Book on Business', query: 'Find me an e-book about business strategy', intent: 'Digital' },
    { label: 'Write Business Plan', query: 'Help me write a business plan for an online shop', intent: 'AI' },
    { label: 'Earn Commissions', query: 'How do I start earning affiliate commissions?', intent: 'Earn' },
  ];

  const handleExecuteSearch = (queryToRun: string) => {
    const clean = queryToRun.trim();
    if (clean) {
      saveSearchQuery(clean);
      setSearchHistory(getSearchHistory());
      setInputQuery(clean);
      setIsInputFocused(false);
      onOpenAI(clean);
    } else {
      setIsInputFocused(false);
      onOpenAI();
    }
  };

  const handleRemoveHistoryItem = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = removeSearchQuery(item);
    setSearchHistory(updated);
  };

  const handleClearAllHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearSearchHistory();
    setSearchHistory([]);
  };

  const toggleVoiceSearch = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechFeedback('Voice search is not supported in this browser. Please type your query.');
      setTimeout(() => setSpeechFeedback(''), 4000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      setSpeechFeedback('Voice input stopped.');
      setTimeout(() => setSpeechFeedback(''), 3000);
      return;
    }

    try {
      // Request mic permission directly via getUserMedia if navigator.mediaDevices is present
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop track immediately as recognition will open its own mic channel
          stream.getTracks().forEach((track) => track.stop());
        } catch (permissionErr: any) {
          if (permissionErr.name === 'NotAllowedError' || permissionErr.name === 'PermissionDeniedError') {
            setIsListening(false);
            setSpeechFeedback('Microphone permission blocked. Please allow mic access in your browser settings.');
            setTimeout(() => setSpeechFeedback(''), 5000);
            return;
          }
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechFeedback('Listening... Speak your request now');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'aborted') {
          setSpeechFeedback('');
          return;
        }
        
        if (event.error === 'no-speech') {
          setSpeechFeedback('No speech detected. Please tap the mic and speak again.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechFeedback('Microphone access denied. Please grant microphone permission in browser settings.');
        } else {
          setSpeechFeedback('Speech input closed. Type your search or try again.');
        }
        setTimeout(() => setSpeechFeedback(''), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      recognitionRef.current = null;
      setSpeechFeedback('Speech recognition error. Please type your search.');
      setTimeout(() => setSpeechFeedback(''), 4000);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteSearch(inputQuery);
  };

  // Filter history queries when user types
  const filteredHistory = inputQuery.trim()
    ? searchHistory.filter((item) => item.toLowerCase().includes(inputQuery.trim().toLowerCase()))
    : searchHistory;

  return (
    <section className="relative overflow-hidden bg-[#070B12] text-white pt-10 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-800/80">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Top Header Pills: Trust & WhatsApp */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs tracking-wide">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Innovation begins with vision. Smart living, better every day.</span>
          </div>

          <WhatsAppSupportButton whatsappNumber={whatsappPhone} variant="hero" />
        </div>

        {/* Main Hero Headline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            What do you want to{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              do today?
            </span>
          </h1>

          <p className="text-cyan-300 font-semibold text-sm sm:text-base italic max-w-2xl mx-auto">
            "Innovation begins with vision. Smart living, better every day."
          </p>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            One connected ecosystem for physical products, appliances, tech services, courses, e-books, and AI intelligence.
          </p>
        </div>

        {/* Large Prominent Hero AI Search Input Bar */}
        <div className="max-w-3xl mx-auto relative" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative group z-20">
            <div className={`relative flex items-center bg-slate-900/95 border-2 rounded-3xl p-2.5 shadow-2xl backdrop-blur-xl transition-all duration-300 focus-within:ring-4 focus-within:ring-cyan-500/20 ${
              isListening ? 'border-red-500 ring-4 ring-red-500/30' : isInputFocused ? 'border-cyan-400 ring-4 ring-cyan-500/20 shadow-cyan-500/10' : 'border-slate-700/80 hover:border-cyan-500/70'
            }`}>
              
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl shrink-0 hidden sm:flex items-center justify-center">
                <Sparkles className="w-6 h-6 animate-pulse text-cyan-400" />
              </div>

              <input
                type="text"
                value={inputQuery}
                onFocus={() => setIsInputFocused(true)}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={isListening ? "Listening to your voice..." : "What are you looking for today? (e.g. Inverter AC, Full-stack course)"}
                className="w-full bg-transparent px-4 py-3 text-base sm:text-lg text-white placeholder:text-slate-400 focus:outline-none"
              />

              {/* Clear typed input button */}
              {inputQuery && (
                <button
                  type="button"
                  onClick={() => setInputQuery('')}
                  className="p-2 text-slate-400 hover:text-white rounded-xl mr-1 transition-colors"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Web Speech API Microphone Toggle Button */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-3 rounded-2xl shrink-0 transition-all mr-1 flex items-center justify-center ${
                  isListening 
                    ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/50 scale-105' 
                    : 'bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700'
                }`}
                title={isListening ? 'Stop Voice Search' : 'Search using Voice Command'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Ask NEXOVIRA</span>
              </button>
            </div>
          </form>

          {/* Interactive Search History Dropdown Popover on Focus */}
          {isInputFocused && filteredHistory.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-2xl z-30 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 px-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recent Searches</span>
                  <span className="text-[10px] font-mono bg-slate-800 text-cyan-400 px-1.5 py-0.2 rounded-full">
                    {filteredHistory.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="text-[11px] text-slate-400 hover:text-red-400 font-semibold flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear all</span>
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
                {filteredHistory.map((queryText, index) => (
                  <div
                    key={`${queryText}-${index}`}
                    onClick={() => handleExecuteSearch(queryText)}
                    className="p-3 px-4 flex items-center justify-between gap-3 hover:bg-cyan-500/10 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-1.5 rounded-xl bg-slate-800 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400 shrink-0 transition-colors">
                        <History className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-200 group-hover:text-white font-medium truncate">
                        {queryText}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-mono">
                        <span>Search</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveHistoryItem(e, queryText)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Remove from history"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voice Search Feedback Banner */}
          {speechFeedback && (
            <div className={`mt-2 p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in ${
              isListening ? 'bg-red-500/20 border border-red-500/40 text-red-300' : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
            }`}>
              {isListening && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
              <span>{speechFeedback}</span>
            </div>
          )}

          {/* Recent Searches Chip Bar (Direct Quick Access below search bar) */}
          {searchHistory.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-bold mr-1">
                <Clock className="w-3 h-3" />
                <span>Recent:</span>
              </div>
              {searchHistory.slice(0, 5).map((historyQuery, idx) => (
                <div
                  key={`chip-${idx}`}
                  className="inline-flex items-center gap-1 bg-slate-900/90 hover:bg-cyan-500/20 border border-slate-800 hover:border-cyan-500/50 rounded-xl px-2.5 py-1 text-xs text-slate-300 hover:text-white transition-all group shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => handleExecuteSearch(historyQuery)}
                    className="flex items-center gap-1.5 font-medium truncate max-w-[140px] sm:max-w-[200px]"
                    title={`Search: "${historyQuery}"`}
                  >
                    <span>{historyQuery}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveHistoryItem(e, historyQuery)}
                    className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors ml-0.5"
                    title="Remove item"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {searchHistory.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="text-[10px] text-slate-500 hover:text-red-400 font-bold px-1.5 py-0.5 underline transition-colors"
                  title="Clear all recent searches"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Intelligent Quick Intent Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 font-bold mr-1">Try asking:</span>
            {sampleIntentPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteSearch(item.query)}
                className="text-xs bg-slate-900/80 hover:bg-cyan-500/20 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 border border-slate-800 rounded-xl px-3 py-1.5 transition-all flex items-center gap-1.5"
              >
                <span className="font-semibold text-cyan-400 text-[10px] uppercase">[{item.intent}]</span>
                <span>"{item.label}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions Layer */}
        <div className="max-w-4xl mx-auto pt-4 border-t border-slate-800/80">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('marketplace')}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-white flex items-center gap-2 transition-all hover:border-cyan-500/50"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Shop Appliances</span>
            </button>

            <button
              onClick={() => onNavigate('ai')}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-white flex items-center gap-2 transition-all hover:border-purple-500/50"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Talk to AI</span>
            </button>

            <button
              onClick={() => onNavigate('academy')}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-white flex items-center gap-2 transition-all hover:border-amber-500/50"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Find a Course</span>
            </button>

            <button
              onClick={() => onNavigate('library')}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-white flex items-center gap-2 transition-all hover:border-emerald-500/50"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Browse E-books</span>
            </button>

            <button
              onClick={() => onNavigate('services')}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-white flex items-center gap-2 transition-all hover:border-blue-500/50"
            >
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Hire a Tech Expert</span>
            </button>

            <button
              onClick={() => onNavigate('affiliate')}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-white flex items-center gap-2 transition-all hover:border-rose-500/50"
            >
              <Share2 className="w-4 h-4 text-rose-400" />
              <span>Start Earning</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

