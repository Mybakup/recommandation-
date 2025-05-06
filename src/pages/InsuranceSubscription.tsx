import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  Plane, 
  Globe2, 
  Calendar, 
  Users, 
  ChevronRight,
  Check,
  ArrowRight,
  Loader2,
  Building2,
  GraduationCap,
  Briefcase,
  CreditCard,
  MapPin,
  Info
} from 'lucide-react';

// Types
interface TravelType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface InsurancePlan {
  id: string;
  name: string;
  price: number;
  interval: 'day' | 'month' | 'year';
  features: string[];
  isPopular?: boolean;
  color: string;
}

interface Traveler {
  firstName: string;
  lastName: string;
  birthDate: string;
  email?: string;
  phone?: string;
}

// Étapes du parcours
type Step = 'travel-type' | 'dates' | 'travelers' | 'plans' | 'summary';

export default function InsuranceSubscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('travel-type');
  const [selectedTravelType, setSelectedTravelType] = useState<string | null>(
    location.state?.insuranceType || null
  );
  const [travelDates, setTravelDates] = useState({ start: '', end: '' });
  const [travelers, setTravelers] = useState<Traveler[]>([
    { firstName: '', lastName: '', birthDate: '' }
  ]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Options de types de voyage
  const travelTypes: TravelType[] = [
    {
      id: 'tourism',
      name: 'Tourisme',
      description: 'Voyage de loisirs, vacances',
      icon: <Plane className="w-6 h-6 text-mybakup-coral" />,
      color: 'bg-[#FFE8E8]'
    },
    {
      id: 'business',
      name: 'Voyage d\'affaires',
      description: 'Déplacements professionnels',
      icon: <Briefcase className="w-6 h-6 text-mybakup-blue" />,
      color: 'bg-[#EDF5FF]'
    },
    {
      id: 'study',
      name: 'Études à l\'étranger',
      description: 'Séjours académiques',
      icon: <GraduationCap className="w-6 h-6 text-green-500" />,
      color: 'bg-green-100'
    },
    {
      id: 'expat',
      name: 'Expatriation',
      description: 'Installation à l\'étranger',
      icon: <Building2 className="w-6 h-6 text-purple-500" />,
      color: 'bg-purple-100'
    }
  ];

  // Plans d'assurance
  const insurancePlans: InsurancePlan[] = [
    {
      id: 'basic',
      name: 'Essentiel',
      price: 2.99,
      interval: 'day',
      features: [
        'Frais médicaux jusqu\'à 30 000€',
        'Rapatriement médical',
        'Assistance 24/7',
        'Responsabilité civile'
      ],
      color: 'bg-blue-50'
    },
    {
      id: 'premium',
      name: 'Confort',
      price: 4.99,
      interval: 'day',
      features: [
        'Frais médicaux jusqu\'à 150 000€',
        'Rapatriement médical',
        'Assistance 24/7',
        'Responsabilité civile',
        'Bagages jusqu\'à 1 500€',
        'Annulation de voyage'
      ],
      isPopular: true,
      color: 'bg-mybakup-coral/10'
    },
    {
      id: 'exclusive',
      name: 'Premium',
      price: 7.99,
      interval: 'day',
      features: [
        'Frais médicaux jusqu\'à 300 000€',
        'Rapatriement médical',
        'Assistance 24/7 multilingue',
        'Responsabilité civile étendue',
        'Bagages jusqu\'à 3 000€',
        'Annulation de voyage',
        'Retard de vol',
        'Sports à risque inclus'
      ],
      color: 'bg-purple-50'
    }
  ];

  // Plans d'assurance expatrié
  const expatPlans: InsurancePlan[] = [
    {
      id: 'expat-basic',
      name: 'Expatriation et vie à l\'étranger',
      price: 56,
      interval: 'month',
      features: [
        'Frais médicaux jusqu\'à 200 000€',
        'Hospitalisation',
        'Médecine courante',
        'Assistance rapatriement',
        'Responsabilité civile'
      ],
      color: 'bg-[#f8a488]/20'
    },
    {
      id: 'expat-senior',
      name: 'Expatrié senior et retraité',
      price: 214,
      interval: 'month',
      features: [
        'Frais médicaux jusqu\'à 400 000€',
        'Hospitalisation complète',
        'Médecine courante et préventive',
        'Assistance rapatriement',
        'Responsabilité civile',
        'Couverture des maladies chroniques'
      ],
      color: 'bg-[#e77c8e]/20'
    },
    {
      id: 'expat-student',
      name: 'Étudiant expatrié',
      price: 29,
      interval: 'month',
      features: [
        'Frais médicaux jusqu\'à 100 000€',
        'Hospitalisation',
        'Médecine courante',
        'Assistance rapatriement',
        'Responsabilité civile'
      ],
      isPopular: true,
      color: 'bg-[#f27c73]/20'
    },
    {
      id: 'expat-pro',
      name: 'Mission professionnelle',
      price: 12.50,
      interval: 'month',
      features: [
        'Frais médicaux jusqu\'à 250 000€',
        'Hospitalisation',
        'Médecine courante',
        'Assistance rapatriement',
        'Responsabilité civile professionnelle'
      ],
      color: 'bg-[#5dc2a7]/20'
    }
  ];

  // Calcul du nombre de jours entre deux dates
  const calculateDays = () => {
    if (!travelDates.start || !travelDates.end) return 0;
    
    const start = new Date(travelDates.start);
    const end = new Date(travelDates.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1; // Minimum 1 jour
  };

  // Calcul du prix total
  const calculateTotalPrice = () => {
    if (!selectedPlan) return 0;
    
    const isExpat = selectedTravelType === 'expat';
    const plans = isExpat ? expatPlans : insurancePlans;
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return 0;
    
    if (isExpat) {
      // Pour l'expatriation, le prix est mensuel par personne
      return plan.price * travelers.length;
    } else {
      // Pour les voyages, le prix est journalier par personne
      const days = calculateDays();
      return plan.price * days * travelers.length;
    }
  };

  // Ajout d'un voyageur
  const addTraveler = () => {
    setTravelers([...travelers, { firstName: '', lastName: '', birthDate: '' }]);
  };

  // Suppression d'un voyageur
  const removeTraveler = (index: number) => {
    if (travelers.length > 1) {
      setTravelers(travelers.filter((_, i) => i !== index));
    }
  };

  // Mise à jour des informations d'un voyageur
  const updateTraveler = (index: number, field: keyof Traveler, value: string) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index] = { ...updatedTravelers[index], [field]: value };
    setTravelers(updatedTravelers);
  };

  // Navigation vers l'étape suivante
  const goToNextStep = () => {
    switch (currentStep) {
      case 'travel-type':
        setCurrentStep('dates');
        break;
      case 'dates':
        setCurrentStep('travelers');
        break;
      case 'travelers':
        setCurrentStep('plans');
        break;
      case 'plans':
        setCurrentStep('summary');
        break;
      case 'summary':
        handleSubmit();
        break;
    }
  };

  // Vérification si l'étape actuelle est valide
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 'travel-type':
        return !!selectedTravelType;
      case 'dates':
        return !!travelDates.start && !!travelDates.end && new Date(travelDates.start) <= new Date(travelDates.end);
      case 'travelers':
        return travelers.every(t => t.firstName && t.lastName && t.birthDate);
      case 'plans':
        return !!selectedPlan;
      case 'summary':
        return true;
      default:
        return false;
    }
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirection vers une page de confirmation
      navigate('/insurance-confirmation', { 
        state: { 
          travelType: selectedTravelType,
          dates: travelDates,
          travelers,
          plan: selectedTravelType === 'expat' 
            ? expatPlans.find(p => p.id === selectedPlan)
            : insurancePlans.find(p => p.id === selectedPlan),
          totalPrice: calculateTotalPrice(),
          isExpat: selectedTravelType === 'expat'
        } 
      });
    } catch (error) {
      console.error('Error submitting insurance request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Rendu de l'étape actuelle
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'travel-type':
        return (
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-mybakup-blue">
              Type de séjour
            </h2>
            <p className="text-gray-600">
              Sélectionnez le type de séjour pour lequel vous souhaitez une assurance
            </p>
            <div className="space-y-4">
              {travelTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTravelType(type.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                    selectedTravelType === type.id
                      ? 'border-mybakup-coral bg-mybakup-coral/5'
                      : 'border-gray-200 hover:border-mybakup-coral'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${type.color}`}>
                    {type.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-mybakup-blue">{type.name}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                  {selectedTravelType === type.id && (
                    <Check className="w-5 h-5 text-mybakup-coral" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );
      
      case 'dates':
        return (
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-mybakup-blue">
              {selectedTravelType === 'expat' ? 'Dates d\'expatriation' : 'Dates du voyage'}
            </h2>
            <p className="text-gray-600">
              {selectedTravelType === 'expat' 
                ? 'Sélectionnez les dates de votre expatriation' 
                : 'Sélectionnez les dates de votre séjour'}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de départ *
                </label>
                <input
                  type="date"
                  required
                  value={travelDates.start}
                  onChange={(e) => setTravelDates({ ...travelDates, start: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedTravelType === 'expat' ? 'Date de fin prévue (facultatif)' : 'Date de retour *'}
                </label>
                <input
                  type="date"
                  required={selectedTravelType !== 'expat'}
                  value={travelDates.end}
                  onChange={(e) => setTravelDates({ ...travelDates, end: e.target.value })}
                  min={travelDates.start || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                />
              </div>
              {travelDates.start && travelDates.end && selectedTravelType !== 'expat' && (
                <div className="p-4 bg-mybakup-blue/5 rounded-xl">
                  <p className="text-mybakup-blue">
                    Durée du voyage : <span className="font-medium">{calculateDays()} jour{calculateDays() > 1 ? 's' : ''}</span>
                  </p>
                </div>
              )}
              {selectedTravelType === 'expat' && (
                <div className="p-4 bg-purple-50 rounded-xl flex items-start gap-2">
                  <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-purple-700 text-sm">
                    Pour une expatriation, l'assurance est facturée mensuellement et peut être résiliée à tout moment avec un préavis d'un mois.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );
      
      case 'travelers':
        return (
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-mybakup-blue">
              {selectedTravelType === 'expat' ? 'Personnes à assurer' : 'Voyageurs à assurer'}
            </h2>
            <p className="text-gray-600">
              Renseignez les informations pour chaque personne
            </p>
            <div className="space-y-6">
              {travelers.map((traveler, index) => (
                <motion.div 
                  key={index} 
                  className="p-4 border border-gray-200 rounded-xl space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-mybakup-blue">
                      {selectedTravelType === 'expat' ? 'Personne' : 'Voyageur'} {index + 1}
                    </h3>
                    {travelers.length > 1 && (
                      <button
                        onClick={() => removeTraveler(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={traveler.firstName}
                        onChange={(e) => updateTraveler(index, 'firstName', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={traveler.lastName}
                        onChange={(e) => updateTraveler(index, 'lastName', e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      required
                      value={traveler.birthDate}
                      onChange={(e) => updateTraveler(index, 'birthDate', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                    />
                  </div>
                  {index === 0 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={traveler.email || ''}
                          onChange={(e) => updateTraveler(index, 'email', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={traveler.phone || ''}
                          onChange={(e) => updateTraveler(index, 'phone', e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              <motion.button
                type="button"
                onClick={addTraveler}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-mybakup-blue hover:border-mybakup-coral hover:text-mybakup-coral transition-colors"
              >
                + Ajouter {selectedTravelType === 'expat' ? 'une personne' : 'un voyageur'}
              </motion.button>
            </div>
          </motion.div>
        );
      
      case 'plans':
        const isExpat = selectedTravelType === 'expat';
        const plans = isExpat ? expatPlans : insurancePlans;
        
        return (
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-mybakup-blue">
              Choisissez votre formule
            </h2>
            <p className="text-gray-600">
              Sélectionnez la formule qui correspond le mieux à vos besoins
            </p>
            <div className="space-y-4">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-6 border rounded-xl cursor-pointer transition-all ${
                    plan.isPopular
                      ? 'border-mybakup-coral bg-mybakup-coral/5'
                      : selectedPlan === plan.id
                      ? 'border-mybakup-coral bg-mybakup-coral/5'
                      : 'border-gray-200 hover:border-mybakup-coral'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 right-4 px-3 py-1 bg-mybakup-coral text-white text-sm rounded-full">
                      Recommandé
                    </span>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-mybakup-blue">{plan.name}</h3>
                      <ul className="mt-2 space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-mybakup-coral rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-mybakup-blue">
                        {plan.price}€
                      </span>
                      <span className="text-gray-500">/{plan.interval}</span>
                      <p className="text-sm text-gray-500">par personne</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      
      case 'summary':
        const isExpatSummary = selectedTravelType === 'expat';
        const selectedPlanData = isExpatSummary 
          ? expatPlans.find(p => p.id === selectedPlan)
          : insurancePlans.find(p => p.id === selectedPlan);
        const selectedTravelTypeData = travelTypes.find(t => t.id === selectedTravelType);
        const days = calculateDays();
        const totalPrice = calculateTotalPrice();
        
        return (
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-mybakup-blue">
              Récapitulatif de votre assurance
            </h2>
            <div className="bg-white rounded-xl p-6 space-y-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <Shield className="w-10 h-10 text-mybakup-coral" />
                <div>
                  <h3 className="font-semibold text-mybakup-blue">
                    {selectedPlanData?.name || 'Formule sélectionnée'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedTravelTypeData?.name || 'Voyage'} {!isExpatSummary && `- ${days} jour${days > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Dates</span>
                  </div>
                  <span className="text-mybakup-blue">
                    {new Date(travelDates.start).toLocaleDateString()} 
                    {travelDates.end && ` - ${new Date(travelDates.end).toLocaleDateString()}`}
                  </span>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Personnes assurées</span>
                  </div>
                  <span className="text-mybakup-blue">{travelers.length}</span>
                </div>
                
                <div className="flex justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Prix {isExpatSummary ? 'par mois' : 'par jour'}</span>
                  </div>
                  <span className="text-mybakup-blue">{selectedPlanData?.price}€ / personne</span>
                </div>
                
                <div className="flex justify-between font-medium">
                  <span className="text-gray-800">Total {isExpatSummary ? 'mensuel' : ''}</span>
                  <span className="text-xl text-mybakup-coral">{totalPrice.toFixed(2)}€</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-medium text-mybakup-blue mb-2">Personnes assurées</h4>
                <div className="space-y-2">
                  {travelers.map((traveler, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {traveler.firstName} {traveler.lastName}
                      </span>
                      <span className="text-gray-600">
                        {new Date(traveler.birthDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-700 mb-1">Couverture mondiale</h4>
                  <p className="text-sm text-blue-600">
                    Votre assurance vous couvre dans tous les pays du monde, à l'exception des pays sous sanctions internationales.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-mybakup-blue/5 p-4 rounded-xl flex items-start gap-2">
              <Info className="w-5 h-5 text-mybakup-blue flex-shrink-0 mt-0.5" />
              <p className="text-sm text-mybakup-blue">
                En cliquant sur "Souscrire", vous acceptez les conditions générales de vente et la politique de confidentialité.
              </p>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  // Rendu du titre de l'étape
  const getStepTitle = () => {
    const isExpat = selectedTravelType === 'expat';
    
    switch (currentStep) {
      case 'travel-type':
        return 'Assurance voyage';
      case 'dates':
        return isExpat ? 'Dates d\'expatriation' : 'Dates du voyage';
      case 'travelers':
        return isExpat ? 'Personnes à assurer' : 'Voyageurs';
      case 'plans':
        return 'Formules';
      case 'summary':
        return 'Récapitulatif';
      default:
        return 'Assurance voyage';
    }
  };

  // Animation variants pour les transitions entre étapes
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100
    },
    in: {
      opacity: 1,
      x: 0
    },
    out: {
      opacity: 0,
      x: -100
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100/70 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-mybakup-blue" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-mybakup-blue">
              {getStepTitle()}
            </h1>
          </div>
          <div className="p-2 rounded-xl bg-[#EDF5FF]">
            <Shield className="w-6 h-6 text-mybakup-blue" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-16 z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between py-2 text-xs">
            <span className={currentStep === 'travel-type' ? 'text-mybakup-coral font-medium' : 'text-gray-400'}>Type</span>
            <span className={currentStep === 'dates' ? 'text-mybakup-coral font-medium' : 'text-gray-400'}>Dates</span>
            <span className={currentStep === 'travelers' ? 'text-mybakup-coral font-medium' : 'text-gray-400'}>Voyageurs</span>
            <span className={currentStep === 'plans' ? 'text-mybakup-coral font-medium' : 'text-gray-400'}>Formules</span>
            <span className={currentStep === 'summary' ? 'text-mybakup-coral font-medium' : 'text-gray-400'}>Récapitulatif</span>
          </div>
          <div className="flex h-1 mb-2">
            <div className={`flex-1 rounded-l-full ${
              currentStep === 'travel-type' || currentStep === 'dates' || currentStep === 'travelers' || currentStep === 'plans' || currentStep === 'summary'
                ? 'bg-mybakup-coral'
                : 'bg-gray-200'
            }`} />
            <div className={`flex-1 ${
              currentStep === 'dates' || currentStep === 'travelers' || currentStep === 'plans' || currentStep === 'summary'
                ? 'bg-mybakup-coral'
                : 'bg-gray-200'
            }`} />
            <div className={`flex-1 ${
              currentStep === 'travelers' || currentStep === 'plans' || currentStep === 'summary'
                ? 'bg-mybakup-coral'
                : 'bg-gray-200'
            }`} />
            <div className={`flex-1 ${
              currentStep === 'plans' || currentStep === 'summary'
                ? 'bg-mybakup-coral'
                : 'bg-gray-200'
            }`} />
            <div className={`flex-1 rounded-r-full ${
              currentStep === 'summary'
                ? 'bg-mybakup-coral'
                : 'bg-gray-200'
            }`} />
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <motion.div
          key={currentStep}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
        >
          {renderCurrentStep()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentStep === 'dates') setCurrentStep('travel-type');
              else if (currentStep === 'travelers') setCurrentStep('dates');
              else if (currentStep === 'plans') setCurrentStep('travelers');
              else if (currentStep === 'summary') setCurrentStep('plans');
              else navigate('/');
            }}
            className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Retour
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNextStep}
            disabled={!isCurrentStepValid() || loading}
            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              isCurrentStepValid()
                ? 'bg-mybakup-coral text-white hover:bg-opacity-90'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>
                  {currentStep === 'summary' ? 'Souscrire' : 'Continuer'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </main>
    </div>
  );
}