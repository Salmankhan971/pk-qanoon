/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Scale,
  Search,
  Users,
  Home,
  Briefcase,
  ShoppingBag,
  ShieldAlert,
  FileText,
  Languages,
  BookOpen,
  MessageSquare,
  Plus,
  Trash2,
  Send,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronRight,
  ArrowRight,
  BookMarked,
  Info,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LOCALIZATION, COMMON_URDU_WORDS } from './localization';
import { LEGAL_TOPICS, DICTIONARY_ENTRIES } from './data';
import { Message, ChatSession, Language, LegalDomain } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab ] = useState<'assistant' | 'guides' | 'dictionary'>('assistant');
  
  // Chat State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Browse Guides State
  const [selectedTopicId, setSelectedTopicId] = useState<LegalDomain>('family');
  
  // Dictionary Search State
  const [dictSearch, setDictSearch] = useState<string>('');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Reference for scrolling chat to bottom
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Load state from local storage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('pak_legal_sessions');
    const savedLang = localStorage.getItem('pak_legal_lang');
    
    if (savedLang === 'en' || savedLang === 'ur') {
      setLanguage(savedLang);
    }
    
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        if (parsed && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error('Error parsing saved sessions', e);
      }
    }
    
    // Initialize with a default session if empty
    const defaultSessionId = 'welcome-session';
    const initialSession: ChatSession = {
      id: defaultSessionId,
      title: language === 'en' ? 'General Assessment' : 'عام جائزہ',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'welcome-msg',
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          text: JSON.stringify({
            legalAreas: language === 'en' ? ['Pakistan Legal Info'] : ['پاکستانی قانونی رہنمائی'],
            statutes: language === 'en' ? ['Constitution of Pakistan, 1973'] : ['سلوک اور بنیادی آئینی حقوق'],
            explanation: language === 'en' 
              ? "Assalam-o-Alaikum! Welcome to the Pakistan Legal Guidance Assistant.\n\nI am an AI assistant loaded strictly with the legal systems of Pakistan. I am capable of explaining statutory guidelines, rights, and potential legal courses of action in plain Urdu and English.\n\nHow can I help you today? You can write any custom query below or pick a category template from the sidebar to begin."
              : "السلام علیکم! پاکستانی قانونی رہنمائی اسسٹنٹ میں خوش آمدید۔\n\nمیں ایک آرٹیفیشل انٹیلیجنس اسسٹنٹ ہوں جو مکمل طور پر صرف پاکستانی قوانین اور ضابطوں سے مطابقت رکھتا ہوں۔ میں خاندانی معاملات، زمین، دفتری امور، ہراسگی اور پولیس کے ضابطوں پر اردو اور انگریزی میں واضح نکتہ نظر فراہم کر سکتا ہوں۔\n\nمیں آج آپ کی کیا مدد کر سکتا ہوں؟ آپ نیچے اپنا سوال لکھ سکتے ہیں یا بائیں ہاتھ پر بنے ٹیمپلیٹس سے مدد لے سکتے ہیں۔",
            steps: language === 'en' 
              ? [
                  "Select a legal class (Family, Property, Cybercrime, Criminal, Civil, Consumer) to view ready scenarios.",
                  "Draft your situation with location, facts, and documents.",
                  "Review identified Acts, sections, and legal checkpoints printed in the diagnostic card directly.",
                ]
              : [
                  "تیار شدہ ٹیمپلیٹس کا جائزہ لینے کے لیے بائیں مینو سے کسی ایک زمرے پر کلک کریں۔",
                  "اپنا سوال مقام، گواہوں اور تحریری کاغذات کی تفصیل کے ساتھ پیش کریں۔",
                  "عدالتی اقدامات اور اگلے ممکنہ مراحل کو براہِ راست جائزہ کارڈ میں دیکھیں۔"
                ],
            disclaimer: LOCALIZATION[language].warningDisclaimerText,
            clarificationNeeded: false
          })
        }
      ]
    };
    setSessions([initialSession]);
    setActiveSessionId(defaultSessionId);
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('pak_legal_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Adjust scroll when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, isGenerating]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Helper toggle language
  const handleLanguageToggle = () => {
    const nextLang: Language = language === 'en' ? 'ur' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('pak_legal_lang', nextLang);
  };

  // Helper start a brand new session
  const startNewSession = (domain?: LegalDomain) => {
    const id = `session-${Date.now()}`;
    const title = language === 'en' 
      ? `Case Study - ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
      : `قانونی مطالعہ - ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    
    const newSess: ChatSession = {
      id,
      title,
      createdAt: new Date().toISOString(),
      domain: domain || 'general',
      messages: [
        {
          id: `init-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          text: JSON.stringify({
            legalAreas: language === 'en' ? ['Pakistan Statutory Framework'] : ['تعزیراتِ پاکستان'],
            statutes: [],
            explanation: language === 'en' 
              ? `You have started a new legal inquiry session concerning **${domain ? domain.toUpperCase() : 'General Legal Matters'}**. Describe your issue in detail. Please mention key facts, presence of written proof, and location (e.g., city/province) as procedures can vary.`
              : `آپ نے **${domain ? domain.toUpperCase() : 'عام قانونی جائزہ'}** سے متعلق نیا سیشن شروع کیا ہے۔ براہ کرم اپنا مسئلہ تفصیل سے لکھیں۔ دعوے کی مضبوطی جاننے کے لیے شہر یا صوبہ اور تحریری ثبوتوں کا ذکر ضرور کریں۔`,
            steps: [],
            disclaimer: LOCALIZATION[language].warningDisclaimerText,
            clarificationNeeded: false
          })
        }
      ]
    };

    setSessions(prev => [newSess, ...prev]);
    setActiveSessionId(id);
    setActiveTab('assistant');
  };

  // Helper delete session
  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (activeSessionId === id && updated.length > 0) {
      setActiveSessionId(updated[0].id);
    } else if (updated.length === 0) {
      // Re-initialize if all deleted
      const defaultId = 'welcome-session';
      const initialSession: ChatSession = {
        id: defaultId,
        title: language === 'en' ? 'General Assessment' : 'عام جائزہ',
        createdAt: new Date().toISOString(),
        messages: [{
          id: 'welcome-msg',
          sender: 'assistant',
          timestamp: new Date().toISOString(),
          text: JSON.stringify({
            legalAreas: ['General System'],
            statutes: [],
            explanation: LOCALIZATION[language].noMessagesYet,
            steps: [],
            disclaimer: LOCALIZATION[language].warningDisclaimerText,
            clarificationNeeded: false
          })
        }]
      };
      setSessions([initialSession]);
      setActiveSessionId(defaultId);
    }
  };

  // Handle legal assistant submission
  const handleSubmitMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;

    const userMessageTime = new Date().toISOString();
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: userMessageTime,
      text: textToSend,
      status: 'success'
    };

    // Update active session with user message
    const currentSessionId = activeSessionId || sessions[0]?.id;
    let targetSession = sessions.find(s => s.id === currentSessionId);
    if (!targetSession) return;

    const updatedMessages = [...targetSession.messages, userMsg];
    
    // Change session title if it was default
    let updatedTitle = targetSession.title;
    if (targetSession.messages.length <= 1) {
      updatedTitle = textToSend.slice(0, 25) + (textToSend.length > 25 ? '...' : '');
    }

    setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, title: updatedTitle, messages: updatedMessages } : s));
    setInputValue('');
    setIsGenerating(true);

    try {
      // Send chat request to our Express endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          // Extract plain-language history of our current session to feed to the ai
          history: updatedMessages.slice(0, -1).map(m => ({
            sender: m.sender,
            text: m.sender === 'user' ? m.text : extractPlainExplanation(m.text)
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: JSON.stringify(data)
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, assistantMsg]
          };
        }
        return s;
      }));
    } catch (err: any) {
      console.error('Error matching diagnostic:', err);
      // Append fallback error response
      const errResponseMsg: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: JSON.stringify({
          legalAreas: [language === 'en' ? 'System Error' : 'سسٹم خرابی'],
          statutes: [],
          explanation: language === 'en' 
            ? `Unable to securely connect to the Gemini LLM service. Please specify if your GEMINI_API_KEY is configured under Settings > Secrets. Details: ${err.message}`
            : `جیمنی سروس سے مواصلت ناکام ہو گئی۔ براہ کرم اپنے انٹرنیٹ اور جیمنی کیز کی ترتیب کا جائزہ لیں۔ تفصیل: ${err.message}`,
          steps: [
            language === 'en' ? "Verify your API key is declared securely in Settings > Secrets." : "اپنے مینو میں جیمنی سیکریٹ کی چیک کریں۔",
            language === 'en' ? "Retry sending your message details." : "اپنا سوال دوبارہ ارسال کرنے کی کوشش کریں۔"
          ],
          disclaimer: LOCALIZATION[language].warningDisclaimerText,
          clarificationNeeded: false
        })
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, errResponseMsg]
          };
        }
        return s;
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper extract explanation in plain text if parsing fails
  const extractPlainExplanation = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      return parsed.explanation || text;
    } catch (e) {
      return text;
    }
  };

  // Helper append custom Urdu helper word to user input
  const handleWordHelperClick = (word: string) => {
    setInputValue(prev => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${word}` : word;
    });
  };

  // Dynamic Icon selector from Lucide-React
  const renderLogoIcon = (name: string, className: string = "w-5 h-5") => {
    switch (name) {
      case 'Users': return <Users className={className} />;
      case 'Home': return <Home className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'FileText': return <FileText className={className} />;
      default: return <Scale className={className} />;
    }
  };

  // Filter dictionary based on search query
  const filteredDict = DICTIONARY_ENTRIES.filter(entry => {
    const q = dictSearch.toLowerCase();
    const matchesEn = entry.term.en.toLowerCase().includes(q) || entry.meaning.en.toLowerCase().includes(q);
    const matchesUr = entry.term.ur.includes(q) || entry.meaning.ur.includes(q);
    return matchesEn || matchesUr;
  });

  return (
    <div id="app-root-container" className="min-h-screen flex flex-col bg-brand-linen text-slate-900 font-sans transition-colors select-none">
      
      {/* 1. Header Navigation Panel */}
      <header id="app-main-header" className="h-20 bg-white border-b border-slate-200 flex items-center sticky top-0 z-40 transition-all shadow-xs">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-12 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div id="header-brand-box" className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <h1 id="header-title" className={`font-serif text-2xl sm:text-3xl font-black tracking-tighter text-brand-green leading-none ${language === 'ur' ? 'urdu-text' : ''}`}>
                QANOON<span className="text-slate-400 font-light tracking-widest ml-1 text-xl sm:text-2xl">.AI</span>
              </h1>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-350"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
                {language === 'en' ? 'Official Legal Assistant' : 'پاکستانی قانونی معاون'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Statutory Codes Console</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Pakistan Region</span>
            </div>
          </div>

          {/* Nav Controls */}
          <div id="header-navigation" className="flex items-center gap-6 sm:gap-8">
            
            {/* View Tab Buttons */}
            <nav id="navbar-tabs" className="hidden md:flex items-center gap-8">
              <button
                id="tab-btn-assistant"
                onClick={() => setActiveTab('assistant')}
                className={`relative py-1 text-xs font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap ${
                  activeTab === 'assistant' 
                    ? 'text-brand-green border-b-2 border-brand-green' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {LOCALIZATION[language].navAssistant}
              </button>
              <button
                id="tab-btn-guides"
                onClick={() => setActiveTab('guides')}
                className={`relative py-1 text-xs font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap ${
                  activeTab === 'guides' 
                    ? 'text-brand-green border-b-2 border-brand-green' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {LOCALIZATION[language].navTopics}
              </button>
              <button
                id="tab-btn-dictionary"
                onClick={() => setActiveTab('dictionary')}
                className={`relative py-1 text-xs font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap ${
                  activeTab === 'dictionary' 
                    ? 'text-brand-green border-b-2 border-brand-green' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {LOCALIZATION[language].navDictionary}
              </button>
            </nav>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            {/* Language Toggle Pill Design */}
            <div id="language-pill-toggle" className="flex bg-slate-100 rounded-full p-1 border border-slate-200 shrink-0">
              <button
                onClick={() => { setLanguage('en'); localStorage.setItem('pak_legal_lang', 'en'); }}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                ENGLISH
              </button>
              <button
                onClick={() => { setLanguage('ur'); localStorage.setItem('pak_legal_lang', 'ur'); }}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                  language === 'ur' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                اردو
              </button>
            </div>

          </div>
        </div>

        {/* Small screen mobile navigation rail */}
        <div id="mobile-navbar" className="md:hidden flex items-center justify-around border-t border-slate-200 bg-white py-2 text-[10px] font-bold tracking-wider uppercase fixed bottom-0 left-0 right-0 z-40 shadow-lg">
          <button
            id="mobile-tab-assistant"
            onClick={() => setActiveTab('assistant')}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${activeTab === 'assistant' ? 'text-brand-green' : 'text-slate-400'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{LOCALIZATION[language].navAssistant}</span>
          </button>
          <button
            id="mobile-tab-guides"
            onClick={() => setActiveTab('guides')}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${activeTab === 'guides' ? 'text-brand-green' : 'text-slate-400'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{LOCALIZATION[language].navTopics}</span>
          </button>
          <button
            id="mobile-tab-dictionary"
            onClick={() => setActiveTab('dictionary')}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${activeTab === 'dictionary' ? 'text-brand-green' : 'text-slate-400'}`}
          >
            <BookMarked className="w-4 h-4" />
            <span>{LOCALIZATION[language].navDictionary}</span>
          </button>
        </div>
      </header>

      {/* 2. Main Layout Container */}
      <main id="app-workspace-body" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-8 pb-20 md:pb-8">
        
        {/* Universal Top Disclaimer Warning Banner, satisfying strict legal instructions */}
        <section id="universal-disclaimer-banner" className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all">
          <div className="bg-brand-linen border border-brand-rail text-brand-green py-2 px-3.5 rounded font-serif italic text-xl font-bold shrink-0 shadow-3xs">
            §
          </div>
          <div className="flex-1">
            <h2 id="disclaimer-banner-title" className={`text-xs font-bold text-slate-900 tracking-wider uppercase ${language === 'ur' ? 'urdu-text' : ''}`}>
              {LOCALIZATION[language].warningDisclaimerTitle}
            </h2>
            <p id="disclaimer-banner-desc" className={`text-xs text-slate-500 mt-1.5 leading-relaxed font-serif italic ${language === 'ur' ? 'urdu-text' : ''}`}>
              {LOCALIZATION[language].warningDisclaimerText}
            </p>
          </div>
        </section>

        {/* Dynamic Inner Tab Router */}
        <div id="tab-viewport" className="flex-1 flex flex-col min-h-[500px]">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: core legal assistant */}
            {activeTab === 'assistant' && (
              <motion.div
                key="assistant-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="assistant-workspace"
                className="flex flex-col lg:flex-row gap-8 flex-1 h-full"
              >
                
                {/* Left side sidebar: Past Sessions + categories */}
                <aside id="assistant-history-sidebar" className="w-full lg:w-80 bg-brand-rail border border-slate-200/85 p-6 rounded-2xl flex flex-col gap-8 shrink-0">
                  
                  {/* New consultation trigger */}
                  <button
                    id="new-consultation-btn"
                    onClick={() => startNewSession()}
                    className="w-full bg-brand-green hover:bg-brand-green-hover text-white py-3 px-4 rounded-lg font-bold tracking-widest text-[11px] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:translate-y-[-1px] transition-all"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>{LOCALIZATION[language].newConsultation}</span>
                  </button>

                  {/* Past session listing card */}
                  <div id="past-sessions-panel" className="flex flex-col flex-1 max-h-[350px] lg:max-h-none">
                    <h3 id="sessions-list-title" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {LOCALIZATION[language].pastConsultations}
                    </h3>
                    
                    <div id="sessions-list-container" className="flex-1 overflow-y-auto space-y-4 pr-1">
                      {sessions.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-4 text-center">
                          {LOCALIZATION[language].emptyHistory}
                        </p>
                      ) : (
                        sessions.map(sess => {
                          const isActive = sess.id === activeSessionId;
                          return (
                            <div
                              id={`session-item-${sess.id}`}
                              key={sess.id}
                              onClick={() => {
                                setActiveSessionId(sess.id);
                                setActiveTab('assistant');
                              }}
                              className={`group cursor-pointer select-none transition-all p-3 rounded-lg border ${
                                isActive ? 'bg-white border-slate-200 shadow-3xs' : 'border-transparent hover:bg-white/40'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`block text-[9px] font-bold ${isActive ? 'text-emerald-700' : 'text-slate-400'} uppercase tracking-wider mb-1`}>
                                  TITLE {new Date(sess.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase()}
                                </span>
                                <button
                                  id={`delete-session-btn-${sess.id}`}
                                  onClick={(e) => deleteSession(e, sess.id)}
                                  className="opacity-0 group-hover:opacity-100 hover:text-red-655 hover:bg-slate-100 p-1 rounded transition-all shrink-0 ml-1"
                                >
                                  <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                </button>
                              </div>
                              <span className={`font-serif italic text-base block truncate ${isActive ? 'text-slate-900 border-b border-brand-green/30 pb-1 font-semibold' : 'text-slate-600'}`}>
                                {sess.title}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Preloaded quick select categories */}
                  <div id="topic-scenarios-panel" className="bg-white border border-slate-200/70 rounded-xl p-5 shadow-sm hidden lg:block">
                    <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-3 leading-none">Legal Library</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed italic mb-4">
                      Access comprehensive legal codes and historical precedents of Pakistan courts.
                    </p>
                    <div className="h-px w-full bg-slate-100 mb-4"></div>
                    <div className="space-y-3">
                      {LEGAL_TOPICS.map(topic => (
                        <button
                          key={topic.id}
                          id={`sidebar-topic-btn-${topic.id}`}
                          onClick={() => {
                            setSelectedTopicId(topic.id);
                            setActiveTab('guides');
                          }}
                          className="w-full text-left py-1 text-xs font-bold text-brand-green uppercase tracking-wider hover:underline flex items-center justify-between group transition-all"
                        >
                          <span className="truncate">{topic.title[language]}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-brand-green transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>

                </aside>

                {/* Right side: Chat Arena */}
                <div id="assistant-chat-arena" className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col h-[550px] lg:h-auto overflow-hidden shadow-xs">
                  
                  {/* Session Header */}
                  <div id="chat-session-header" className="bg-slate-50 border-b border-slate-200 px-6 py-4.5 flex items-center justify-between">
                    <div className="flex items-center gap-3.5 truncate">
                      <div className="bg-brand-linen border border-slate-200 p-2 rounded-lg text-brand-green shrink-0 shadow-3xs">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <h4 className="text-xs font-black uppercase text-slate-950 tracking-widest truncate">
                          {activeSession?.title}
                        </h4>
                        <p className="text-[10px] text-slate-450 mt-0.5 uppercase tracking-tight">
                          GAZETTE DATE: {new Date(activeSession?.createdAt || '').toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Stream */}
                  <div id="messages-stream" className="flex-1 overflow-y-auto p-6 space-y-8 bg-brand-linen/10">
                    {activeSession?.messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center p-8">
                        <p className="text-xs text-slate-400 text-center italic max-w-sm">
                          {LOCALIZATION[language].noMessagesYet}
                        </p>
                      </div>
                    ) : (
                      activeSession?.messages.map((msg, index) => {
                        const isUser = msg.sender === 'user';
                        
                        if (isUser) {
                          return (
                            <div key={msg.id} className="flex justify-end pt-2">
                              <div className="max-w-[85%] bg-slate-50 border border-slate-250 p-5 sm:p-6 rounded-xl shadow-3xs">
                                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.22em] mb-1.5 text-right">
                                  INQUIRY DETAILS
                                </span>
                                <p className="font-serif italic text-base sm:text-lg text-slate-900 leading-relaxed text-right whitespace-pre-line leading-normal">{msg.text}</p>
                              </div>
                            </div>
                          );
                        }

                        // Assistant Message - Parse LLM structured output
                        let parsedData;
                        try {
                          parsedData = JSON.parse(msg.text);
                        } catch (e) {
                          // Support fallback non-json layout safely
                          parsedData = {
                            legalAreas: [],
                            statutes: [],
                            explanation: msg.text,
                            steps: [],
                            disclaimer: LOCALIZATION[language].warningDisclaimerText,
                            clarificationNeeded: false
                          };
                        }

                        return (
                          <div key={msg.id} className="flex gap-4 max-w-full mr-auto py-2">
                            <div className="hidden sm:flex bg-white border border-slate-200 p-2.5 rounded-xl h-10 w-10 shrink-0 items-center justify-center shadow-3xs">
                              <Scale className="w-5 h-5 text-brand-green" />
                            </div>
                            
                            <div id={`legal-card-${msg.id}`} className="space-y-6 flex-1 max-w-full">
                              
                              {/* Main Content card */}
                              <div className="bg-white border border-slate-200 shadow-2xs rounded-xl p-6 sm:p-8 space-y-6">
                                
                                {/* Legal Domain Badges */}
                                {parsedData.legalAreas && parsedData.legalAreas.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 flex-row">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">
                                      {LOCALIZATION[language].identifiedDomains}:
                                    </span>
                                    {parsedData.legalAreas.map((area: string, i: number) => (
                                      <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-850 text-[10px] font-bold uppercase rounded-sm border border-emerald-100">
                                        ⚖️ {area}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Diagnostic Explanation */}
                                <div className="space-y-4">
                                  <h4 className="text-[11px] font-bold text-brand-green uppercase tracking-[0.25em] leading-none">
                                    01. Case Analysis
                                  </h4>
                                  <div className={`text-slate-800 text-sm sm:text-base leading-relaxed ${language === 'ur' ? 'urdu-text' : ''}`}>
                                    {/* Styled lead block for the first paragraph */}
                                    {(() => {
                                      const paragraphs = (parsedData.explanation || "").split('\n\n');
                                      const leadParagraph = paragraphs[0];
                                      const restParagraphs = paragraphs.slice(1).join('\n\n');
                                      
                                      return (
                                        <div className="space-y-4">
                                          {leadParagraph && (
                                            <p className="text-slate-900 leading-relaxed font-serif italic text-base sm:text-lg border-l-2 border-brand-green pl-4">
                                              {leadParagraph}
                                            </p>
                                          )}
                                          {restParagraphs && (
                                            <p className="text-slate-650 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
                                              {restParagraphs}
                                            </p>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>

                                {/* Statutory acts list */}
                                {parsedData.statutes && parsedData.statutes.length > 0 && (
                                  <div className="border-t border-slate-100 pt-5 space-y-3 bg-brand-linen/40 -mx-6 -mb-6 p-6 rounded-b-xl border-l-[3px] border-brand-green">
                                    <div className="flex items-center gap-1.5 text-slate-600">
                                      <FileText className="w-4 h-4 text-brand-green" />
                                      <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-widest">
                                        {LOCALIZATION[language].applicableStatutes}
                                      </span>
                                    </div>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                      {parsedData.statutes.map((stat: string, i: number) => (
                                        <li key={i} className="bg-white border border-slate-205/70 px-4 py-3 rounded-md text-[11px] sm:text-xs font-serif italic text-slate-800 flex items-center gap-2.5 shadow-3xs">
                                          <div className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                                          <span className="truncate">{stat}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                              </div>

                              {/* Separate Actions / Checklist Card */}
                              {parsedData.steps && parsedData.steps.length > 0 && (
                                <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-2xl flex flex-col gap-6 shadow-sm">
                                  <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
                                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                                    <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.2em] leading-none">
                                      {LOCALIZATION[language].actionableAvenues}
                                    </h5>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                                    {parsedData.steps.map((step: string, i: number) => {
                                      const stepFormattedNum = i < 9 ? `0${i + 1}` : `${i + 1}`;
                                      return (
                                        <div key={i} className="flex gap-4.5 items-start group">
                                          <span className="text-3xl font-serif italic text-emerald-400 opacity-50 shrink-0 group-hover:opacity-100 transition-opacity">
                                            {stepFormattedNum}
                                          </span>
                                          <div className="space-y-1 flex-1">
                                            <div className="flex items-start gap-2.5">
                                              <input
                                                id={`check-${msg.id}-${i}`}
                                                type="checkbox"
                                                className="mt-1 rounded text-slate-950 focus:ring-emerald-500 h-4 w-4 bg-slate-800 border-slate-700 text-emerald-600 focus:outline-hidden cursor-pointer"
                                              />
                                              <label
                                                htmlFor={`check-${msg.id}-${i}`}
                                                className={`text-slate-300 hover:text-white text-xs sm:text-sm font-semibold leading-relaxed cursor-pointer select-none ${language === 'ur' ? 'urdu-text' : ''}`}
                                              >
                                                {step}
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Highlighted Disclaimer box exclusively on this legal interaction */}
                              {parsedData.disclaimer && (
                                <div className="border border-slate-200 bg-white rounded-lg p-4.5 shadow-3xs flex gap-3.5 items-center">
                                  <span className="shrink-0 text-[10px] font-bold bg-brand-green text-white rounded px-2 py-0.5 uppercase tracking-wider">
                                    Advisory Disclaimer
                                  </span>
                                  <p className={`text-[11px] text-slate-500 leading-relaxed italic ${language === 'ur' ? 'urdu-text' : ''}`}>
                                    {parsedData.disclaimer}
                                  </p>
                                </div>
                              )}

                            </div>
                          </div>
                        );
                      })
                    )}
                    
                    {/* Skeleton loader for AI thinking */}
                    {isGenerating && (
                      <div className="flex gap-3.5 items-center max-w-[80%] mr-auto pl-2 py-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping inline-block"></div>
                        <span className="text-xs text-slate-450 font-black tracking-widest uppercase italic animate-pulse">
                          {LOCALIZATION[language].sendActive}
                        </span>
                      </div>
                    )}

                    <div ref={chatBottomRef} />
                  </div>

                  {/* Keyboard Special Urdu characters helper (to make Urdu typing trivial without custom OS keyboards) */}
                  <div id="urdu-characters-helper" className="bg-brand-linen px-4 py-3 border-t border-slate-200/60 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">
                      {LOCALIZATION[language].cloverHelperTitle}:
                    </span>
                    {COMMON_URDU_WORDS.map((item, i) => (
                      <button
                        key={i}
                        id={`helper-word-${i}`}
                        onClick={() => handleWordHelperClick(item.word)}
                        className="bg-white hover:bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-sm text-xs font-bold text-slate-700 shadow-3xs cursor-pointer hover:border-brand-green transition-colors"
                        title={item.en}
                      >
                        {item.word}
                      </button>
                    ))}
                  </div>

                  {/* Input Form Panel */}
                  <div id="chat-input-panel" className="p-4.5 border-t border-slate-200 bg-white">
                    <form
                      id="legal-query-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitMessage(inputValue);
                      }}
                      className="flex items-stretch gap-3"
                    >
                      <textarea
                        id="legal-query-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitMessage(inputValue);
                          }
                        }}
                        placeholder={LOCALIZATION[language].inputPlaceholder}
                        rows={2}
                        className={`flex-1 bg-brand-linen/40 hover:bg-brand-linen/60 focus:bg-white border border-slate-250 focus:border-brand-green rounded-lg px-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-405 focus:outline-hidden focus:ring-1 focus:ring-brand-green/30 resize-none transition-all leading-relaxed ${
                          language === 'ur' ? 'urdu-text' : ''
                        }`}
                      />
                      
                      <button
                        id="submit-query-btn"
                        type="submit"
                        disabled={!inputValue.trim() || isGenerating}
                        className="bg-brand-green hover:bg-brand-green-hover disabled:bg-slate-100 text-white disabled:text-slate-400 py-3 px-5 sm:px-8 rounded-lg font-bold uppercase tracking-widest text-xs sm:text-sm flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shrink-0 shadow-sm disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="hidden sm:inline whitespace-nowrap">{LOCALIZATION[language].sendButton}</span>
                      </button>
                    </form>
                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 2: Browse Legal Guides */}
            {activeTab === 'guides' && (
              <motion.div
                key="guides-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="guidebooks-gallery"
                className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8 flex-1"
              >
                
                {/* Section title */}
                <div className="space-y-2 border-b border-slate-100 pb-5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block leading-none">Pakistan Law Gazettes</span>
                  <h3 id="guides-tab-title" className="font-serif text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {LOCALIZATION[language].guidebookTitle}
                  </h3>
                  <p id="guides-tab-subtitle" className="text-xs sm:text-sm text-slate-500 font-serif italic max-w-2xl leading-relaxed">
                    {LOCALIZATION[language].guidebookSubtitle}
                  </p>
                </div>

                {/* Grid categories selector */}
                <div id="guides-grid-selector" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {LEGAL_TOPICS.map(topic => {
                    const isSelected = selectedTopicId === topic.id;
                    return (
                      <button
                        key={topic.id}
                        id={`guide-selector-${topic.id}`}
                        onClick={() => setSelectedTopicId(topic.id)}
                        className={`p-5 rounded-lg border text-left flex flex-col gap-4 group transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                            : 'bg-brand-linen/50 border-slate-200/80 hover:bg-white hover:border-slate-350 text-slate-700 hover:shadow-xs'
                        }`}
                      >
                        <div className={`p-2.5 rounded w-fit ${isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-white text-slate-850 border border-slate-200 shadow-3xs'}`}>
                          {renderLogoIcon(topic.iconName, "w-5 h-5")}
                        </div>
                        <div>
                          <h4 className="text-xs font-black tracking-widest uppercase mb-1.5">
                            {topic.title[language]}
                          </h4>
                          <p className={`text-[11px] leading-relaxed line-clamp-2 italic ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {topic.description[language]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Loaded guide details */}
                {(() => {
                  const activeTopic = LEGAL_TOPICS.find(t => t.id === selectedTopicId);
                  if (!activeTopic) return null;
                  
                  return (
                    <div id="guide-detail-card" className="border border-slate-200/80 rounded-xl p-6 sm:p-8 bg-brand-linen/25 flex flex-col lg:flex-row gap-8">
                      
                      {/* Left: General info and Acts */}
                      <div className="flex-1 space-y-6">
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-white border border-slate-200 p-2 rounded text-brand-green shadow-3xs">
                              {renderLogoIcon(activeTopic.iconName, "w-6 h-6")}
                            </div>
                            <h4 className="font-serif text-xl sm:text-2xl font-black text-slate-900">
                              {activeTopic.title[language]}
                            </h4>
                          </div>
                          <p className={`text-slate-650 text-sm sm:text-base leading-relaxed ${language === 'ur' ? 'urdu-text' : ''}`}>
                            {activeTopic.description[language]}
                          </p>
                        </div>

                        {/* Acts list */}
                        <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-3xs">
                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-brand-green" />
                            {LOCALIZATION[language].governingActs}
                          </h5>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {activeTopic.laws[language].map((law, i) => (
                              <li key={i} className="flex items-start gap-3 p-1 rounded-md transition-all">
                                <span className="bg-brand-green text-emerald-250 font-serif italic text-xs w-6 h-6 rounded-sm flex items-center justify-center font-bold shrink-0 shadow-3xs">
                                  §{i + 1}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug pt-0.5">{law}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                      {/* Right: preloaded template scenario cards */}
                      <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
                        <h5 className="text-[10px] font-black text-slate-403 uppercase tracking-widest">
                          {LOCALIZATION[language].suggestedScenarios}
                        </h5>
                        
                        <div className="space-y-3.5 overflow-y-auto max-h-[350px] pr-1">
                          {activeTopic.templates.map((tmpl, idx) => (
                            <button
                              key={idx}
                              id={`topic-template-click-${idx}`}
                              onClick={() => {
                                // Start a new consultation loaded with this exact prompt
                                startNewSession(activeTopic.id);
                                setTimeout(() => {
                                  setInputValue(tmpl.prompt[language]);
                                }, 50);
                              }}
                              className="w-full bg-white hover:bg-brand-linen/40 border border-slate-200 rounded-xl p-4.5 text-left transition-all hover:shadow-xs group hover:border-brand-green cursor-pointer flex flex-col gap-2"
                            >
                              <h6 className="text-xs font-black text-slate-900 group-hover:text-brand-green transition-colors uppercase tracking-wider mb-0.5">
                                {tmpl.title[language]}
                              </h6>
                              <p className="text-[11px] text-slate-500 leading-relaxed italic line-clamp-3">
                                "{tmpl.prompt[language]}"
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-brand-green font-bold self-end mt-1 uppercase tracking-wider">
                                <span>{LOCALIZATION[language].tryThisTemplate}</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                              </div>
                            </button>
                          ))}
                        </div>

                      </div>

                    </div>
                  );
                })()}

              </motion.div>
            )}

            {/* TAB 3: Legal Dictionary */}
            {activeTab === 'dictionary' && (
              <motion.div
                key="dictionary-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="dictionary-vocabulary"
                className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm space-y-8 flex-1 flex flex-col"
              >
                
                {/* Search Bar Block */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-5">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block leading-none">Pakistan Civil & Criminal Code Indexes</span>
                    <h3 id="dict-tab-title" className="font-serif text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {LOCALIZATION[language].navDictionary}
                    </h3>
                    <p id="dict-tab-subtitle" className="text-xs sm:text-sm text-slate-500 font-serif italic max-w-2xl leading-relaxed">
                      {LOCALIZATION[language].searchDictionary}
                    </p>
                  </div>

                  <div id="dict-search-box" className="relative w-full md:w-96 shrink-0">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="dictionary-search-input"
                      type="text"
                      placeholder={LOCALIZATION[language].searchDictionary}
                      value={dictSearch}
                      onChange={(e) => {
                        setDictSearch(e.target.value);
                        setSelectedEntryId(null);
                      }}
                      className="w-full bg-brand-linen/40 border border-slate-250 rounded-lg pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-405 focus:outline-hidden focus:border-brand-green transition-colors"
                    />
                    {dictSearch && (
                      <button
                        onClick={() => {
                          setDictSearch('');
                          setSelectedEntryId(null);
                        }}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* List & Detail Dual Layout */}
                <div id="dict-dual-canvas" className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                  
                  {/* Left Column: Terms Selection list */}
                  <div id="dict-terms-column" className="lg:col-span-1 border border-slate-200/80 rounded-xl overflow-y-auto max-h-[400px] lg:max-h-[500px] p-3 space-y-1.5 bg-brand-rail">
                    <div className="px-3.5 py-2.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                        {LOCALIZATION[language].allTerms}
                      </span>
                    </div>

                    {filteredDict.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-6">
                        No terms matched your search.
                      </p>
                    ) : (
                      filteredDict.map(entry => {
                        const isSelected = entry.id === selectedEntryId;
                        return (
                          <button
                            key={entry.id}
                            id={`dict-entry-item-${entry.id}`}
                            onClick={() => setSelectedEntryId(entry.id)}
                            className={`w-full text-left p-3.5 rounded-lg text-xs font-bold flex items-center justify-between group transition-all border ${
                              isSelected 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                                : 'bg-white border-transparent hover:border-slate-350 text-slate-700'
                            }`}
                          >
                            <span className="truncate">{entry.term[language]}</span>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Right Column: Active Vocabulary Entry details */}
                  <div id="dict-details-column" className="lg:col-span-2 bg-brand-linen/15 border border-slate-200/85 rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6 min-h-[350px]">
                    
                    {(() => {
                      const activeEntry = DICTIONARY_ENTRIES.find(e => e.id === (selectedEntryId || filteredDict[0]?.id));
                      
                      if (!activeEntry) {
                        return (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-xs text-slate-400 italic">
                              Select a legal term from the term sheet to inspect detailed Pakistani statutory context.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div id="term-detail-viewport" className="space-y-6 flex-1 flex flex-col justify-between">
                          
                          <div className="space-y-6">
                            {/* Term block */}
                            <div id="term-header" className="border-b border-slate-200 pb-4.5 space-y-2">
                              <span className="bg-slate-950 text-emerald-400 rounded-sm text-[9px] font-black tracking-widest px-2.5 py-1 w-fit uppercase leading-none inline-block">
                                Pakistan Codified Lexicon
                              </span>
                              <h4 className="font-serif text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                                {activeEntry.term[language]}
                              </h4>
                            </div>

                            {/* Plain meaning explanation */}
                            <div id="term-meaning-box" className="space-y-2">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Definition / تعریف
                              </h5>
                              <p className={`text-slate-950 text-base sm:text-lg leading-relaxed font-serif ${language === 'ur' ? 'urdu-text' : ''}`}>
                                {activeEntry.meaning[language]}
                              </p>
                            </div>

                            {/* Pakistani Specific statutory placement */}
                            <div id="term-statutory-box" className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-3xs border-l-[3px] border-brand-green">
                              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                <Info className="w-3.5 h-3.5 text-brand-green" />
                                {LOCALIZATION[language].termContext}
                              </h5>
                              <p className={`text-slate-700 text-xs sm:text-sm leading-relaxed font-serif italic ${language === 'ur' ? 'urdu-text' : ''}`}>
                                {activeEntry.context[language]}
                              </p>
                            </div>
                          </div>

                          {/* Action starter button using this dictionary term */}
                          <div id="term-action-card" className="bg-slate-900 text-slate-100 p-5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4.5 mt-auto shadow-sm">
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-emerald-400 block uppercase tracking-widest">
                                Action Prompt Starter
                              </span>
                              <p className="text-xs font-semibold text-slate-200">
                                Ask the Legal Assistant about details regarding "{activeEntry.term.en}"?
                              </p>
                            </div>
                            <button
                              id="dict-term-run-btn"
                              onClick={() => {
                                startNewSession('general');
                                setTimeout(() => {
                                  const termQuery = language === 'en' 
                                    ? `What is the legal importance, procedure, and rights concerning ${activeEntry.term.en} in Pakistan?`
                                    : `پاکستان کے قوانین کے تحت ${activeEntry.term.ur} کی قانونی حیثیت اور طریقہ کار کیا ہے؟ تفصیل فراہم کریں۔`;
                                  setInputValue(termQuery);
                                }, 50);
                              }}
                              className="bg-brand-green hover:bg-brand-green-hover text-white font-bold uppercase tracking-widest py-2.5 px-4 focus:outline-hidden text-xs rounded-md shadow-2xs transition-colors shrink-0"
                            >
                              Run Assessment
                            </button>
                          </div>

                        </div>
                      );
                    })()}

                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </main>

      {/* 3. Footer Branding Area, satisfying visual cleanliness and anti-ai-slop rules */}
      <footer id="app-footer" className="bg-white border-t border-slate-200/80 mt-auto py-6 text-slate-500 text-[11px] font-bold tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="font-serif italic text-slate-450">
            © 2026 QANOON.AI. Constitutional and Statutory Information Assistant for the Federation of Pakistan.
          </p>
          <div className="flex justify-center gap-5 text-slate-400 text-[10px] uppercase tracking-widest">
            <span>{language === 'en' ? 'PPC, CrPC, Family Laws' : 'تعزیراتِ پاکستان و عائلی قوانین'}</span>
            <span>•</span>
            <span>Bilingual Console v1.5</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
