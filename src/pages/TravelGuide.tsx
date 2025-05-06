import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Star, 
  Navigation2, 
  Globe2, 
  Info, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  Heart, 
  Plane, 
  MessageSquare 
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

// Types
interface CountryData {
  name: string;
  flag: string;
  alerts: {
    title: string;
    description: string;
    level?: 'info' | 'warning' | 'danger';
  }[];
  emergencyNumbers: {
    service: string;
    number: string;
  }[];
  embassy: {
    address: string;
    phone: string;
    website: string;
  };
  consultationProcess: string[];
  healthInfo: {
    beforeTravel: string[];
    risks: string[];
    rules: string[];
  };
  travelTips: {
    title: string;
    description: string;
  }[];
  localPhrases: {
    local: string;
    translation: string;
    category: 'medical' | 'emergency' | 'general';
  }[];
  insuranceInfo?: {
    recommended: boolean;
    description: string;
  };
}

// Popular destinations
const popularDestinations = [
  { name: 'Espagne', flag: '🇪🇸' },
  { name: 'Italie', flag: '🇮🇹' },
  { name: 'Royaume-Uni', flag: '🇬🇧' },
  { name: 'États-Unis', flag: '🇺🇸' },
  { name: 'Japon', flag: '🇯🇵' },
  { name: 'Thaïlande', flag: '🇹🇭' },
  { name: 'Australie', flag: '🇦🇺' },
  { name: 'Maroc', flag: '🇲🇦' }
];

// Mock data for Spain
const mockCountryData: CountryData = {
  name: "Espagne",
  flag: "🇪🇸",
  alerts: [
    {
      title: "Sécurité Nationale",
      description: "Le gouvernement espagnol a relevé la posture du plan Vigipirate au niveau Urgence attentat, nécessitant une vigilance renforcée pour les ressortissants français résidant ou de passage à l'étranger.",
      level: "warning"
    },
    {
      title: "Menace Terroriste",
      description: "Le ministère de l'Intérieur espagnol évalue la menace terroriste comme élevée. Une vigilance accrue est recommandée dans les lieux très fréquentés.",
      level: "warning"
    },
    {
      title: "Conditions météorologiques",
      description: "Fortes chaleurs attendues dans le sud de l'Espagne pendant les mois d'été. Restez hydraté et évitez l'exposition prolongée au soleil.",
      level: "info"
    }
  ],
  emergencyNumbers: [
    { service: "Urgences", number: "112" },
    { service: "Police", number: "091" },
    { service: "Pompiers", number: "080" },
    { service: "Samu", number: "061" }
  ],
  embassy: {
    address: "Calle de Salustiano Olózaga 9, 28001, Recoletos, Madrid, Comunidad de Madrid, ESP",
    phone: "+34914238900",
    website: "https://es.ambafrance.org/"
  },
  consultationProcess: [
    "À l'Arrivée : Il est courant d'avoir à présenter une pièce d'identité et votre carte de santé (publique ou privée) à la réception. Ensuite, vous attendrez dans la salle d'attente jusqu'à ce que le médecin vous appelle.",
    "Pendant la Consultation : Le médecin parlera généralement espagnol, mais de nombreux praticiens parlent aussi anglais ou français.",
    "Après la Consultation : Une ordonnance vous sera remise si nécessaire, à présenter dans n'importe quelle pharmacie."
  ],
  healthInfo: {
    beforeTravel: [
      "Vérifier la validité de votre carte européenne d'assurance maladie",
      "Mettre à jour vos vaccinations classiques",
      "Souscrire une assurance voyage couvrant les frais médicaux",
      "Préparer une trousse de premiers secours"
    ],
    risks: [
      "Exposition prolongée au soleil en été",
      "Déshydratation dans les régions chaudes",
      "Risques liés aux activités nautiques",
      "Présence de moustiques dans certaines régions"
    ],
    rules: [
      "Ne pas approcher les animaux errants et les chiens (risque de morsure et de rage)",
      "Veiller à sa sécurité routière (port de la ceinture de sécurité, port du casque en deux roues)",
      "Boire suffisamment d'eau en période de chaleur",
      "Se protéger du soleil avec une crème solaire adaptée"
    ]
  },
  travelTips: [
    {
      title: "Horaires des repas",
      description: "Les Espagnols mangent généralement plus tard que les Français : déjeuner vers 14h et dîner après 21h."
    },
    {
      title: "Sieste",
      description: "De nombreux commerces ferment entre 14h et 17h pour la sieste, surtout dans les petites villes."
    },
    {
      title: "Pourboires",
      description: "Le pourboire n'est pas obligatoire mais apprécié, généralement 5-10% dans les restaurants."
    },
    {
      title: "Transports",
      description: "Le réseau de trains à grande vitesse (AVE) est excellent pour voyager entre les grandes villes."
    }
  ],
  localPhrases: [
    {
      local: "Necesito un médico",
      translation: "J'ai besoin d'un médecin",
      category: "medical"
    },
    {
      local: "Me duele aquí",
      translation: "J'ai mal ici",
      category: "medical"
    },
    {
      local: "Soy alérgico/a a...",
      translation: "Je suis allergique à...",
      category: "medical"
    },
    {
      local: "¡Ayuda!",
      translation: "À l'aide !",
      category: "emergency"
    },
    {
      local: "¿Dónde está el hospital más cercano?",
      translation: "Où est l'hôpital le plus proche ?",
      category: "emergency"
    },
    {
      local: "Buenos días",
      translation: "Bonjour",
      category: "general"
    }
  ],
  insuranceInfo: {
    recommended: true,
    description: "Bien que la Carte Européenne d'Assurance Maladie couvre les soins de base, une assurance voyage complémentaire est recommandée pour couvrir les rapatriements et les frais médicaux plus importants."
  }
};

