import { useState } from 'react';
import { Clock, MapPin, Compass, ExternalLink, ChevronDown, ChevronUp, Share2, Calendar } from 'lucide-react';
import { UAEvent, EventCategory } from '../types';
import { CATEGORY_STYLES, formatWeekdayLabel, formatDateLabel } from '../data';

interface EventCardProps {
  key?: string;
  event: UAEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const style = CATEGORY_STYLES[event.category];

  const handleShare = () => {
    const text = `SpotUA: ${event.title} | ${event.organizer}\n📅 ${formatWeekdayLabel(event.date)}, ${formatDateLabel(event.date)} às ${event.startTime}\n📍 ${event.location}\n\nEspreita no SpotUA!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInstagramEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:instagram\.com\/(?:p|reel)\/)([a-zA-Z0-9_\-]+)/i);
    return match && match[1] ? `https://www.instagram.com/p/${match[1]}/embed` : null;
  };

  const instagramEmbedUrl = getInstagramEmbedUrl(event.link);

  return (
    <div 
      id={`event-card-${event.id}`}
      className={`bg-[#FFFDF9] border-3 border-black rounded-2xl p-5 ${style.shadow} transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col gap-4 overflow-hidden`}
    >
      {/* Category Accent Stripe on the left */}
      <div className={`absolute top-0 left-0 bottom-0 w-3 border-r-3 border-black ${style.bg}`} />

      {/* Main Content Area */}
      <div className="pl-4 flex flex-col gap-3">
        {/* Header: Logo, Category, Badges, Favorite */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-3">
            {/* Logo initials bubble */}
            <div className="w-11 h-11 shrink-0 bg-yellow-400 border-2 border-black rounded-xl flex items-center justify-center font-display font-bold text-sm text-black brutalist-shadow-sm select-none">
              {event.logoText}
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono font-bold text-gray-500 tracking-wider uppercase">
                {event.organizer}
              </span>
              
              {/* Category tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 text-xs font-display font-bold border-2 border-black rounded-md brutalist-shadow-sm ${style.bg} ${style.text}`}>
                  {event.category}
                </span>
                
                {event.isUserSubmitted && (
                  <span className="px-2.5 py-0.5 text-xs font-mono font-bold border-2 border-black rounded-md brutalist-shadow-sm bg-amber-100 text-amber-900">
                    Comunidade 🤝
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons on the top right */}
          <div className="flex items-center gap-2">
            <button
              id={`share-btn-${event.id}`}
              onClick={handleShare}
              className="p-2 border-2 border-black rounded-xl bg-white hover:bg-yellow-100 transition-colors brutalist-shadow-sm active:translate-y-[1px]"
              title="Copiar partilha rápida"
            >
              {copied ? (
                <span className="text-xs font-bold font-mono text-emerald-600 px-1">Copiado!</span>
              ) : (
                <Share2 className="w-4 h-4 text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg md:text-xl text-black leading-tight mt-1 hover:text-yellow-600 transition-colors">
          {event.title}
        </h3>

        {/* Event Meta: Date, Time, Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm border-t border-b border-gray-100 py-3 mt-1 font-medium text-gray-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600 shrink-0" />
            <span>{formatWeekdayLabel(event.date)}, {formatDateLabel(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600 shrink-0" />
            <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
            <MapPin className="w-4 h-4 text-gray-600 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Expanded Description or shortened */}
        <div className="mt-1">
          <p className={`text-sm text-gray-600 leading-relaxed font-sans ${isExpanded ? '' : 'line-clamp-2'}`}>
            {event.description}
          </p>

          {/* Instagram Post Embed Preview */}
          {instagramEmbedUrl && isExpanded && (
            <div className="mt-4 border-2 border-black rounded-xl overflow-hidden brutalist-shadow-sm bg-white aspect-[4/5] max-w-sm mx-auto w-full">
              <iframe
                src={instagramEmbedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title={`Instagram Post Preview - ${event.title}`}
              />
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3 pt-1">
            <button
              id={`expand-btn-${event.id}`}
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-black hover:text-yellow-600 uppercase transition-colors"
            >
              {isExpanded ? (
                <>
                  Ver Menos <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Ler Descrição {instagramEmbedUrl ? "+ Post 📸" : ""}<ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            {event.link && (
              <a
                id={`link-btn-${event.id}`}
                href={event.link}
                target="_blank"
                rel="noreferrer"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-display font-bold border-2 border-black rounded-lg bg-yellow-300 hover:bg-yellow-400 brutalist-shadow-sm transition-transform active:translate-y-[1px] text-black"
              >
                {instagramEmbedUrl ? 'Ver no Instagram 📸' : 'Inscrição / Info'} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
