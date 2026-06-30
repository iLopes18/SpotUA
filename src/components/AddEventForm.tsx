import { useState, FormEvent } from 'react';
import { Sparkles, Calendar, Clock, MapPin, AlignLeft, User, Globe, Check } from 'lucide-react';
import { EventCategory, Campus, UAEvent } from '../types';
import { getOffsetDateString } from '../data';

interface AddEventFormProps {
  onAddEvent: (event: Omit<UAEvent, 'id' | 'isUserSubmitted'>) => void;
  onSuccess: () => void;
}

const PRESET_ORGANIZERS = [
  // Núcleos de Curso
  { name: 'NEEETA - Eletrotécnica e Aeroespacial', initials: 'EET', category: 'Núcleos de Curso' },
  { name: 'NAE-ESSUA - Escola Superior de Saúde', initials: 'ESS', category: 'Núcleos de Curso' },
  { name: 'NEI - Informática', initials: 'NEI', category: 'Núcleos de Curso' },
  { name: 'NEDM - Design e Multimédia', initials: 'NDM', category: 'Núcleos de Curso' },
  { name: 'NECA - Ciências do Ambiente', initials: 'NCA', category: 'Núcleos de Curso' },
  { name: 'NEM - Matemática', initials: 'NEM', category: 'Núcleos de Curso' },
  { name: 'NEF - Física', initials: 'NEF', category: 'Núcleos de Curso' },
  { name: 'NEBIO - Biologia', initials: 'BIO', category: 'Núcleos de Curso' },
  { name: 'NECI - Engenharia Civil', initials: 'CIV', category: 'Núcleos de Curso' },
  { name: 'NEG - Gestão', initials: 'NEG', category: 'Núcleos de Curso' },

  // Secções Autónomas e Núcleos AAUAv
  { name: 'AAUAv - Associação Académica da Universidade de Aveiro', initials: 'AAU', category: 'Secções Autónomas e Núcleos AAUAv' },
  { name: 'NCF - Núcleo de Cinema e Fotografia', initials: 'NCF', category: 'Secções Autónomas e Núcleos AAUAv' },
  { name: 'NRock - Núcleo de Música Moderna', initials: 'RCK', category: 'Secções Autónomas e Núcleos AAUAv' },
  { name: 'TFAAUAv - Tuna Feminina da AAUAv', initials: 'TFA', category: 'Secções Autónomas e Núcleos AAUAv' },
  { name: 'NXadrez - Núcleo de Xadrez', initials: 'NX', category: 'Secções Autónomas e Núcleos AAUAv' },
  { name: 'NCPLP - Núcleo das Comunidades Lusófonas', initials: 'PLP', category: 'Secções Autónomas e Núcleos AAUAv' },
  { name: 'NBicla - Núcleo da Bicicleta', initials: 'BIC', category: 'Secções Autónomas e Núcleos AAUAv' },
  { name: 'Nexus - Secção Autónoma', initials: 'NXS', category: 'Secções Autónomas e Núcleos AAUAv' },
  { name: 'DançArte - Núcleo de Dança', initials: 'DAN', category: 'Secções Autónomas e Núcleos AAUAv' },
  { name: 'NDM - Núcleo de Desportos Automatizados', initials: 'NDM', category: 'Secções Autónomas e Núcleos AAUAv' },

  // Outras Associações
  { name: 'BEST Aveiro', initials: 'BST', category: 'Outras Associações e Organizações' },
  { name: 'IEEE UA SB - Student Branch', initials: 'IEE', category: 'Outras Associações e Organizações' },
  { name: 'ESN Aveiro - Erasmus Student Network', initials: 'ESN', category: 'Outras Associações e Organizações' },
  { name: 'AETTUA', initials: 'AET', category: 'Outras Associações e Organizações' },
  { name: 'Sê Humano - Associação', initials: 'SH', category: 'Outras Associações e Organizações' },
  { name: 'GrETUA - Grupo Experimental de Teatro', initials: 'GET', category: 'Outras Associações e Organizações' },
];