export default function TravelGuide() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['alerts', 'emergency']);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(mockCountryData);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState(popularDestinations);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionExpanded = (sectionId: string) => {
    return expandedSections.includes(sectionId);
  };

  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      setIsSearching(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Here you would typically use a geocoding service
          // For now, we'll just simulate finding Spain based on location
          setIsSearching(false);
          setSelectedCountry(mockCountryData);
          setShowSearchResults(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsSearching(false);
        }
      );
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.length > 0) {
      setShowSearchResults(true);
      // Filter popular destinations based on query
      const filtered = popularDestinations.filter(
        dest => dest.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.length > 0 ? filtered : popularDestinations);
    } else {
      setShowSearchResults(false);
    }
  };

  const handleCountrySelect = (country: string) => {
    setIsLoading(true);
    // Simulate API call to get country data
    setTimeout(() => {
      setSelectedCountry(mockCountryData);
      setShowSearchResults(false);
      setSearchQuery('');
      setIsLoading(false);
    }, 500);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100/70 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#424e6f]" />
          </button>
          <h1 className="text-xl font-semibold text-mybakup-blue">
            Ma destination
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Rechercher une ville ou un pays"
              className="w-full h-12 pl-10 pr-24 bg-white border border-gray-200 rounded-xl text-[#424e6f] focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={handleGetLocation}
                disabled={isSearching}
                className={`p-2 rounded-full ${
                  isSearching 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors'
                }`}
                title="Utiliser ma position"
              >
                <MapPin className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowSearchResults(!showSearchResults)}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <Navigation2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Results */}
          {showSearchResults && (
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-500 px-3 py-2">Destinations populaires</h3>
                <div className="grid grid-cols-2 gap-2">
                  {searchResults.map((destination) => (
                    <button
                      key={destination.name}
                      onClick={() => handleCountrySelect(destination.name)}
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl">{destination.flag}</span>
                      <span className="text-mybakup-blue">{destination.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mybakup-coral"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Country Header */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex items-center justify-center gap-3"
            >
              <span className="text-4xl">{selectedCountry.flag}</span>
              <h2 className="text-2xl font-semibold text-[#424e6f]">
                {selectedCountry.name}
              </h2>
            </motion.div>

            {/* Insurance Info */}
            {selectedCountry.insuranceInfo && (
              <motion.section
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#EDF5FF] text-mybakup-blue">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-mybakup-blue mb-2">Assurance voyage</h3>
                    <p className="text-gray-600 mb-3">{selectedCountry.insuranceInfo.description}</p>
                    <button
                      onClick={() => navigate('/insurance', { state: { destination: selectedCountry.name } })}
                      className="flex items-center gap-2 text-mybakup-coral hover:underline"
                    >
                      <span>Souscrire une assurance voyage</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Alerts */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <div 
                className="flex items-center justify-between bg-white rounded-t-xl p-4 cursor-pointer border border-gray-100 shadow-sm"
                onClick={() => toggleSection('alerts')}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-mybakup-coral" />
                  <h3 className="font-semibold text-mybakup-blue">Actualités & Alertes</h3>
                </div>
                {isSectionExpanded('alerts') ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {isSectionExpanded('alerts') && (
                <div className="bg-white rounded-b-xl p-4 border-t-0 border border-gray-100 shadow-sm space-y-4">
                  {selectedCountry.alerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg ${
                        alert.level === 'danger' ? 'bg-red-50 border border-red-100' :
                        alert.level === 'warning' ? 'bg-amber-50 border border-amber-100' :
                        'bg-blue-50 border border-blue-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${
                          alert.level === 'danger' ? 'text-red-500' :
                          alert.level === 'warning' ? 'text-amber-500' :
                          'text-blue-500'
                        }`}>
                          {alert.level === 'danger' ? (
                            <AlertCircle className="w-5 h-5" />
                          ) : alert.level === 'warning' ? (
                            <AlertCircle className="w-5 h-5" />
                          ) : (
                            <Info className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            alert.level === 'danger' ? 'text-red-700' :
                            alert.level === 'warning' ? 'text-amber-700' :
                            'text-blue-700'
                          }`}>
                            {alert.title}
                          </h4>
                          <p className={`mt-1 text-sm ${
                            alert.level === 'danger' ? 'text-red-600' :
                            alert.level === 'warning' ? 'text-amber-600' :
                            'text-blue-600'
                          }`}>
                            {alert.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Emergency Numbers */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
            >
              <div 
                className="flex items-center justify-between bg-white rounded-t-xl p-4 cursor-pointer border border-gray-100 shadow-sm"
                onClick={() => toggleSection('emergency')}
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-mybakup-coral" />
                  <h3 className="font-semibold text-mybakup-blue">Numéros d'urgence</h3>
                </div>
                {isSectionExpanded('emergency') ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {isSectionExpanded('emergency') && (
                <div className="bg-white rounded-b-xl p-4 border-t-0 border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCountry.emergencyNumbers.map((emergency, index) => (
                      <a
                        key={index}
                        href={`tel:${emergency.number}`}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-700 font-medium">{emergency.service}</span>
                        <span className="text-mybakup-coral font-bold">{emergency.number}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>

            {/* Embassy Info */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <div 
                className="flex items-center justify-between bg-white rounded-t-xl p-4 cursor-pointer border border-gray-100 shadow-sm"
                onClick={() => toggleSection('embassy')}
              >
                <div className="flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-mybakup-coral" />
                  <h3 className="font-semibold text-mybakup-blue">Représentation française</h3>
                </div>
                {isSectionExpanded('embassy') ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {isSectionExpanded('embassy') && (
                <div className="bg-white rounded-b-xl p-4 border-t-0 border border-gray-100 shadow-sm space-y-3">
                  <h4 className="font-medium text-mybakup-blue">Ambassade</h4>
                  <p className="text-gray-600">{selectedCountry.embassy.address}</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a 
                      href={`tel:${selectedCountry.embassy.phone}`}
                      className="text-mybakup-coral hover:underline"
                    >
                      {selectedCountry.embassy.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-gray-400" />
                    <a 
                      href={selectedCountry.embassy.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mybakup-blue hover:underline"
                    >
                      Site web officiel
                    </a>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Consultation Process */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.5 }}
            >
              <div 
                className="flex items-center justify-between bg-white rounded-t-xl p-4 cursor-pointer border border-gray-100 shadow-sm"
                onClick={() => toggleSection('consultation')}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-mybakup-coral" />
                  <h3 className="font-semibold text-mybakup-blue">Déroulement d'une consultation</h3>
                </div>
                {isSectionExpanded('consultation') ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {isSectionExpanded('consultation') && (
                <div className="bg-white rounded-b-xl p-4 border-t-0 border border-gray-100 shadow-sm space-y-4">
                  {selectedCountry.consultationProcess.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-mybakup-coral/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-mybakup-coral font-medium text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-600">{step}</p>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-700 font-medium">Conseil MyBakup</p>
                      <p className="text-sm text-blue-600 mt-1">
                        Utilisez notre service de traduction médicale pour communiquer efficacement avec les médecins locaux.
                      </p>
                      <button
                        onClick={() => navigate('/medical-translator')}
                        className="mt-2 text-sm text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <span>Accéder au traducteur médical</span>
                        <ArrowLeft className="w-3 h-3 rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Local Phrases */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <div 
                className="flex items-center justify-between bg-white rounded-t-xl p-4 cursor-pointer border border-gray-100 shadow-sm"
                onClick={() => toggleSection('phrases')}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-mybakup-coral" />
                  <h3 className="font-semibold text-mybakup-blue">Phrases utiles</h3>
                </div>
                {isSectionExpanded('phrases') ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {isSectionExpanded('phrases') && (
                <div className="bg-white rounded-b-xl p-4 border-t-0 border border-gray-100 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-mybakup-blue mb-2">Urgences médicales</h4>
                      <div className="space-y-2">
                        {selectedCountry.localPhrases
                          .filter(phrase => phrase.category === 'medical' || phrase.category === 'emergency')
                          .map((phrase, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium text-mybakup-blue">{phrase.local}</p>
                              <p className="text-sm text-gray-600 mt-1">{phrase.translation}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-mybakup-blue mb-2">Expressions courantes</h4>
                      <div className="space-y-2">
                        {selectedCountry.localPhrases
                          .filter(phrase => phrase.category === 'general')
                          .map((phrase, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-medium text-mybakup-blue">{phrase.local}</p>
                              <p className="text-sm text-gray-600 mt-1">{phrase.translation}</p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Health Information */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.7 }}
            >
              <div 
                className="flex items-center justify-between bg-white rounded-t-xl p-4 cursor-pointer border border-gray-100 shadow-sm"
                onClick={() => toggleSection('health')}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-mybakup-coral" />
                  <h3 className="font-semibold text-mybakup-blue">Informations sanitaires</h3>
                </div>
                {isSectionExpanded('health') ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {isSectionExpanded('health') && (
                <div className="bg-white rounded-b-xl p-4 border-t-0 border border-gray-100 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-medium text-mybakup-blue mb-2">AVANT LE DÉPART</h4>
                    <ul className="space-y-2">
                      {selectedCountry.healthInfo.beforeTravel.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-mybakup-coral rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-mybakup-blue mb-2">RISQUES SANITAIRES</h4>
                    <ul className="space-y-2">
                      {selectedCountry.healthInfo.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-mybakup-coral rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-mybakup-blue mb-2">QUELQUES RÈGLES SIMPLES</h4>
                    <ul className="space-y-2">
                      {selectedCountry.healthInfo.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-mybakup-coral rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.section>

            {/* Travel Tips */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.8 }}
            >
              <div 
                className="flex items-center justify-between bg-white rounded-t-xl p-4 cursor-pointer border border-gray-100 shadow-sm"
                onClick={() => toggleSection('tips')}
              >
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-mybakup-coral" />
                  <h3 className="font-semibold text-mybakup-blue">Conseils de voyage</h3>
                </div>
                {isSectionExpanded('tips') ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {isSectionExpanded('tips') && (
                <div className="bg-white rounded-b-xl p-4 border-t-0 border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCountry.travelTips.map((tip, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-mybakup-blue">{tip.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>

            {/* CTA Section */}
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-r from-mybakup-blue to-purple-600 rounded-xl p-6 text-white shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-3">Besoin d'assistance ?</h3>
              <p className="mb-4">
                Nos conseillers sont disponibles 24/7 pour vous aider pendant votre séjour en {selectedCountry.name}.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/chat-advisor')}
                  className="px-4 py-2 bg-white text-mybakup-blue rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Contacter un conseiller</span>
                </button>
                <button
                  onClick={() => navigate('/insurance', { state: { destination: selectedCountry.name } })}
                  className="px-4 py-2 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  <span>Assurance voyage</span>
                </button>
              </div>
            </motion.section>
          </div>
        )}
      </main>
    </div>
  );
}