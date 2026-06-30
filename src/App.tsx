/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Calendar, Plus, Info, Search, MapPin, Compass, SlidersHorizontal, X, Archive, FolderSync } from 'lucide-react';
import { collection, onSnapshot, addDoc, query } from 'firebase/firestore';
import { db } from './firebase';
import { UAEvent, EventCategory, Campus } from './types';
import { SEEDED_EVENTS, getNext7Days, formatDateLabel, formatWeekdayLabel, getOffsetDateString } from './data';
import EventCard from './components/EventCard';
import AddEventForm from './components/AddEventForm';
import AboutView from './components/AboutView';
import ArchiveView from './components/ArchiveView';

type Tab = 'explorar' | 'arquivo' | 'divulgar' | 'sobre';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<Tab>('explorar');

  // Database of Events: Loaded dynamically from Firestore
  const [allEvents, setAllEvents] = useState<UAEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: UAEvent[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        loaded.push({
          id: doc.id,
          ...data,
        } as UAEvent);
      });
      setAllEvents(loaded);
      setIsLoading(false);
    }, (error) => {
      console.error("Erro a carregar eventos do Firebase:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter States
  const [selectedDay, setSelectedDay] = useState<string>('todos'); // 'todos' or date string 'YYYY-MM-DD'
  const [selectedCategory, setSelectedCategory] = useState<string>('todos'); // 'todos' or EventCategory
  const [searchQuery, setSearchQuery] = useState('');

  // 7 days window list
  const next7Days = getNext7Days();

  // Set default day to today (Day 0) on mount
  useEffect(() => {
    setSelectedDay(getOffsetDateString(0));
  }, []);

  // Handle Adding an Event
  const handleAddEvent = async (newEventData: Omit<UAEvent, 'id' | 'isUserSubmitted'>) => {
    try {
      const newEvent = {
        ...newEventData,
        isUserSubmitted: true,
      };
      await addDoc(collection(db, 'events'), newEvent);
    } catch (e) {
      console.error("Erro ao guardar evento no Firestore:", e);
    }
  };

  // Filter & Search Logic
  const filteredEvents = allEvents.filter((event) => {
    // 0. Only show events in the next 7 days on the main Explorar page
    if (activeTab === 'explorar' && !next7Days.includes(event.date)) {
      return false;
    }
    // 1. Day Filter
    if (selectedDay !== 'todos' && event.date !== selectedDay) {
      return false;
    }
    // 2. Category Filter
    if (selectedCategory !== 'todos' && event.category !== selectedCategory) {
      return false;
    }
    // 3. Search text
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = event.title.toLowerCase().includes(query);
      const matchOrg = event.organizer.toLowerCase().includes(query);
      const matchLoc = event.location.toLowerCase().includes(query);
      const matchDesc = event.description.toLowerCase().includes(query);
      return matchTitle || matchOrg || matchLoc || matchDesc;
    }
    return true;
  });

  // Sort events chronologically by date then time
  const sortedEvents = filteredEvents.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.startTime.localeCompare(b.startTime);
  });

  const clearFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] pb-24 md:pb-28 font-sans transition-colors selection:bg-[#92d400]">
      {/* Vibrant Palette Header Block */}
      <header className="bg-[#92d400] border-b-4 border-black py-5 px-6 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="font-display font-black text-4xl md:text-5xl tracking-tighter uppercase italic leading-none text-black flex items-center justify-center md:justify-start gap-2 select-none">
              SpotUA <span className="text-2xl md:text-3xl not-italic animate-bounce">🚀</span>
            </h1>
            <p className="font-mono text-[10px] md:text-xs font-bold uppercase mt-1 tracking-widest text-black/80">
              Radar de Eventos • Comunidade UA
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Desktop Tab Selector */}
            <nav className="hidden md:flex bg-white border-2 border-black rounded-xl p-1 font-display font-bold text-xs shadow-[3px_3px_0px_#000000]">
              <button
                id="desktop-tab-explorar"
                onClick={() => setActiveTab('explorar')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 border-transparent transition-all cursor-pointer ${
                  activeTab === 'explorar'
                    ? 'bg-[#92d400] border-black text-black shadow-[2px_2px_0px_#000]'
                    : 'hover:bg-[#92d400]/10 text-gray-700'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Explorar
              </button>
              <button
                id="desktop-tab-arquivo"
                onClick={() => setActiveTab('arquivo')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 border-transparent transition-all cursor-pointer ${
                  activeTab === 'arquivo'
                    ? 'bg-[#92d400] border-black text-black shadow-[2px_2px_0px_#000]'
                    : 'hover:bg-[#92d400]/10 text-gray-700'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                Arquivo
              </button>
              <button
                id="desktop-tab-divulgar"
                onClick={() => setActiveTab('divulgar')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 border-transparent transition-all cursor-pointer ${
                  activeTab === 'divulgar'
                    ? 'bg-[#92d400] border-black text-black shadow-[2px_2px_0px_#000]'
                    : 'hover:bg-[#92d400]/10 text-gray-700'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Divulgar
              </button>
              <button
                id="desktop-tab-sobre"
                onClick={() => setActiveTab('sobre')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 border-transparent transition-all cursor-pointer ${
                  activeTab === 'sobre'
                    ? 'bg-[#92d400] border-black text-black shadow-[2px_2px_0px_#000]'
                    : 'hover:bg-[#92d400]/10 text-gray-700'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                Sobre
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Screen Stage */}
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        
        {activeTab === 'explorar' && (
          <div className="flex flex-col gap-6">
            
            {/* Top Seletor de Dias da Semana (Sliding timeline) */}
            <div id="day-selector-container" className="flex flex-col gap-3">
              <span className="font-display font-bold text-xs text-black uppercase tracking-wider">
                📅 Escolhe o Dia:
              </span>
              
              <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 px-1 -mx-4 md:mx-0 pl-4 md:pl-1 select-none no-scrollbar">
                
                {/* 'Todos' Button */}
                <button
                  id="day-pill-todos"
                  onClick={() => setSelectedDay('todos')}
                  className={`flex-none px-4 py-3 rounded-xl border-2 border-black font-display font-bold text-xs uppercase transition-all brutalist-shadow-sm cursor-pointer ${
                    selectedDay === 'todos'
                      ? 'bg-[#92d400] text-black scale-102 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-[#FFFDF9] hover:bg-[#92d400]/10 text-gray-700'
                  }`}
                >
                  Toda a Semana
                </button>

                {/* Day Buttons */}
                {next7Days.map((dayStr) => {
                  const isSelected = selectedDay === dayStr;
                  const isToday = getOffsetDateString(0) === dayStr;
                  
                  return (
                    <button
                      key={dayStr}
                      id={`day-pill-${dayStr}`}
                      onClick={() => setSelectedDay(dayStr)}
                      className={`flex-none flex flex-col items-center justify-center min-w-[70px] px-3 py-2 rounded-xl border-2 border-black transition-all brutalist-shadow-sm cursor-pointer ${
                        isSelected
                          ? 'bg-[#92d400] text-black scale-102 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-[#FFFDF9] hover:bg-[#92d400]/10 text-gray-700'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80">
                        {formatWeekdayLabel(dayStr)}
                      </span>
                      <span className="text-xs font-display font-black mt-0.5">
                        {formatDateLabel(dayStr).split(' ')[0]}
                      </span>
                      <span className="text-[9px] font-sans font-semibold opacity-75">
                        {formatDateLabel(dayStr).split(' ')[1]}
                      </span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 bg-black rounded-full mt-1 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart Filters bar */}
            <div id="search-filter-section" className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-4 brutalist-shadow-sm flex flex-col gap-4">
              
              {/* Search Box */}
              <div id="search-bar-wrapper">
                {/* Search query input */}
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Pesquisar eventos, locais ou organizadores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-sans text-xs font-semibold text-black placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      id="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 p-1 hover:bg-stone-200 rounded-full transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-black" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category selector (horizontal scrollable pills) */}
              <div className="flex flex-col gap-2">
                <span className="font-display font-bold text-xs text-black uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-black" /> Categorias:
                </span>
                
                <div className="flex gap-2 overflow-x-auto pb-1 pl-1 -mx-4 md:mx-0 px-4 md:px-0 no-scrollbar select-none">
                  {/* Category 'Todos' pill */}
                  <button
                    id="category-pill-todos"
                    onClick={() => setSelectedCategory('todos')}
                    className={`flex-none px-3.5 py-1.5 rounded-xl border-2 border-black font-display font-bold text-xs transition-all brutalist-shadow-sm cursor-pointer ${
                      selectedCategory === 'todos'
                        ? 'bg-black text-white'
                        : 'bg-[#FAF6EE] hover:bg-[#92d400]/10 text-black'
                    }`}
                  >
                    Todas
                  </button>

                  {/* Individual Categories pills */}
                  {Object.values(EventCategory).map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        id={`category-pill-${cat}`}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex-none px-3.5 py-1.5 rounded-xl border-2 border-black font-display font-bold text-xs transition-all brutalist-shadow-sm cursor-pointer ${
                          isSelected
                            ? 'bg-[#92d400] text-black scale-102 border-black shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-[#FAF6EE] hover:bg-[#92d400]/10 text-black'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active filters summary */}
              {(selectedCategory !== 'todos' || searchQuery !== '') && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                  <span className="font-mono text-gray-500 font-bold">
                    Filtros ativos: {selectedCategory !== 'todos' ? `[${selectedCategory}] ` : ''}
                    {searchQuery !== '' ? `[Pesquisa: "${searchQuery}"]` : ''}
                  </span>
                  <button
                    id="reset-filters-btn"
                    onClick={clearFilters}
                    className="font-display font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 bg-rose-50 border border-rose-300 rounded-md px-2 py-0.5 cursor-pointer"
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}

            </div>

            {/* Events Timeline Stage */}
            <div id="timeline-events-wrapper" className="flex flex-col gap-5">
              
              {/* Day title indicator */}
              <div className="flex items-center justify-between border-b-2 border-black pb-2 mt-2">
                <span className="font-display font-black text-lg md:text-xl text-black">
                  {selectedDay === 'todos' 
                    ? 'Agenda da Semana' 
                    : `${formatWeekdayLabel(selectedDay)}, ${formatDateLabel(selectedDay)}`}
                </span>
                <span className="font-mono text-xs font-bold text-gray-500">
                  {sortedEvents.length} {sortedEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
                </span>
              </div>

              {/* Event card grid */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 bg-[#FFFDF9] border-3 border-black rounded-2xl brutalist-shadow-sm">
                  <div className="w-10 h-10 border-4 border-[#92d400] border-t-black rounded-full animate-spin"></div>
                  <span className="font-mono text-xs text-black font-bold uppercase tracking-wider">A sintonizar com o radar...</span>
                </div>
              ) : sortedEvents.length === 0 ? (
                <div id="no-events-box" className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-8 text-center brutalist-shadow flex flex-col items-center justify-center gap-4">
                  <div className="w-14 h-14 bg-[#92d400]/20 border-2 border-black rounded-full flex items-center justify-center brutalist-shadow-sm text-[#92d400]">
                    <SlidersHorizontal className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-black">Nenhum evento neste dia!</h3>
                  <p className="font-sans text-sm text-gray-500 max-w-sm">
                    Não há iniciativas agendadas para o teu filtro. Sê o primeiro a dinamizar a comunidade!
                  </p>
                  <button
                    id="no-events-publish-btn"
                    onClick={() => setActiveTab('divulgar')}
                    className="px-4 py-2.5 bg-[#92d400] border-2 border-black rounded-xl font-display font-bold text-xs brutalist-shadow-sm hover:opacity-95 transition-colors cursor-pointer text-black"
                  >
                    Divulgar Iniciativa ➕
                  </button>
                </div>
              ) : (
                <div id="events-grid" className="flex flex-col gap-5">
                  {sortedEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {activeTab === 'arquivo' && (
          <ArchiveView allEvents={allEvents} />
        )}

        {activeTab === 'divulgar' && (
          <AddEventForm 
            onAddEvent={handleAddEvent} 
            onSuccess={() => {
              // Automatically navigate to 'explorar' after successfully adding
              setSelectedDay('todos'); // reset day to see the new event
              setActiveTab('explorar');
            }} 
          />
        )}



        {activeTab === 'sobre' && (
          <AboutView />
        )}

      </main>

      {/* Bottom Navigation Bar / Footer (Vibrant Palette style with live network connection marker) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black py-4 px-6 md:px-12 z-50 flex flex-col md:flex-row items-center justify-between gap-4 select-none shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        
        {/* Mobile quick menu */}
        <div className="flex md:hidden justify-around items-center w-full">
          <button
            id="mobile-tab-explorar"
            onClick={() => setActiveTab('explorar')}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer ${
              activeTab === 'explorar'
                ? 'bg-[#92d400] border-black text-black shadow-[2px_2px_0px_#000] font-black'
                : 'border-transparent text-gray-500 hover:text-black font-semibold'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-display uppercase tracking-wider">Explorar</span>
          </button>

          <button
            id="mobile-tab-arquivo"
            onClick={() => setActiveTab('arquivo')}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer ${
              activeTab === 'arquivo'
                ? 'bg-[#92d400] border-black text-black shadow-[2px_2px_0px_#000] font-black'
                : 'border-transparent text-gray-500 hover:text-black font-semibold'
            }`}
          >
            <Archive className="w-5 h-5" />
            <span className="text-[10px] font-display uppercase tracking-wider">Arquivo</span>
          </button>

          <button
            id="mobile-tab-divulgar"
            onClick={() => setActiveTab('divulgar')}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer ${
              activeTab === 'divulgar'
                ? 'bg-[#92d400] border-black text-black shadow-[2px_2px_0px_#000] font-black'
                : 'border-transparent text-gray-500 hover:text-black font-semibold'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="text-[10px] font-display uppercase tracking-wider">Divulgar</span>
          </button>

          <button
            id="mobile-tab-sobre"
            onClick={() => setActiveTab('sobre')}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer ${
              activeTab === 'sobre'
                ? 'bg-[#92d400] border-black text-black shadow-[2px_2px_0px_#000] font-black'
                : 'border-transparent text-gray-500 hover:text-black font-semibold'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[10px] font-display uppercase tracking-wider">Sobre</span>
          </button>
        </div>

        {/* Desktop premium status footer */}
        <div className="hidden md:flex items-center gap-8 font-display font-black text-xs uppercase">
          <button
            onClick={() => setActiveTab('explorar')}
            className={`flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'explorar' ? 'opacity-100 text-black' : 'opacity-40 hover:opacity-80'}`}
          >
            <div className={`w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000] ${activeTab === 'explorar' ? 'bg-[#92d400]' : 'bg-white'}`}>📅</div>
            <span>Agenda</span>
          </button>

          <button
            onClick={() => setActiveTab('arquivo')}
            className={`flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'arquivo' ? 'opacity-100 text-black' : 'opacity-40 hover:opacity-80'}`}
          >
            <div className={`w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000] ${activeTab === 'arquivo' ? 'bg-[#92d400]' : 'bg-white'}`}>🗄️</div>
            <span>Arquivo</span>
          </button>

          <button
            onClick={() => setActiveTab('divulgar')}
            className={`flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'divulgar' ? 'opacity-100 text-black' : 'opacity-40 hover:opacity-80'}`}
          >
            <div className={`w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000] ${activeTab === 'divulgar' ? 'bg-[#92d400]' : 'bg-white'}`}>➕</div>
            <span>Anunciar</span>
          </button>

          <button
            onClick={() => setActiveTab('sobre')}
            className={`flex items-center gap-2 transition-all cursor-pointer ${activeTab === 'sobre' ? 'opacity-100 text-black' : 'opacity-40 hover:opacity-80'}`}
          >
            <div className={`w-9 h-9 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000] ${activeTab === 'sobre' ? 'bg-[#92d400]' : 'bg-white'}`}>ℹ️</div>
            <span>Sobre</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <span className="text-[10px] font-mono font-bold opacity-60 uppercase tracking-wider">Ligação à rede UA estável</span>
          <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-black animate-pulse"></div>
          
          <div className="w-9 h-9 rounded-full border-2 border-black bg-[#92d400] flex items-center justify-center font-display font-black text-xs shadow-[2px_2px_0px_#000000]" title="Utilizador UA">
            UA
          </div>
        </div>

      </footer>
    </div>
  );
}

