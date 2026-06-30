import { useState, useMemo } from 'react';
import { Search, Compass, SlidersHorizontal, Calendar, X, FolderSync, MapPin, User, ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { UAEvent, EventCategory, Campus } from '../types';
import { getOffsetDateString, formatDateLabel } from '../data';
import EventCard from './EventCard';

interface ArchiveViewProps {
  allEvents: UAEvent[];
}

export default function ArchiveView({ allEvents }: ArchiveViewProps) {
  // Calendar Navigation State (default to today's date: June 2026)
  const today = new Date(2026, 5, 30); // 2026-06-30
  const [navYear, setNavYear] = useState(2026);
  const [navMonth, setNavMonth] = useState(5); // 0-indexed (5 is June)
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // General Filter States (applied on top of date selection if desired, or general search)
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Clean formatted today string
  const todayStr = '2026-06-30';

  // Helper arrays for calendar rendering
  const weekdayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Helper: Get number of days in navYear, navMonth
  const daysInMonth = useMemo(() => {
    return new Date(navYear, navMonth + 1, 0).getDate();
  }, [navYear, navMonth]);

  // Helper: Get starting day of week for current navMonth (adjusted so Mon = 0, Sun = 6)
  const startDayOfWeek = useMemo(() => {
    const day = new Date(navYear, navMonth, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }, [navYear, navMonth]);

  // Go to previous month
  const prevMonth = () => {
    if (navMonth === 0) {
      setNavMonth(11);
      setNavYear(prev => prev - 1);
    } else {
      setNavMonth(prev => prev - 1);
    }
  };

  // Go to next month
  const nextMonth = () => {
    if (navMonth === 11) {
      setNavMonth(0);
      setNavYear(prev => prev + 1);
    } else {
      setNavMonth(prev => prev + 1);
    }
  };

  // Generate date string helper: "YYYY-MM-DD"
  const makeDateString = (dayNum: number) => {
    const yyyy = navYear;
    const mm = String(navMonth + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Check how many events exist on a specific date (fully matching criteria if filters are on)
  const getEventsForDate = (dateStr: string) => {
    return allEvents.filter(event => {
      if (event.date !== dateStr) return false;
      if (selectedCategory !== 'todos' && event.category !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  };

  // Filtered list of events based on ALL active filters EXCEPT date click
  const filteredEventsAll = useMemo(() => {
    return allEvents.filter((event) => {
      // 1. Category Filter
      if (selectedCategory !== 'todos' && event.category !== selectedCategory) {
        return false;
      }
      // 2. Search text
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
  }, [allEvents, selectedCategory, searchQuery]);

  // List of events actually visible (optionally narrowed by selected Date)
  const finalVisibleEvents = useMemo(() => {
    if (selectedDateStr) {
      return filteredEventsAll.filter(e => e.date === selectedDateStr);
    }
    return filteredEventsAll;
  }, [filteredEventsAll, selectedDateStr]);

  // Group the visible list by Month for general chronological navigation (if no date is clicked)
  const groupedEventsByMonth = useMemo(() => {
    const grouped: { [key: string]: UAEvent[] } = {};
    filteredEventsAll.forEach((event) => {
      const monthKey = event.date.substring(0, 7); // "YYYY-MM"
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(event);
    });
    return grouped;
  }, [filteredEventsAll]);

  const sortedMonthKeys = useMemo(() => {
    return Object.keys(groupedEventsByMonth).sort((a, b) => b.localeCompare(a));
  }, [groupedEventsByMonth]);

  // Sort events inside groups
  const sortedGroupedEvents = useMemo(() => {
    const sorted = { ...groupedEventsByMonth };
    Object.keys(sorted).forEach((key) => {
      sorted[key] = [...sorted[key]].sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        return a.startTime.localeCompare(b.startTime);
      });
    });
    return sorted;
  }, [groupedEventsByMonth]);

  const getMonthYearLabel = (dateStr: string): string => {
    const [year, month] = dateStr.split('-').map(Number);
    return `${monthNames[month - 1]} de ${year}`;
  };

  // Format date helper for localized readability (e.g., "Terça-feira, 30 de Junho de 2026")
  const formatFullDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const weekdaysFull = [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];
    return `${weekdaysFull[dateObj.getDay()]}, ${day} de ${monthNames[month - 1]} de ${year}`;
  };

  const clearFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setSelectedDateStr(null);
  };

  // Generate calendar days grid
  const calendarCells = useMemo(() => {
    const cells = [];
    // 1. Previous month padded days
    const prevMonthDays = new Date(navYear, navMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        dayNum: prevMonthDays - i,
        isCurrentMonth: false,
        dateStr: '' // inactive date string to prevent selection
      });
    }

    // 2. Current month active days
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        dayNum: i,
        isCurrentMonth: true,
        dateStr: makeDateString(i)
      });
    }

    // 3. Next month padding days to complete standard 42-cell grid
    const remainingCells = 42 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push({
        dayNum: i,
        isCurrentMonth: false,
        dateStr: ''
      });
    }

    return cells;
  }, [navYear, navMonth, daysInMonth, startDayOfWeek]);

  return (
    <div id="archive-view-container" className="flex flex-col gap-6">
      
      {/* Intro Header */}
      <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-6 brutalist-shadow-sm">
        <div className="flex items-center gap-3 border-b-3 border-black pb-4 mb-4">
          <div className="p-2 bg-[#92d400] border-2 border-black rounded-xl brutalist-shadow-sm text-black">
            <FolderSync className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl md:text-2xl text-black">Arquivo Geral & Calendário Interativo</h2>
            <p className="font-mono text-xs text-gray-500 mt-0.5">Navega pelo calendário para descobrir iniciativas passadas e futuras.</p>
          </div>
        </div>
        <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
          Clica em qualquer dia do calendário para listar todos os eventos realizados ou agendados para essa data. Podes usar a barra de pesquisa e os filtros de campus ou categorias em simultâneo para refinar a tua exploração.
        </p>
      </div>

      {/* Main Grid Layout: Left Side (Filters & Calendar) | Right Side (Day Details or Full Archive) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Interactive Calendar and Filter Inputs (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Calendar Box */}
          <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-4 md:p-5 brutalist-shadow">
            
            {/* Calendar Month/Year Selector Header */}
            <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-4">
              <button
                id="calendar-prev-month"
                onClick={prevMonth}
                className="p-2.5 bg-white border-2 border-black rounded-xl hover:bg-stone-100 transition-all active:translate-y-[1px] cursor-pointer shadow-[2px_2px_0px_#000]"
                title="Mês Anterior"
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>

              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg md:text-xl text-black uppercase tracking-tight select-none">
                  {monthNames[navMonth]} {navYear}
                </span>
                
                {/* Visual Direct Selector Helper to fast jump years */}
                <select
                  aria-label="Selecionar Ano"
                  value={navYear}
                  onChange={(e) => {
                    setNavYear(Number(e.target.value));
                    setSelectedDateStr(null);
                  }}
                  className="bg-[#FAF6EE] border-2 border-black rounded-lg text-xs font-bold font-mono py-1 px-1.5 cursor-pointer text-black"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>

              <button
                id="calendar-next-month"
                onClick={nextMonth}
                className="p-2.5 bg-white border-2 border-black rounded-xl hover:bg-stone-100 transition-all active:translate-y-[1px] cursor-pointer shadow-[2px_2px_0px_#000]"
                title="Mês Seguinte"
              >
                <ChevronRight className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Weekday columns labels */}
            <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
              {weekdayNames.map((day) => (
                <div key={day} className="font-display font-black text-xs md:text-sm text-gray-500 uppercase select-none">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5" id="calendar-days-grid">
              {calendarCells.map((cell, idx) => {
                const isSelected = selectedDateStr === cell.dateStr;
                const isToday = cell.dateStr === todayStr;
                
                // Fetch events count for this specific day
                const dayEvents = cell.dateStr ? getEventsForDate(cell.dateStr) : [];
                const hasEvents = dayEvents.length > 0;

                return (
                  <button
                    key={idx}
                    disabled={!cell.isCurrentMonth}
                    onClick={() => {
                      if (cell.dateStr) {
                        setSelectedDateStr(isSelected ? null : cell.dateStr);
                      }
                    }}
                    className={`
                      aspect-square rounded-xl border-2 font-display text-xs md:text-sm font-bold flex flex-col items-center justify-between p-1 md:p-1.5 transition-all relative
                      ${!cell.isCurrentMonth 
                        ? 'bg-transparent border-transparent text-stone-300 pointer-events-none' 
                        : isSelected
                          ? 'bg-[#92d400] text-black border-black shadow-[3px_3px_0px_#000] scale-102 font-black z-10'
                          : hasEvents
                            ? 'bg-[#FAF6EE] border-black text-black hover:bg-[#92d400]/25 hover:border-black cursor-pointer shadow-[2px_2px_0px_#000]'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-black cursor-pointer'
                      }
                    `}
                  >
                    {/* Day number */}
                    <span className="self-start text-[11px] md:text-xs">
                      {cell.dayNum}
                    </span>

                    {/* Has events visual badges */}
                    {cell.isCurrentMonth && hasEvents && (
                      <div className="flex gap-0.5 items-center justify-center mt-1">
                        <span className={`
                          w-4 h-4 md:w-5 md:h-5 rounded-full border border-black flex items-center justify-center text-[8px] md:text-[9px] font-mono font-black shadow-[1px_1px_0px_#000]
                          ${isSelected ? 'bg-white text-black' : 'bg-[#92d400] text-black'}
                        `}>
                          {dayEvents.length}
                        </span>
                      </div>
                    )}

                    {/* Today indicator label dot */}
                    {isToday && (
                      <div className={`w-1.5 h-1.5 rounded-full absolute top-1 right-1 ${isSelected ? 'bg-black' : 'bg-[#92d400] border border-black'}`} title="Hoje" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-stone-200 text-[10px] font-mono text-gray-500 font-bold select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-[#FAF6EE] border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span>Dia com Iniciativa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-white border border-stone-200" />
                <span>Dia sem Iniciativa</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-[#92d400] border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span>Dia Selecionado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#92d400] border border-black" />
                <span>Hoje</span>
              </div>
            </div>

          </div>

          {/* Quick Filter Inputs */}
          <div id="archive-filters" className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-4 brutalist-shadow-sm flex flex-col gap-4">
            
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                id="archive-search-input"
                type="text"
                placeholder="Pesquisar arquivo por título, organizador ou local..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-sans text-xs font-semibold text-black placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  id="archive-clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 hover:bg-stone-200 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-black" />
                </button>
              )}
            </div>

            {/* Category switcher */}
            <div className="relative flex items-center">
              <SlidersHorizontal className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <select
                id="archive-category-filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-display font-bold text-xs text-black appearance-none cursor-pointer"
              >
                <option value="todos">Todas as Categorias 🏷️</option>
                {Object.values(EventCategory).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Active filters state bar */}
            {(selectedCategory !== 'todos' || searchQuery !== '' || selectedDateStr !== null) && (
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                <span className="font-mono text-gray-500 font-bold">
                  Filtros: {selectedDateStr ? `[Data: ${selectedDateStr}] ` : ''}
                  {selectedCategory !== 'todos' ? `[${selectedCategory}] ` : ''}
                  {searchQuery !== '' ? `[Termo: "${searchQuery.substring(0,10)}..."]` : ''}
                </span>
                <button
                  id="archive-reset-filters-btn"
                  onClick={clearFilters}
                  className="font-display font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 bg-rose-50 border border-rose-300 rounded-md px-2 py-0.5 cursor-pointer"
                >
                  Limpar Todos
                </button>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Events list (5 cols on large screens) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {selectedDateStr ? (
            /* Selected date panel */
            <div className="flex flex-col gap-4">
              <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-4 brutalist-shadow-sm flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#92d400] bg-black px-2 py-0.5 rounded-md self-start">
                    Dia Selecionado
                  </span>
                  <h3 className="font-display font-black text-sm md:text-base text-black mt-1">
                    {formatFullDate(selectedDateStr)}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="p-1.5 hover:bg-stone-100 border-2 border-black rounded-lg transition-colors cursor-pointer"
                  title="Limpar seleção de data"
                >
                  <X className="w-4 h-4 text-black" />
                </button>
              </div>

              {finalVisibleEvents.length === 0 ? (
                <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-8 text-center brutalist-shadow flex flex-col items-center justify-center gap-4">
                  <div className="w-14 h-14 bg-[#92d400]/20 border-2 border-black rounded-full flex items-center justify-center brutalist-shadow-sm">
                    <Calendar className="w-6 h-6 text-black" />
                  </div>
                  <h4 className="font-display font-bold text-md text-black">Sem eventos neste dia!</h4>
                  <p className="font-sans text-xs text-gray-500">Não existem iniciativas ou atividades registadas no arquivo para este dia específico.</p>
                  
                  <span className="text-[10px] font-mono text-gray-400">Tens um evento para anunciar neste dia?</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <span className="font-mono text-xs font-bold text-gray-500">
                    Encontrado(s) {finalVisibleEvents.length} evento(s) no dia:
                  </span>
                  
                  <div className="flex flex-col gap-4">
                    {finalVisibleEvents.map((event) => (
                      <div key={event.id} className="relative group">
                        {event.date < todayStr && (
                          <div className="absolute top-2.5 right-2.5 z-10 bg-gray-200 border border-black text-[9px] font-mono uppercase font-black tracking-wider px-2 py-0.5 rounded shadow-[1px_1px_0px_rgba(0,0,0,1)] text-gray-700">
                            Já decorreu
                          </div>
                        )}
                        <EventCard event={event} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* General Full Archive List when no day is selected */
            <div className="flex flex-col gap-4">
              <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-4 brutalist-shadow-sm">
                <h3 className="font-display font-bold text-sm text-black flex items-center gap-2">
                  <span>📂</span> Lista Completa do Arquivo
                </h3>
                <p className="font-sans text-[11px] text-gray-500 mt-0.5">
                  Mostrando todos os eventos filtrados. Clica em qualquer dia do calendário ao lado para ver apenas esse dia específico!
                </p>
              </div>

              <div className="flex flex-col gap-6" id="archive-grouped-list">
                {sortedMonthKeys.length === 0 ? (
                  <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-8 text-center brutalist-shadow flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center brutalist-shadow-sm">
                      <SlidersHorizontal className="w-5 h-5 text-black" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-black">Nenhum evento corresponde aos filtros!</h3>
                    <p className="font-sans text-[11px] text-gray-400">Limpa a pesquisa ou altera as categorias para ver o arquivo completo.</p>
                  </div>
                ) : (
                  sortedMonthKeys.map((monthKey) => {
                    const monthEvents = sortedGroupedEvents[monthKey];
                    return (
                      <div key={monthKey} className="flex flex-col gap-3">
                        {/* Month separator header */}
                        <div className="flex items-center gap-2 border-b-2 border-black pb-1">
                          <span className="font-display font-black text-xs uppercase tracking-tight text-black bg-[#92d400] border-2 border-black px-2 py-0.5 rounded-lg shadow-[2px_2px_0px_#000]">
                            {getMonthYearLabel(monthKey)}
                          </span>
                          <span className="font-mono text-[10px] text-gray-500 font-bold">
                            ({monthEvents.length})
                          </span>
                          <div className="flex-1 h-0.5 bg-black" />
                        </div>

                        {/* Event list in this month */}
                        <div className="flex flex-col gap-3">
                          {monthEvents.map((event) => {
                            const isPast = event.date < todayStr;
                            return (
                              <div key={event.id} className="relative group">
                                {isPast && (
                                  <div className="absolute top-2.5 right-2.5 z-10 bg-gray-200 border border-black text-[9px] font-mono uppercase font-black tracking-wider px-2 py-0.5 rounded shadow-[1px_1px_0px_rgba(0,0,0,1)] text-gray-700">
                                    Já decorreu
                                  </div>
                                )}
                                <EventCard event={event} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