export default function AddEventForm({ onAddEvent, onSuccess }: AddEventFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>(EventCategory.ACADEMICOS);
  const [date, setDate] = useState(getOffsetDateString(0)); // Default to today
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [location, setLocation] = useState('');
  const [campus, setCampus] = useState<Campus>(Campus.SANTIAGO);
  
  const [organizerPreset, setOrganizerPreset] = useState(PRESET_ORGANIZERS[0].name);
  const [customOrganizer, setCustomOrganizer] = useState('');
  const [customInitials, setCustomInitials] = useState('');
  
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    let finalOrganizer = '';
    let finalLogoText = '';

    if (organizerPreset === 'custom') {
      finalOrganizer = customOrganizer.trim();
      finalLogoText = customInitials.trim() 
        ? customInitials.trim().substring(0, 3).toUpperCase()
        : customOrganizer.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase() || 'UA';
    } else {
      const preset = PRESET_ORGANIZERS.find(p => p.name === organizerPreset);
      finalOrganizer = preset ? preset.name : '';
      finalLogoText = preset ? preset.initials : 'UA';
    }

    if (!title || !location || !finalOrganizer || !description) {
      return;
    }

    onAddEvent({
      title,
      category,
      date,
      startTime,
      endTime: endTime || undefined,
      location,
      campus,
      organizer: finalOrganizer,
      logoText: finalLogoText,
      description,
      link: link.trim() || undefined,
    });

    // Reset Form
    setTitle('');
    setCategory(EventCategory.ACADEMICOS);
    setDate(getOffsetDateString(0));
    setStartTime('14:00');
    setEndTime('16:00');
    setLocation('');
    setCampus(Campus.SANTIAGO);
    setOrganizerPreset(PRESET_ORGANIZERS[0].name);
    setCustomOrganizer('');
    setCustomInitials('');
    setDescription('');
    setLink('');

    // Success state
    setShowSuccessMsg(true);
    setTimeout(() => {
      setShowSuccessMsg(false);
      onSuccess(); // Switch back to the explorer timeline
    }, 2000);
  };

  return (
    <div id="add-event-container" className="max-w-2xl mx-auto bg-[#FFFDF9] border-3 border-black rounded-2xl p-6 md:p-8 brutalist-shadow">
      
      {showSuccessMsg ? (
        <div id="success-panel" className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-green-300 border-3 border-black rounded-full flex items-center justify-center brutalist-shadow-sm mb-4 animate-bounce">
            <Check className="w-8 h-8 text-black stroke-[3]" />
          </div>
          <h3 className="font-display font-bold text-2xl text-black mb-2">Evento Publicado!</h3>
          <p className="font-mono text-sm text-gray-600 max-w-sm">
            Obrigado por apoiar a comunidade UA. O teu evento já está listado na agenda da semana atual!
          </p>
        </div>
      ) : (
        <form id="add-event-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Header */}
          <div className="border-b-3 border-black pb-4 flex items-center gap-3">
            <div className="p-2 bg-[#92d400] border-2 border-black rounded-xl brutalist-shadow-sm">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl text-black">Divulgar Iniciativa</h2>
              <p className="font-mono text-xs text-gray-500 mt-0.5">Partilha palestras, festas, workshops ou jantares com a comunidade UA.</p>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title-input" className="font-display font-bold text-sm text-black uppercase flex items-center gap-2">
              Título do Evento <span className="text-rose-500">*</span>
            </label>
            <input
              id="title-input"
              type="text"
              required
              maxLength={80}
              placeholder="Ex: Torneio de Matraquilhos ou Tertúlia Literária"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-sans text-sm placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Organizer Selection */}
          <div className="flex flex-col gap-2">
            <label htmlFor="organizer-select" className="font-display font-bold text-sm text-black uppercase flex items-center gap-2">
              <User className="w-4 h-4 text-black" /> Organizador (Núcleo / Associação) <span className="text-rose-500">*</span>
            </label>
            <select
              id="organizer-select"
              value={organizerPreset}
              onChange={(e) => setOrganizerPreset(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-sans text-sm font-semibold text-black cursor-pointer"
            >
              <optgroup label="🎓 Núcleos de Curso" className="font-display font-bold text-xs text-gray-700 bg-[#FAF6EE] py-2">
                {PRESET_ORGANIZERS.filter(p => p.category === 'Núcleos de Curso').map((preset) => (
                  <option key={preset.name} value={preset.name} className="font-sans text-sm font-medium text-black py-1">
                    {preset.name} ({preset.initials})
                  </option>
                ))}
              </optgroup>
              
              <optgroup label="🎗️ Secções Autónomas e Núcleos AAUAv" className="font-display font-bold text-xs text-gray-700 bg-[#FAF6EE] py-2">
                {PRESET_ORGANIZERS.filter(p => p.category === 'Secções Autónomas e Núcleos AAUAv').map((preset) => (
                  <option key={preset.name} value={preset.name} className="font-sans text-sm font-medium text-black py-1">
                    {preset.name} ({preset.initials})
                  </option>
                ))}
              </optgroup>

              <optgroup label="⚙️ Outras Associações e Organizações" className="font-display font-bold text-xs text-gray-700 bg-[#FAF6EE] py-2">
                {PRESET_ORGANIZERS.filter(p => p.category === 'Outras Associações e Organizações').map((preset) => (
                  <option key={preset.name} value={preset.name} className="font-sans text-sm font-medium text-black py-1">
                    {preset.name} ({preset.initials})
                  </option>
                ))}
              </optgroup>

              <optgroup label="✨ Outras Opções" className="font-display font-bold text-xs text-gray-700 bg-[#FAF6EE] py-2">
                <option value="custom" className="font-sans text-sm font-semibold text-black py-1">✨ Outro / Criar Novo Núcleo ou Associação...</option>
              </optgroup>
            </select>
          </div>

          {/* Conditional Custom Organizer Details */}
          {organizerPreset === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-2 border-dashed border-black rounded-xl p-4 bg-[#FAF6EE]/50">
              <div className="md:col-span-2 flex flex-col gap-2">
                <label htmlFor="custom-organizer-input" className="font-display font-bold text-xs text-black uppercase">
                  Nome do Novo Organizador <span className="text-rose-500">*</span>
                </label>
                <input
                  id="custom-organizer-input"
                  type="text"
                  required
                  placeholder="Ex: Núcleo de Estudantes de Cinema (NECIN)"
                  value={customOrganizer}
                  onChange={(e) => setCustomOrganizer(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-sans text-xs placeholder:text-gray-400 font-medium text-black"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="custom-initials-input" className="font-display font-bold text-xs text-black uppercase">
                  Sigla (Sigla/Logo)
                </label>
                <input
                  id="custom-initials-input"
                  type="text"
                  maxLength={3}
                  placeholder="Ex: CIN"
                  value={customInitials}
                  onChange={(e) => setCustomInitials(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-display font-bold text-center text-xs placeholder:text-gray-400 text-black"
                />
                <span className="text-[9px] font-mono text-gray-500 text-right">Max 3 letras.</span>
              </div>
            </div>
          )}

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label htmlFor="category-select" className="font-display font-bold text-sm text-black uppercase">
              Categoria <span className="text-rose-500">*</span>
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full px-4 py-3 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-display font-bold text-sm text-black"
            >
              {Object.values(EventCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="date-input" className="font-display font-bold text-sm text-black uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-black" /> Data <span className="text-rose-500">*</span>
              </label>
              <input
                id="date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-mono text-sm"
              />
              <span className="text-[10px] font-mono text-gray-500">Seleciona qualquer data do evento.</span>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="starttime-input" className="font-display font-bold text-sm text-black uppercase flex items-center gap-2">
                <Clock className="w-4 h-4 text-black" /> Hora de Início <span className="text-rose-500">*</span>
              </label>
              <input
                id="starttime-input"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-mono text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="endtime-input" className="font-display font-bold text-sm text-black uppercase flex items-center gap-2">
                <Clock className="w-4 h-4 text-black" /> Hora de Fim
              </label>
              <input
                id="endtime-input"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-mono text-sm"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="flex flex-col gap-2">
            <label htmlFor="location-input" className="font-display font-bold text-sm text-black uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4 text-black" /> Local <span className="text-rose-500">*</span>
            </label>
            <input
              id="location-input"
              type="text"
              required
              placeholder="Ex: Anfiteatro DeCA (11.1.13) ou Pavilhão Aristides Hall"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-sans text-sm placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description-textarea" className="font-display font-bold text-sm text-black uppercase flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-black" /> Descrição <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="description-textarea"
              required
              rows={4}
              maxLength={400}
              placeholder="Descreve detalhadamente o evento, atividades, público-alvo ou detalhes adicionais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-sans text-sm placeholder:text-gray-400 leading-relaxed font-medium"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>Máximo de 400 caracteres.</span>
              <span>{description.length}/400</span>
            </div>
          </div>

          {/* Subscriptions / Social URL */}
          <div className="flex flex-col gap-2">
            <label htmlFor="link-input" className="font-display font-bold text-sm text-black uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-black" /> Link de Inscrição ou Redes Sociais
            </label>
            <input
              id="link-input"
              type="url"
              placeholder="Ex: https://instagram.com/p/... ou Google Forms link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6EE] border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-[#92d400] font-mono text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <button
            id="submit-event-btn"
            type="submit"
            className="w-full py-4 mt-2 bg-[#92d400] hover:opacity-95 font-display font-bold text-base border-3 border-black rounded-xl brutalist-shadow transition-transform active:translate-y-[2px] cursor-pointer text-black text-center"
          >
            Publicar Evento na Agenda 🚀
          </button>
        </form>
      )}
    </div>
  );
}
