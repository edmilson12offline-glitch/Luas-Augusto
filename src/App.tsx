import { useState, useEffect } from "react";
import { 
  Briefcase, 
  TrendingUp, 
  Mail, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  BookOpen, 
  Menu, 
  X,
  Target,
  Sparkles,
  Award,
  ChevronRight,
  Database,
  ArrowRightLeft,
  Share2
} from "lucide-react";

// Types for Saved Proposals
interface SavedProposal {
  id: string;
  clientName: string;
  businessName: string;
  niche: string;
  proposedFee: number;
  adBudget: number;
  city: string;
  status: "Pendente" | "Fechado" | "Recusado";
  date: string;
  specificDetail: string; // e.g. Car Model, treatment, or product category
}

type NicheKey = "autos" | "imoveis" | "clinicas" | "restaurantes" | "servicos" | "geral";

interface NicheConfig {
  label: string;
  defaultTicket: number;
  defaultCPC: number;
  defaultClickToWhatsApp: number;
  defaultCloseRate: number;
  exampleObject: string; // Specific detail prompt (e.g. Model of vehicle)
  placeholderText: string;
}

const NICHES: Record<NicheKey, NicheConfig> = {
  autos: {
    label: "Stands de Automóveis",
    defaultTicket: 450000,
    defaultCPC: 15,
    defaultClickToWhatsApp: 18,
    defaultCloseRate: 4,
    exampleObject: "Toyota Hilux",
    placeholderText: "Ex: Toyota Hilux ou Mazda Demio"
  },
  imoveis: {
    label: "Imobiliária & Corretores",
    defaultTicket: 1200000,
    defaultCPC: 25,
    defaultClickToWhatsApp: 12,
    defaultCloseRate: 2,
    exampleObject: "Apartamento T3 na Polana",
    placeholderText: "Ex: Moradia T4 na Matola ou Apartamento"
  },
  clinicas: {
    label: "Clínicas & Consultórios",
    defaultTicket: 4500,
    defaultCPC: 12,
    defaultClickToWhatsApp: 20,
    defaultCloseRate: 15,
    exampleObject: "Tratamento Dentário",
    placeholderText: "Ex: Implante Dentário ou Check-up"
  },
  restaurantes: {
    label: "Restaurante & Catering",
    defaultTicket: 1200,
    defaultCPC: 6,
    defaultClickToWhatsApp: 25,
    defaultCloseRate: 35,
    exampleObject: "Menu de Cabrito",
    placeholderText: "Ex: Buffet de Domingo ou Hamburgueres"
  },
  servicos: {
    label: "Serviços B2B / Consultorias",
    defaultTicket: 15000,
    defaultCPC: 18,
    defaultClickToWhatsApp: 15,
    defaultCloseRate: 8,
    exampleObject: "Consultoria Contábil",
    placeholderText: "Ex: Assessoria Jurídica ou Auditoria"
  },
  geral: {
    label: "Geral (Retalho / E-commerce)",
    defaultTicket: 2500,
    defaultCPC: 8,
    defaultClickToWhatsApp: 18,
    defaultCloseRate: 10,
    exampleObject: "Roupas e Moda",
    placeholderText: "Ex: Smartphones ou Sapatos"
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"bio" | "roi" | "propostas" | "workspace">("bio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ROI Calculator States
  const [roiNiche, setRoiNiche] = useState<NicheKey>("autos");
  const [roiBudget, setRoiBudget] = useState<number>(10000); // Monthly budget in MT
  const [roiCPC, setRoiCPC] = useState<number>(NICHES.autos.defaultCPC);
  const [roiClickToWa, setRoiClickToWa] = useState<number>(NICHES.autos.defaultClickToWhatsApp);
  const [roiCloseRate, setRoiCloseRate] = useState<number>(NICHES.autos.defaultCloseRate);
  const [roiTicket, setRoiTicket] = useState<number>(NICHES.autos.defaultTicket);

  // Update calculator inputs when niche changes
  useEffect(() => {
    const config = NICHES[roiNiche];
    setRoiCPC(config.defaultCPC);
    setRoiClickToWa(config.defaultClickToWhatsApp);
    setRoiCloseRate(config.defaultCloseRate);
    setRoiTicket(config.defaultTicket);
  }, [roiNiche]);

  // Proposal Generator Tool States
  const [clientName, setClientName] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [propNiche, setPropNiche] = useState<NicheKey>("autos");
  const [specificDetail, setSpecificDetail] = useState<string>("");
  const [propFee, setPropFee] = useState<number>(6000); // Edmilson's management fee
  const [propBudget, setPropBudget] = useState<number>(250); // Daily budget
  const [propCity, setPropCity] = useState<string>("Maputo");

  // Saved Proposals State
  const [savedProposals, setSavedProposals] = useState<SavedProposal[]>(() => {
    try {
      const stored = localStorage.getItem("edmilson_proposals");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Feedback states
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Save proposals to localStorage
  useEffect(() => {
    localStorage.setItem("edmilson_proposals", JSON.stringify(savedProposals));
  }, [savedProposals]);

  // Format currency helper
  const formatMT = (value: number) => {
    return new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace("MZN", "MT");
  };

  // Perform ROI Calculations
  const calculatedClicks = Math.round(roiBudget / roiCPC);
  const calculatedWaContacts = Math.round(calculatedClicks * (roiClickToWa / 100));
  const calculatedSales = Math.round(calculatedWaContacts * (roiCloseRate / 100));
  const calculatedRevenue = calculatedSales * roiTicket;
  const netProfit = calculatedRevenue - roiBudget;
  const roiRatio = roiBudget > 0 ? (calculatedRevenue / roiBudget).toFixed(1) : "0.0";
  const roiPercentage = roiBudget > 0 ? Math.round(((calculatedRevenue - roiBudget) / roiBudget) * 100) : 0;

  // Handle saving generated proposal
  const handleSaveProposal = () => {
    if (!clientName || !businessName) {
      alert("Por favor, preencha o nome do cliente e do negócio.");
      return;
    }

    const newProp: SavedProposal = {
      id: Date.now().toString(),
      clientName,
      businessName,
      niche: NICHES[propNiche].label,
      proposedFee: propFee,
      adBudget: propBudget * 30, // monthly calculation
      city: propCity,
      status: "Pendente",
      date: new Date().toLocaleDateString("pt-MD", { year: 'numeric', month: 'long', day: 'numeric' }),
      specificDetail: specificDetail || NICHES[propNiche].exampleObject
    };

    setSavedProposals([newProp, ...savedProposals]);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteProposal = (id: string) => {
    if (confirm("Tem certeza que deseja apagar esta proposta?")) {
      setSavedProposals(savedProposals.filter(p => p.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, newStatus: "Pendente" | "Fechado" | "Recusado") => {
    setSavedProposals(
      savedProposals.map(p => p.id === id ? { ...p, status: newStatus } : p)
    );
  };

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Pre-compiled Script Text generator
  const getPitchScript = () => {
    const detail = specificDetail || NICHES[propNiche].exampleObject;
    const nicheLabel = NICHES[propNiche].label;
    
    let nicheReference = `noto que vocês têm um excelente trabalho com a vossa oferta`;
    if (propNiche === "autos") {
      nicheReference = `noto que vocês têm excelentes viaturas em stock, como o ${detail}`;
    } else if (propNiche === "imoveis") {
      nicheReference = `noto que vocês têm ótimos imóveis listados, como o ${detail}`;
    } else if (propNiche === "clinicas") {
      nicheReference = `noto o vosso cuidado e profissionalismo nos serviços de saúde, por exemplo, o seu foco em ${detail}`;
    } else if (propNiche === "restaurantes") {
      nicheReference = `vejo pratos fantásticos no vosso menu, como o famoso ${detail}`;
    } else if (propNiche === "servicos") {
      nicheReference = `reparo na qualidade corporativa do vosso serviço de ${detail}`;
    }

    return `Olá, ${clientName || "Responsável"} da ${businessName || "empresa"}, tudo bem?

Acompanho o perfil da ${businessName || "vossa empresa"} nas redes sociais e ${nicheReference}.

O meu nome é Edmilson e trabalho com anúncios digitais focados em atrair clientes em Moçambique. Analisando a vossa atividade, percebi que há uma grande oportunidade para aumentar o volume de potenciais clientes que entram em contacto convosco diariamente interessados em comprar ou agendar.

Gostaria de saber se tem interesse em analisar uma proposta simples de como podemos estruturar uma campanha de anúncios para direcionar pessoas qualificadas de ${propCity} diretamente para o vosso WhatsApp Business.

Se fizer sentido para o vosso momento actual, podemos marcar uma breve chamada de 10 minutos (sem compromisso) para apresentar algumas ideias.

Um abraço,
Edmilson - Especialista em Vendas Online
Contacto: +258 855 545 045`;
  };

  // Pre-compiled Proposal Text generator
  const getProposalText = () => {
    const monthlyAdBudget = propBudget * 30;
    const totalInvestment = propFee + monthlyAdBudget;
    
    return `==========================================
PROPOSTA DE PARCERIA COMERCIAL - GESTÃO DE TRÁFEGO
==========================================

PREPARADO PARA: ${clientName || "[Nome Cliente]"} / ${businessName || "[Negócio]"}
ELABORADO POR: Edmilson (Especialista em Vendas e Anúncios Digitais)
LOCALIZAÇÃO DE CAMPANHA: ${propCity} (Moçambique)
DATA: ${new Date().toLocaleDateString("pt-MD", { year: "numeric", month: "long", day: "numeric" })}

------------------------------------------
1. OBJETIVO PRINCIPAL
------------------------------------------
Implementar e otimizar campanhas de anúncios patrocinados focadas em atrair potenciais compradores interessados em ${specificDetail || NICHES[propNiche].exampleObject} diretamente para o WhatsApp Business da vossa empresa de forma consistente e lucrativa.

------------------------------------------
2. O QUE ESTÁ INCLUÍDO NO SERVIÇO
------------------------------------------
✔ Planeamento estratégico do público-alvo (idade, localização, interesses locais)
✔ Criação técnica de anúncios persuasivos (fotos, vídeos e redactores de texto)
✔ Configuração do funil de conversão direcionado ao WhatsApp da sua equipa
✔ Monitoramento diário e afinação de campanhas para reduzir o custo por contacto
✔ Relatórios mensais simplificados focados nos seus ganhos e ROI

------------------------------------------
3. ESTRUTURA DE INVESTIMENTO
------------------------------------------
a) Investimento em Tráfego (Pago ao Facebook/Meta):
   • Diário: ${formatMT(propBudget)} / dia
   • Mensal (estimado): ${formatMT(monthlyAdBudget)} / mês
   *Nota: Este valor é creditado diretamente na API do Facebook para exibição dos anúncios.*

b) Taxa de Gestão Profissional (Pago ao Gestor):
   • Valor Mensal: ${formatMT(propFee)} / mês
   *Abrange a estratégia, design de anúncios, automações de direcionamento e suporte permanente.*

INVESTIMENTO ESTRUTURADO TOTAL: ${formatMT(totalInvestment)} / mês

------------------------------------------
4. PRÓXIMOS PASSOS
------------------------------------------
Para avançarmos com a produção dos anúncios:
1. Agendamento da chamada rápida de alinhamento de 10 minutos.
2. Criação do acesso à conta de publicidade.
3. Envio das primeiras imagens/vídeos pelo seu negócio.
4. Lançamento da primeira campanha de atração de clientes em 48 horas.

------------------------------------------
CONTACTOS COMERCIAIS
----------------------------------------  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F4F6] font-sans selection:bg-amber-500 selection:text-black leading-relaxed">
      {/* Dynamic Font and Style Injector */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .serif {
          font-family: 'Playfair Display', serif !important;
        }
        
        .sans {
          font-family: 'Inter', sans-serif !important;
        }

        .glass {
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .accent-text {
          color: #F59E0B !important;
        }

        .accent-bg {
          background-color: #F59E0B !important;
        }

        .accent-border {
          border-color: #F59E0B !important;
        }

        .pill {
          background: rgba(245, 158, 11, 0.08) !important;
          border: 1px solid rgba(245, 158, 11, 0.2) !important;
          color: #F59E0B !important;
          padding: 4px 14px !important;
          border-radius: 9999px !important;
          font-size: 0.7rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.15em !important;
          font-weight: 600 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        /* Overwrite standard inputs for premium feel */
        input, select, textarea {
          transition: all 0.2s ease-in-out;
        }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(245, 158, 11, 0.4) !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1) !important;
        }
      `}</style>

      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#050505]/90 border-b border-white/10">
        <div id="header-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo element */}
          <div className="flex items-center space-x-3 group">
            <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-500 shadow-md transition-transform duration-200">
              <TrendingUp className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h1 className="serif text-2xl font-light tracking-tight text-white leading-none">
                Edmilson <span className="text-amber-500 italic">Ads</span>
              </h1>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-semibold block mt-1">
                Gestão de Tráfego & Vendas
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="tab-bio"
              onClick={() => setActiveTab("bio")}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                activeTab === "bio"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  : "text-white/60 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              💼 Apresentação
            </button>
            <button
              id="tab-roi"
              onClick={() => setActiveTab("roi")}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                activeTab === "roi"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  : "text-white/60 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              🧮 Simulador de ROI
            </button>
            <button
              id="tab-workspace"
              onClick={() => setActiveTab("workspace")}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                activeTab === "workspace"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  : "text-white/60 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              ⚙️ Gerador de Propostas
            </button>
            <button
              id="tab-propostas"
              onClick={() => setActiveTab("propostas")}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 border relative ${
                activeTab === "propostas"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  : "text-white/60 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              📋 Propostas Salvas
              {savedProposals.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                  {savedProposals.length}
                </span>
              )}
            </button>
          </nav>

          {/* Desktop Right Button */}
          <div className="hidden md:block">
            <a 
              id="btn-whatsapp-header"
              href="https://wa.me/258855545045?text=Olá%20Edmilson,%20visitei%20o%20teu%20portfolio%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20trabalho%20de%20anúncios%20online."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-white/90 text-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center space-x-2"
            >
              <Send className="w-3.5 h-3.5 fill-current text-black" />
              <span>Falar WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0A0A0A] border-b border-white/10 p-4 space-y-2">
            <button
              onClick={() => { setActiveTab("bio"); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                activeTab === "bio" ? "bg-amber-500/10 text-amber-500" : "text-white/60"
              }`}
            >
              💼 Apresentação
            </button>
            <button
              onClick={() => { setActiveTab("roi"); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                activeTab === "roi" ? "bg-amber-500/10 text-amber-500" : "text-white/60"
              }`}
            >
              🧮 Simulador de ROI
            </button>
            <button
              onClick={() => { setActiveTab("workspace"); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                activeTab === "workspace" ? "bg-amber-500/10 text-amber-500" : "text-white/60"
              }`}
            >
              ⚙️ Gerador de Propostas
            </button>
            <button
              onClick={() => { setActiveTab("propostas"); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider relative ${
                activeTab === "propostas" ? "bg-amber-500/10 text-amber-500" : "text-white/60"
              }`}
            >
              📋 Propostas Salvas ({savedProposals.length})
            </button>
            <div className="pt-2 border-t border-white/10">
              <a 
                href="https://wa.me/258855545045?text=Olá%20Edmilson,%20visitei%20o%20teu%20portfolio%20e%20gostaria%20de%20saber%20mais."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white text-black font-bold block text-center py-3 rounded-lg text-xs uppercase tracking-widest"
              >
                Falar Connosco no WhatsApp
              </a>
            </div>
          </div>
                {/* TAB 1: PRESENTATION & ABT SERVICES */}
        {activeTab === "bio" && (
          <div className="space-y-16 animate-fade-in">
            {/* HERO HERO SECTION */}
            <div className="text-center max-w-4xl mx-auto space-y-6 pt-4">
              <div>
                <span className="pill">Disponível para Parcerias</span>
              </div>
              <h2 className="serif text-5xl sm:text-6xl font-light tracking-tight leading-tight sm:leading-none text-white">
                Transforme visualizações das suas redes em <span className="accent-text italic">faturamento real.</span>
              </h2>
              <p className="text-lg text-white/75 max-w-2xl mx-auto leading-relaxed sans font-light">
                Ajudo empresas, stands, imobiliárias e prestadores de serviços em Moçambique a multiplicarem as suas vendas mensais com campanhas estruturadas de anúncios e directs integrados.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a 
                  href="https://wa.me/258855545045?text=Olá%20Edmilson,%20gostaria%20de%20solicitar%20uma%20análise%20gratuita%20de%20anúncios%20para%20o%20meu%20negócio."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white hover:bg-white/90 text-black px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all hover:scale-102 flex items-center justify-center space-x-3 shadow-xl"
                >
                  <Send className="w-4 h-4 fill-current text-black" />
                  <span>Agendar Análise Gratuita</span>
                </a>
                <button
                  onClick={() => {
                    const el = document.getElementById("abt-biografia");
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-transparent border border-white/20 text-white hover:border-white/50 px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center"
                >
                  Saber mais sobre o Edmilson
                </button>
              </div>
            </div>

            {/* TRUST BADGES OR SECTORS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6">
              {[
                { title: "Facebook & Insta Ads", desc: "Campanhas Cirúrgicas" },
                { title: "+ Mensagens Diárias", desc: "WhatsApp Qualificado" },
                { title: "Resultados em Meticais", desc: "Foco em Faturamento" },
                { title: "Relatórios Claros", desc: "Zero Métricas de Vaidade" }
              ].map((badge, idx) => (
                <div key={idx} className="glass p-5 rounded-xl text-center">
                  <h4 className="serif accent-text text-lg font-light tracking-wide">{badge.title}</h4>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 mt-1 font-semibold">{badge.desc}</p>
                </div>
              ))}
            </div>

            {/* ABT PROFILE CARD SECTION (QUEM SOU EU & BIO) */}
            <div id="abt-biografia" className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-white/5">
              
              {/* Left Column: Visual Card - Edmilson Profile */}
              <div id="profile-card" className="lg:col-span-5 glass p-8 rounded-2xl flex flex-col justify-between space-y-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-6">
                  {/* Avatar Representativo */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-500 font-serif font-light text-2xl shadow-lg">
                      Ed
                    </div>
                    <div>
                      <h3 className="serif text-2xl font-light text-white tracking-wide">Edmilson</h3>
                      <p className="text-xs text-amber-500 uppercase tracking-widest font-semibold mt-0.5">Gestor de Vendas & Tráfego</p>
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Curta Bio */}
                  <div className="space-y-4">
                    <p className="text-sm text-white/70 italic font-light leading-relaxed">
                      "Ajudo negócios em Moçambique a estruturar canais automáticos de atração de clientes. O meu foco é colocar pessoas interessadas em comprar as suas viaturas, imóveis ou serviços a conversar diretamente com a sua equipa, de forma rentável."
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-white/40">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Estratégias otimizadas para o leilão e público de Moçambique</span>
                    </div>
                  </div>
                </div>

                {/* Contact list with quick click capabilities */}
                <div className="space-y-4 pt-6 border-t border-white/10 font-light text-sm">
                  <div className="flex items-center space-x-3 text-white/70">
                    <div className="p-2 bg-white/5 rounded-lg text-amber-500">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>Moçambique (Maputo, Beira, Matola)</span>
                  </div>
                  
                  <a 
                    href="tel:855545045"
                    className="flex items-center space-x-3 text-white/70 hover:text-amber-500 transition-colors"
                  >
                    <div className="p-2 bg-white/5 rounded-lg text-amber-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>+258 855 545 045</span>
                  </a>

                  <a 
                    href="mailto:edmilson12offline@gmail.com"
                    className="flex items-center space-x-3 text-white/70 hover:text-amber-500 transition-colors"
                  >
                    <div className="p-2 bg-white/5 rounded-lg text-amber-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>edmilson12offline@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Persuasive copy and Services breakdown */}
              <div className="lg:col-span-7 space-y-8 flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] block mb-2">
                      Foco Técnico Operacional
                    </span>
                    <h3 className="serif text-4xl font-light tracking-tight text-white">Canal de Aquisição Automático</h3>
                  </div>

                  <p className="text-white/70 text-base leading-relaxed font-light">
                    Anúncios digitais de alta performance eliminam o trabalho tradicional de prospeção fria e a dependência de indicações. Em vez de focar em likes ou seguidores vazios, estruturo campanhas desenhadas sob medida para reter atenção, captar contactos qualificados de compradores ativos e direccioná-los directamente para a sua equipa de vendas.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Facebook & Instagram Ads",
                        text: "Campanhas refinadas para o perfil de consumo das principais províncias moçambicanas."
                      },
                      {
                        title: "Conversão Direta no WhatsApp",
                        text: "Funil rápido estruturado para que o seu WhatsApp Business receba solicitações diárias."
                      },
                      {
                        title: "Públicos de Alta Conversão",
                        text: "Segmentação sofisticada em stands e imobiliários para capturar decisores reais."
                      },
                      {
                        title: "Monitorização e Relatórios",
                        text: "Transparência total sobre custo por contacto e retorno sobre o investimento em anúncios."
                      }
                    ].map((service, index) => (
                      <div key={index} className="glass p-5 rounded-xl space-y-2 hover:border-amber-500/20 transition-all">
                        <h4 className="font-semibold text-white text-sm sm:text-base flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>{service.title}</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light">{service.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="font-bold text-sm text-white">Deseja simular os resultados para o seu negócio?</p>
                    <p className="text-xs text-white/50 font-light">Desenvolvi um modelo analítico baseado em médias históricas locais.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("roi")}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-xs font-semibold hover:bg-amber-500/20 hover:text-white transition-all flex items-center justify-center space-x-2 shrink-0 uppercase tracking-widest"
                  >
                    <span>Abrir Simulador</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* NICHE FOCUS SECTION (COMO TRANSFORMAR CADA SETOR) */}
            <div className="border-t border-white/5 pt-12 space-y-8">
              <div className="text-center space-y-2">
                <span className="pill">Foco Setorial</span>
                <h3 className="serif text-3xl font-light text-white tracking-tight">Soluções Adaptadas para o Seu Mercado</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Auto Stand */}
                <div className="glass p-6 rounded-xl space-y-4">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center font-bold text-sm">
                    🚗
                  </div>
                  <h4 className="serif font-light text-xl text-white">Stands de Viaturas</h4>
                  <p className="text-xs leading-relaxed text-white/55 font-light">
                    O maior gargalo dos stands em Maputo e Matola é manter capital imobilizado. Estruturamos anúncios com foto e vídeo premium de veículos específicos, segmentando por pessoas com interesses corporativos e de alta renda, acelerando a rotação de stock.
                  </p>
                  <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Foco: Liquidez e rotação de viaturas.</p>
                </div>

                {/* Imobiliária */}
                <div className="glass p-6 rounded-xl space-y-4">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center font-bold text-sm">
                    🏢
                  </div>
                  <h4 className="serif font-light text-xl text-white">Imobiliárias & Corretores</h4>
                  <p className="text-xs leading-relaxed text-white/55 font-light">
                    Venda e aluguer de imóveis residenciais de alto padrão exigem filtros geográficos estritos. Criamos formulários de qualificação integrados nas redes para filtrar curiosos e entregar leads prontos com orçamento e contacto real.
                  </p>
                  <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Foco: Leads qualificadas prontas para visita.</p>
                </div>

                {/* Clinicas / Saude */}
                <div className="glass p-6 rounded-xl space-y-4">
                  <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center font-bold text-sm">
                    🦷
                  </div>
                  <h4 className="serif font-light text-xl text-white">Clínicas e Saúde</h4>
                  <p className="text-xs leading-relaxed text-white/55 font-light">
                    Captação de pacientes para procedimentos eletivos ou particulares. Criamos campanhas informativas e humanizadas com segmentação por proximidade geográfica (perímetro útil), optimizando o fluxo de chamadas direccionadas de agendamentos.
                  </p>
                  <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Foco: Pacientes recorrentes e preenchimento de agenda.</p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ROI SIMULATOR */}
        {activeTab === "roi" && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Header Content */}
            <div className="space-y-3">
              <div>
                <span className="pill">Simulador de Conversão</span>
              </div>
              <h2 className="serif text-4xl font-light text-white tracking-tight">
                Simule o seu retorno sobre anúncios (<span className="accent-text italic">ROI</span>)
              </h2>
              <p className="text-white/60 text-sm max-w-2xl font-light leading-relaxed">
                Abaixo, projete o impacto de campanhas estruturadas em Moçambique. Ajuste o orçamento mensal estimado e taxas comerciais de conversão para analisar as previsões de faturação.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Parameters Form */}
              <div className="lg:col-span-5 glass p-6 rounded-2xl space-y-6">
                <div>
                  <h3 className="serif text-lg font-light text-white tracking-wide">Configurar Campanhas</h3>
                  <p className="text-xs text-white/40 font-light mt-1">Defina estimativas para o seu funil operacional</p>
                </div>

                <div className="space-y-5">
                  {/* Select Niche */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block">Nicho de Atuação</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(NICHES).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => setRoiNiche(key as NicheKey)}
                          className={`px-3 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                            roiNiche === key
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                              : "bg-white/5 border-white/5 text-white/50 hover:text-white hover:border-white/25"
                          }`}
                        >
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Budget MT */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white/70 uppercase tracking-wider">Orçamento de Mídia (MT)</span>
                      <span className="font-mono text-amber-500 font-bold bg-[#0F0F0F] border border-white/10 px-2.5 py-1 rounded">
                        {formatMT(roiBudget)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3000"
                      max="150000"
                      step="1000"
                      value={roiBudget}
                      onChange={(e) => setRoiBudget(Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-white/40 font-mono">
                      <span>3.000 MT</span>
                      <span>50.000 MT</span>
                      <span>150.000 MT</span>
                    </div>
                  </div>

                  {/* Ticket Medio MT */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-white/70 uppercase tracking-wider">Preço Médio do Produto / Ticket (MT)</span>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-white/40 font-mono text-xs">MT</span>
                      <input
                        type="number"
                        value={roiTicket}
                        onChange={(e) => setRoiTicket(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 focus:border-amber-500/40 focus:ring-0 rounded-lg pl-12 pr-4 py-2.5 text-sm font-semibold font-mono text-white transition-colors"
                      />
                    </div>
                    <p className="text-[10px] text-white/40 italic font-light">Preço médio de venda do seu carro, serviço ou produto.</p>
                  </div>

                  {/* Advanced settings toggles (CPC, Click to WA, Close Rate) */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="text-xs font-semibold text-white/70 uppercase tracking-wider">Custos & Conversões de Referência</div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* ESTIMATED CPC */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/55 uppercase tracking-wide block">CPC Est. (MT)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={roiCPC}
                          onChange={(e) => setRoiCPC(Math.max(0.5, Number(e.target.value)))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono font-bold text-white focus:border-amber-500/40"
                        />
                        <span className="text-[9px] text-white/40 font-light block mt-0.5">Custo p/ Clique</span>
                      </div>

                      {/* CLICK TO WHATSAPP RATE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/55 uppercase tracking-wide block">Chat no WA %</label>
                        <input
                          type="number"
                          value={roiClickToWa}
                          onChange={(e) => setRoiClickToWa(Math.max(1, Math.min(100, Number(e.target.value))))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono font-bold text-amber-500 focus:border-amber-500/40"
                        />
                        <span className="text-[9px] text-white/40 font-light block mt-0.5">Média envio Msg</span>
                      </div>

                      {/* CONVERSION CLOSING RATE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-white/55 uppercase tracking-wide block">Fecho Vendas %</label>
                        <input
                          type="number"
                          value={roiCloseRate}
                          onChange={(e) => setRoiCloseRate(Math.max(0.1, Math.min(100, Number(e.target.value))))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs font-mono font-bold text-amber-500 focus:border-amber-500/40"
                        />
                        <span className="text-[9px] text-white/40 font-light block mt-0.5">Fecho Comercial</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Side: Projections and ROI Calculations */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                
                {/* Visual Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Total Clicks */}
                  <div className="glass p-5 rounded-xl relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <Users className="w-5 h-5 opacity-20 text-amber-500" />
                    </div>
                    <span className="text-xs text-white/50 font-light uppercase tracking-wider block">Cliques Estimados</span>
                    <p className="text-2xl font-light font-mono mt-1 text-white">{calculatedClicks}</p>
                    <p className="text-[10px] text-white/40 mt-1 font-light">Para orçamento de {formatMT(roiBudget)}</p>
                  </div>

                  {/* WhatsApp Leads */}
                  <div className="glass p-5 rounded-xl relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <Send className="w-5 h-5 opacity-20 text-amber-500" />
                    </div>
                    <span className="text-xs text-white/50 font-light uppercase tracking-wider block">Est. Chats Iniciados</span>
                    <p className="text-2xl font-light font-mono mt-1 text-amber-500">{calculatedWaContacts}</p>
                    <p className="text-[10px] text-white/40 mt-1 font-light">{roiClickToWa}% de taxa de conversão</p>
                  </div>

                  {/* Expected Sales */}
                  <div className="glass p-5 rounded-xl relative overflow-hidden sm:col-span-2 md:col-span-1">
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 opacity-20 text-amber-500" />
                    </div>
                    <span className="text-xs text-white/50 font-light uppercase tracking-wider block">Vendas Esperadas</span>
                    <p className="text-2xl font-light font-mono mt-1 text-white">{calculatedSales}</p>
                    <p className="text-[10px] text-white/40 mt-1 font-light">{roiCloseRate}% de eficácia de vendas</p>
                  </div>
                </div>

                {/* Main Return Dashboard Panel */}
                <div className="glass bg-gradient-to-br from-white/[0.03] to-transparent p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-4 text-center md:text-left w-full md:w-auto">
                    <div>
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
                        Projeção Financeira Mensal
                      </span>
                      <h4 className="serif text-2xl font-light text-white tracking-wide">Previsão Analítica de Retorno</h4>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-white/40 font-light mb-1">Receita Mensal Estimada:</div>
                      <div className="text-3xl font-light font-mono tracking-tight text-white">
                        {formatMT(calculatedRevenue)}
                      </div>
                    </div>

                    <div className="text-xs text-white/60 font-light">
                      Retorno Líquido após anúncios: <span className={`font-semibold ${netProfit >= 0 ? "text-amber-500" : "text-rose-500"}`}>{formatMT(netProfit)}</span>
                    </div>
                  </div>

                  {/* ROI Indicator circle style badge */}
                  <div className="bg-[#050505]/40 border border-white/10 px-6 py-6 rounded-xl flex flex-col items-center justify-center text-center min-w-[200px] shadow-lg backdrop-blur">
                    <span className="text-[9px] text-white/50 uppercase tracking-widest block mb-1">Indicador ROI</span>
                    <div className="text-4xl font-light font-mono text-amber-500">
                      {roiRatio}x
                    </div>
                    <span className="text-[10px] text-amber-500 mt-1 font-semibold tracking-wider uppercase">
                      +{roiPercentage}% Líquido
                    </span>
                  </div>

                </div>

                {/* Edmilson's Strategic Assessment block */}
                <div className="glass p-6 rounded-xl space-y-3 shadow-xl">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-white flex items-center space-x-2">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Análise Técnico Estratégica</span>
                  </h4>
                  <p className="text-xs text-white/70 leading-relaxed font-light italic">
                    {roiNiche === "autos" && `Para stands de carros, a aquisição é ponderada. Com recursos de ${formatMT(roiBudget)}, direccionamos os anúncios para focar em viaturas chave com boa margem de revenda disponíveis em Maputo e Beira. Focaremos integralmente no direccionamento dos leads para o envio do catálogo de viaturas e chamadas de agendamentos no seu WhatsApp.`}
                    {roiNiche === "imoveis" && `No imobiliário, focamos em filtragem. Com a quota mensal ajustada em ${formatMT(roiBudget)}, usaremos canais de formulários e direccionamentos de contactos com campos de validação de orçamento estimado, removendo leads desqualificados e curiosos antes da ligação do seu corretor.`}
                    {roiNiche === "clinicas" && `Clínicas exigem conversão de proximidade (raio de 5 a 10km). Com conversão estimada de ${roiClickToWa}%, sugerimos resposta instantânea em no máximo 5 minutos no WhatsApp para evitar perda de interesse do paciente.`}
                    {roiNiche === "restaurantes" && `Alimentação e restauração necessitam de ativação imediatista perto dos turnos principais. Lançamos anúncios com geolocalização exígua direccionando pedidos de take-away diretamente para o fluxo de atendimento da sua equipa de entregas.`}
                    {roiNiche === "servicos" && `Para empresas de prestação de serviços ou B2B, valorizamos a autoridade de marca. Criamos anúncios estruturados exibindo o seu portfolio anterior ou estudos de caso de sucesso locais, facilitando o primeiro contacto comercial.`}
                    {roiNiche === "geral" && `Para negócios de retalho e marcas gerais, optimizamos carrosséis focados em ofertas de stock frequentado. O público é atraído para o WhatsApp catalisando vendas rápidas.`}
                  </p>
                  <div className="text-[10px] text-white/30 font-light pt-1">
                    *Nota: Esta estimativa é orientada em histórico técnico geral. Resultados reais dependem de flutuações de leilão, competitividade de mercado e precisão comercial da sua equipa no WhatsApp.
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2 text-center">
                  <a 
                    href={`https://wa.me/258855545045?text=Olá%20Edmilson,%20estive%20a%20usar%20o%20teu%20Simulador%20de%20ROI%20para%20o%20meu%20negócio%20do%20ramo%20de%20${NICHES[roiNiche].label}.%20Fiz%20uma%20simulação%20com%20orçamento%20de%20${roiBudget}%20MT%20e%20gostaria%20de%20saber%20uma%20estratégia%20real%20para%20isso.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-transparent border border-white/20 text-white hover:border-amber-500 hover:text-amber-500 py-3 rounded-lg text-xs uppercase tracking-widest transition-all hover:bg-amber-500/5 flex        {/* TAB 3: PROPOSALS CRÉATE (EDMILSON'S WORKSPACE) */}
        {activeTab === "workspace" && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Title Info */}
            <div className="space-y-3">
              <div>
                <span className="pill">Espaço de Trabalho</span>
              </div>
              <h2 className="serif text-4xl font-light text-white tracking-tight">Gerador de Propostas e Abordagens</h2>
              <p className="text-white/60 text-sm max-w-2xl font-light leading-relaxed">
                Elabore pitches comerciais e propostas estruturadas em minutos. Insira as variáveis do seu lead em Moçambique e crie abordagens personalizadas prontas para converter.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Generator input form */}
              <div className="lg:col-span-5 glass p-6 rounded-2xl space-y-5">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <h3 className="serif text-lg font-light text-white">Dados do Prospecto</h3>
                  <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-semibold">Lead Builder</span>
                </div>

                <div className="space-y-4">
                  {/* Prospect Client Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider block">Nome do Responsável / Decisor</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex: Sr. Jaime ou Dona Fátima"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/40 focus:ring-0 rounded-lg p-2.5 text-sm text-white transition-colors"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider block">Nome Comercial / Empresa</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Ex: Matola Motors ou Clínica Dentária Sorri"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/40 focus:ring-0 rounded-lg p-2.5 text-sm text-white transition-colors"
                    />
                  </div>

                  {/* Nicho Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider block">Segmento Operacional</label>
                    <select
                      value={propNiche}
                      onChange={(e) => {
                        setPropNiche(e.target.value as NicheKey);
                        setSpecificDetail(""); 
                      }}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/40 focus:ring-0 rounded-lg p-2.5 text-sm text-white transition-colors appearance-none"
                    >
                      {Object.entries(NICHES).map(([key, item]) => (
                        <option key={key} value={key} className="bg-[#0A0A0A] text-white">
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Specific Detail Offer */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider block">Foco da Oferta (Especificidade)</label>
                    <input
                      type="text"
                      value={specificDetail}
                      onChange={(e) => setSpecificDetail(e.target.value)}
                      placeholder={NICHES[propNiche].placeholderText}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/40 focus:ring-0 rounded-lg p-2.5 text-sm text-white transition-colors"
                    />
                  </div>

                  {/* Target City */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider block">Localização / Província</label>
                    <input
                      type="text"
                      value={propCity}
                      onChange={(e) => setPropCity(e.target.value)}
                      placeholder="Ex: Maputo, Matola, Beira, Nampula"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500/40 focus:ring-0 rounded-lg p-2.5 text-sm text-white transition-colors"
                    />
                  </div>

                  {/* Proposed Edmilson Management Fee */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider block">Honorários Mensais (MT)</label>
                      <input
                        type="number"
                        value={propFee}
                        onChange={(e) => setPropFee(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 focus:border-amber-500/40 focus:ring-0 rounded-lg p-2.5 text-sm font-mono font-bold text-amber-500 transition-colors"
                      />
                    </div>

                    {/* Proposed Client daily traffic budget */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider block">Tráfego Diário (MT/Dia)</label>
                      <input
                        type="number"
                        value={propBudget}
                        onChange={(e) => setPropBudget(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 focus:border-amber-500/40 focus:ring-0 rounded-lg p-2.5 text-sm font-mono font-bold text-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 space-y-2">
                    <button
                      onClick={handleSaveProposal}
                      className="w-full bg-white hover:bg-white/95 text-black py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4 text-black stroke-[3]" />
                      <span>Guardar Localmente</span>
                    </button>
                    {saveSuccess && (
                      <p className="text-xs text-amber-500 text-center font-bold animate-pulse">
                        ✓ Guardado com sucesso! Veja na aba "Propostas Salvas".
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* Generator View Output Section */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. SCRIPT FOR COPY PASTE */}
                <div className="glass p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4 text-amber-500" />
                      <h4 className="serif font-light text-base text-white tracking-wide">1. Script de Abordagem Direta (WhatsApp)</h4>
                    </div>
                    <button
                      onClick={() => triggerCopy(getPitchScript(), "script")}
                      className="p-1.5 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors flex items-center space-x-1.5 text-[10px] font-semibold uppercase tracking-wider"
                    >
                      {copiedSection === "script" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-amber-500 font-mono">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-[#050505]/60 border border-white/10 p-4 rounded-xl relative font-mono text-xs text-white/80 whitespace-pre-wrap max-h-[220px] overflow-y-auto leading-relaxed">
                    {getPitchScript()}
                  </div>
                  <div className="text-[10px] text-white/50 flex items-center space-x-1.5 bg-[#050505]/40 p-3 rounded-lg border border-white/5 leading-relaxed font-light">
                    <span>💡 <strong>Estratégia:</strong> Localize marcas e perfis no Instagram local que possuem ativos premium mas sem tráfego pago ativo. Utilize este script refinado para catalisar conversas eficazes.</span>
                  </div>
                </div>

                {/* 2. PROPOSAL VIEW */}
                <div className="glass p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-amber-500" />
                      <h4 className="serif font-light text-base text-white tracking-wide">2. Proposta Comercial Sintética</h4>
                    </div>
                    <button
                      onClick={() => triggerCopy(getProposalText(), "prop")}
                      className="p-1.5 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors flex items-center space-x-1.5 text-[10px] font-semibold uppercase tracking-wider"
                    >
                      {copiedSection === "prop" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-amber-500 font-mono">Copiada!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Proposta</span>
                        </>
                      )}
                    </button>
                  </div>

                       {/* TAB 4: SAVED PROPOSALS LIST */}
        {activeTab === "propostas" && (
          <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <div>
                  <span className="pill">Histórico Operacional</span>
                </div>
                <h2 className="serif text-4xl font-light text-white tracking-tight">Propostas Comerciais</h2>
                <p className="text-white/60 text-sm max-w-xl font-light">
                  Acompanhe e controle o status das suas prospecções offline. Atualize os estados de fecho para monitorizar a sua conversão.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("workspace")}
                className="bg-transparent border border-white/20 text-white hover:border-amber-500 hover:text-amber-500 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 transition-all hover:bg-amber-500/5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Nova Proposta</span>
              </button>
            </div>

            {savedProposals.length === 0 ? (
              /* Empty State */
              <div className="glass p-12 text-center rounded-2xl space-y-4 max-w-lg mx-auto shadow-2xl">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/55 text-lg">
                  📄
                </div>
                <div className="space-y-1">
                  <h4 className="serif text-lg font-light text-white">Nenhum registo encontrado</h4>
                  <p className="text-xs text-white/40 font-light">
                    As propostas guardadas no seu espaço de trabalho serão arquivadas localmente nesta aba para manter o controlo da sua carteira.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("workspace")}
                  className="px-5 py-2.5 bg-white hover:bg-white/95 text-black rounded-lg text-xs font-semibold uppercase tracking-wider transition-all mx-auto"
                >
                  Criar Primeiro Rascunho
                </button>
              </div>
            ) : (
              /* Table or Grid List of Proposals */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedProposals.map((proposal) => (
                  <div key={proposal.id} className="glass p-6 rounded-2xl relative space-y-4 shadow-xl">
                    
                    {/* Header values */}
                    <div className="flex justify-between items-start pb-2 border-b border-white/5">
                      <div>
                        <span className="text-[9px] uppercase font-semibold text-amber-500 tracking-widest font-mono">
                          {proposal.niche}
                        </span>
                        <h4 className="serif font-light text-lg text-white mt-1">{proposal.businessName}</h4>
                        <p className="text-xs text-white/45 font-light">Contacto: {proposal.clientName}</p>
                      </div>
 
                      {/* Status select badge */}
                      <div className="flex items-center space-x-1">
                        <select
                          value={proposal.status}
                          onChange={(e) => handleUpdateStatus(proposal.id, e.target.value as SavedProposal["status"])}
                          className={`text-[10px] font-bold rounded px-2 py-1 border transition-colors cursor-pointer focus:outline-none ${
                            proposal.status === "Fechado"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                              : proposal.status === "Recusado"
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                              : "bg-white/10 text-white/70 border-white/20"
                          }`}
                        >
                          <option value="Pendente" className="bg-[#0A0A0A] text-white">Pendente</option>
                          <option value="Fechado" className="bg-[#0A0A0A] text-amber-500 font-bold">Fechado ✓</option>
                          <option value="Recusado" className="bg-[#0A0A0A] text-rose-505">Recusado ✗</option>
                        </select>
                      </div>
                    </div>

                    {/* Specific details */}
                    <div className="bg-[#050505]/40 p-4 rounded-xl border border-white/5 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Província Sede:</span>
                        <span className="text-white">{proposal.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Procedimento Foco:</span>
                        <span className="text-white truncate max-w-[150px]">{proposal.specificDetail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Plano de Anúncios:</span>
                        <span className="text-white font-bold">{formatMT(proposal.adBudget)} / mês</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#888888]">Seus Honorários:</span>
                        <span className="text-amber-500 font-bold">{formatMT(proposal.proposedFee)} / mês</span>
                      </div>
                    </div>

                    {/* Bottom buttons */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <span className="text-[9px] text-[#666666] font-mono uppercase tracking-wide">
                        {proposal.date}
                      </span>

                      <div className="flex items-center space-x-2">
                        {/* Copy proposal body */}
                        <button
                          onClick={() => {
                            const val = `PROPOSTA DE GESTÃO DE TRÁFEGO\n` +
                              `-----------------------------------\n` +
                              `Cliente: ${proposal.clientName}\n` +
                              `Negócio: ${proposal.businessName}\n` +
                              `Nicho: ${proposal.niche}\n` +
                              `Cidade Alvo: ${proposal.city}\n` +
                              `Foco: ${proposal.specificDetail}\n\n` +
                              `Investimento Ad Budget: ${formatMT(proposal.adBudget)}/mês\n` +
                              `Honorários Sugeridos: ${formatMT(proposal.proposedFee)}/mês\n` +
                              `-----------------------------------\n` +
                              `Criador por: Edmilson\n` +
                              `Telefone: +258 855 545 045\n` +
                              `Email: edmilson12offline@gmail.com`;
                            triggerCopy(val, `card-${proposal.id}`);
                          }}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded text-[10px] font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-all"
                        >
                          {copiedSection === `card-${proposal.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-amber-500" />
                              <span className="text-amber-500 font-mono">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar Dados</span>
                            </>
                          )}
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteProposal(proposal.id)}
                          className="p-1.5 bg-white/5 hover:bg-rose-500/10 text-white/40 hover:text-rose-500 border border-white/10 hover:border-rose-500/20 rounded transition-all"
                          title="Apagar proposta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* FIXED FOOTER */}
      <footer className="border-t border-white/5 bg-[#050505] py-14 mt-16 text-white/50 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="flex justify-center items-center space-x-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.25em]">
            <button onClick={() => setActiveTab("bio")} className="hover:text-amber-500 transition-colors">Apresentação</button>
            <span>•</span>
            <button onClick={() => setActiveTab("roi")} className="hover:text-amber-500 transition-colors">Simulador de ROI</button>
            <span>•</span>
            <button onClick={() => setActiveTab("workspace")} className="hover:text-amber-500 transition-colors">Espaço de Trabalho</button>
          </div>
          <p className="text-xs text-white/30 max-w-md mx-auto font-light leading-relaxed">
            © 2026 Edmilson — Gestão de Tráfego Pago e Atração de Clientes em Moçambique. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
