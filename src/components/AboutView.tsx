import { Info, Sparkles, MessageSquare, Heart, MapPin, Calendar, Compass } from 'lucide-react';

export default function AboutView() {
  return (
    <div id="about-container" className="max-w-3xl mx-auto flex flex-col gap-6 font-sans">
      
      {/* Welcome Card */}
      <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-6 md:p-8 brutalist-shadow">
        <div className="flex items-center gap-3 border-b-3 border-black pb-4 mb-4">
          <div className="p-2 bg-[#92d400] border-2 border-black rounded-xl brutalist-shadow-sm text-black">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl md:text-2xl text-black">Sobre o SpotUA</h2>
            <p className="font-mono text-xs text-gray-500 mt-0.5">O teu radar comunitário na Universidade de Aveiro.</p>
          </div>
        </div>

        <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
          Cansado de perder os melhores eventos, palestras, jantares de curso ou workshops na UA por só saberes deles depois de terem acontecido?
        </p>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          O <strong>SpotUA</strong> é uma plataforma simples, intuitiva e centralizada que te mostra, num piscar de olhos, tudo o que está a acontecer na comunidade UA durante a semana corrente. Ficas a saber o quê, onde e quando, sem complicações.
        </p>
      </div>

      {/* Grid: 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-[#FFFDF9] border-3 border-black rounded-xl p-5 brutalist-shadow-sm flex flex-col gap-2">
          <div className="w-9 h-9 bg-blue-200 border-2 border-black rounded-lg flex items-center justify-center font-bold text-black mb-1">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-black">Agenda Semanal</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Foco exclusivo nos próximos 7 dias. Entra na app e sabe imediatamente o que podes fazer hoje, amanhã ou no fim de semana.
          </p>
        </div>

        <div className="bg-[#FFFDF9] border-3 border-black rounded-xl p-5 brutalist-shadow-sm flex flex-col gap-2">
          <div className="w-9 h-9 bg-emerald-200 border-2 border-black rounded-lg flex items-center justify-center font-bold text-black mb-1">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-black">Preview Instagram</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Se uma iniciativa contiver links para posts ou reels do Instagram, mostramos a publicação incorporada diretamente na descrição!
          </p>
        </div>

        <div className="bg-[#FFFDF9] border-3 border-black rounded-xl p-5 brutalist-shadow-sm flex flex-col gap-2">
          <div className="w-9 h-9 bg-rose-200 border-2 border-black rounded-lg flex items-center justify-center font-bold text-black mb-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-black">Neo-Brutalismo</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Uma interface de alto contraste, moderna, ultra-rápida, mobile-first e focada exclusivamente na legibilidade.
          </p>
        </div>

      </div>

      {/* Made for/by community */}
      <div className="bg-[#FFEAD2] border-3 border-black rounded-2xl p-6 brutalist-shadow flex flex-col md:flex-row gap-5 items-start md:items-center">
        <div className="p-3 bg-white border-2 border-black rounded-xl brutalist-shadow-sm shrink-0">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-black mb-1">Feito pela e para a Comunidade</h3>
          <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
            Este é um espaço aberto e gratuito. Qualquer aluno, núcleo de estudantes, associação (AAUAv) ou docente pode divulgar as suas iniciativas diretamente. Basta ires ao separador <strong>Divulgar</strong>, preencheres o formulário e o evento aparecerá instantaneamente para toda a academia!
          </p>
        </div>
      </div>

      {/* Tech Info */}
      <div className="bg-[#FFFDF9] border-3 border-black rounded-2xl p-6 brutalist-shadow font-mono text-xs text-gray-500 flex flex-col gap-2">
        <div className="flex items-center gap-2 font-bold text-black mb-1">
          <Sparkles className="w-4 h-4 text-[#92d400]" />
          <span>Perguntas Frequentes (FAQ):</span>
        </div>
        <ul className="list-disc list-inside space-y-2 pl-1">
          <li>
            <strong>As atividades ficam guardadas no Firebase?</strong><br />
            <span className="text-gray-700 pl-4 inline-block mt-0.5">Sim! Todas as iniciativas adicionadas pela comunidade no separador "Divulgar" são guardadas de forma segura e síncrona numa base de dados Cloud Firestore no Firebase, ficando disponíveis em tempo real para todos os utilizadores.</span>
          </li>
          <li>
            <strong>Como posso ver uma foto/vídeo do Instagram?</strong><br />
            <span className="text-gray-700 pl-4 inline-block mt-0.5">Ao divulgar um evento, basta adicionares o link público de um Post ou Reel do Instagram. Nos detalhes desse evento, qualquer utilizador poderá ver o post incorporado diretamente na app!</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
