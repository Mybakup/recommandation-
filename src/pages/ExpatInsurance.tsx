import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Shield,
  ArrowRight,
  Check,
  Globe2, 
  Plane,
  Heart,
  Stethoscope,
  Pill,
  Baby,
  Smile,
  Eye,
  Phone,
  Clock,
  CreditCard,
  MessageSquare,
  Info,
  Building2,
  GraduationCap,
  Briefcase,
  Star
} from 'lucide-react';

interface InsurancePlan {
  id: string;
  name: string;
  price: number;
  interval: 'month';
  features: string[];
  isPopular?: boolean;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

interface Coverage {
  icon: React.ReactNode;
  title: string;
  description: string;
  limit: string;
}

const coverages: Coverage[] = [
  {
    icon: <Stethoscope className="w-5 h-5" />,
    title: 'Frais médicaux',
    description: 'Prise en charge des soins à l\'étranger',
    limit: 'Jusqu\'à 1 000 000€'
  },
  {
    icon: <Pill className="w-5 h-5" />,
    title: 'Pharmacie',
    description: 'Médicaments prescrits et vaccins',
    limit: '100% des frais réels'
  },
  {
    icon: <Baby className="w-5 h-5" />,
    title: 'Maternité',
    description: 'Suivi de grossesse et accouchement',
    limit: 'Jusqu\'à 12 000€'
  },
  {
    icon: <Smile className="w-5 h-5" />,
    title: 'Dentaire',
    description: 'Soins, prothèses et implants',
    limit: 'Jusqu\'à 2 000€/an'
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Optique',
    description: 'Montures, verres et lentilles',
    limit: 'Jusqu\'à 600€/an'
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Prévention',
    description: 'Bilans de santé et dépistages',
    limit: '100% des frais réels'
  }
];

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
    color: 'bg-gradient-to-r from-[#f8a488] to-[#f8c488]',
    bgColor: 'bg-[#f8a488]/20',
    icon: <Building2 className="w-6 h-6 text-white" />
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
    color: 'bg-gradient-to-r from-[#e77c8e] to-[#e7a78e]',
    bgColor: 'bg-[#e77c8e]/20',
    icon: <Clock className="w-6 h-6 text-white" />
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
    color: 'bg-gradient-to-r from-[#f27c73] to-[#f2a873]',
    bgColor: 'bg-[#f27c73]/20',
    icon: <GraduationCap className="w-6 h-6 text-white" />
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
    color: 'bg-gradient-to-r from-[#5dc2a7] to-[#5da7c2]',
    bgColor: 'bg-[#5dc2a7]/20',
    icon: <Briefcase className="w-6 h-6 text-white" />
  }
];

export default function ExpatInsurance() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/insurance')}
              className="p-2 hover:bg-gray-100/70 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-mybakup-blue" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-mybakup-blue">
              Assurance Expatrié
            </h1>
          </div>
          <img 
            src="https://i.imgur.com/jxMQcJi.png" 
            alt="MyBakup" 
            className="h-8"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 overflow-hidden relative"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-mybakup-blue" />
                <h2 className="text-2xl font-bold text-mybakup-blue">
                  MyBakup Expatrié
                </h2>
              </div>
              <p className="text-gray-600">
                Une couverture santé complète pour votre expatriation, adaptée à vos besoins et à ceux de votre famille.
              </p>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat-advisor')}
                  className="px-6 py-3 bg-mybakup-coral text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors"
                >
                  Souscrire maintenant
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat-advisor')}
                  className="px-6 py-3 border border-mybakup-blue text-mybakup-blue rounded-xl hover:bg-mybakup-blue/5 transition-colors"
                >
                  En savoir plus
                </motion.button>
              </div>
            </div>
            <motion.div 
              className="w-full md:w-auto flex-shrink-0"
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400&h=300"
                alt="Moving abroad"
                className="w-full md:w-[300px] h-[200px] object-cover rounded-xl shadow-lg"
              />
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-2xl"></div>
        </motion.section>

        {/* Expat Types */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-mybakup-coral" />
            Nos formules d'expatriation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expatPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedPlan(plan.id);
                  navigate('/chat-advisor');
                }}
                className={`${plan.bgColor} rounded-xl p-6 border border-white/50 shadow-sm hover:shadow-xl transition-all cursor-pointer relative`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-mybakup-coral text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      RECOMMANDÉ
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${plan.color}`}>
                    {plan.icon}
                  </div>
                  <h3 className="font-semibold text-mybakup-blue text-lg">{plan.name}</h3>
                </div>
                <p className="text-gray-600 mb-3">Dès {plan.price}€/{plan.interval}</p>
                <img 
                  src={
                    plan.id === 'expat-basic' 
                      ? "https://images.unsplash.com/photo-1581579438747-104c53d03e24?auto=format&fit=crop&q=80&w=600&h=300"
                      : plan.id === 'expat-senior'
                      ? "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?auto=format&fit=crop&q=80&w=600&h=300"
                      : plan.id === 'expat-student'
                      ? "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600&h=300"
                      : "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600&h=300"
                  }
                  alt={plan.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2 px-4 bg-mybakup-coral text-white rounded-full hover:bg-opacity-90 transition-colors"
                  >
                    Obtenir un prix
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2 px-4 border border-mybakup-blue text-mybakup-blue rounded-full hover:bg-mybakup-blue/5 transition-colors"
                  >
                    En savoir plus
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Coverage Grid */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Check className="w-6 h-6 text-mybakup-coral" />
            Garanties incluses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coverages.map((coverage, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#EDF5FF] text-mybakup-blue">
                    {coverage.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-mybakup-blue">
                      {coverage.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {coverage.description}
                    </p>
                    <p className="text-sm font-medium text-mybakup-coral mt-2">
                      {coverage.limit}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-mybakup-coral" />
            Témoignages d'expatriés
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Sophie L."
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <h3 className="font-medium text-mybakup-blue">Sophie L.</h3>
                <p className="text-sm text-gray-500">Expatriée au Canada depuis 2 ans</p>
                <p className="text-sm text-gray-600 mt-2">
                  "L'assurance MyBakup m'a sauvée lors d'une hospitalisation d'urgence à Toronto. Tout a été pris en charge sans avance de frais, et l'assistance téléphonique était disponible 24h/24."
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <img
                src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=100&h=100"
                alt="Marc T."
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <h3 className="font-medium text-mybakup-blue">Marc T.</h3>
                <p className="text-sm text-gray-500">Famille expatriée en Australie</p>
                <p className="text-sm text-gray-600 mt-2">
                  "Avec trois enfants, la tranquillité d'esprit est essentielle. Notre assurance expatrié nous permet d'accéder aux meilleurs soins sans nous soucier des coûts."
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Info className="w-6 h-6 text-mybakup-coral" />
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-mybakup-blue mb-2">Quelle est la différence entre une assurance voyage et une assurance expatrié ?</h3>
              <p className="text-gray-600">
                L'assurance voyage est conçue pour des séjours temporaires (jusqu'à 12 mois) tandis que l'assurance expatrié couvre les personnes qui s'installent durablement à l'étranger, avec des garanties plus complètes et adaptées à une vie à l'étranger.
              </p>
            </div>
            
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-mybakup-blue mb-2">Puis-je souscrire une assurance expatrié si je suis déjà à l'étranger ?</h3>
              <p className="text-gray-600">
                Oui, vous pouvez souscrire même si vous êtes déjà à l'étranger. Un délai de carence de 10 jours peut s'appliquer pour certaines garanties.
              </p>
            </div>
            
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-mybakup-blue mb-2">L'assurance expatrié couvre-t-elle les retours temporaires dans mon pays d'origine ?</h3>
              <p className="text-gray-600">
                Oui, notre assurance expatrié vous couvre lors de vos retours temporaires dans votre pays d'origine, généralement jusqu'à 90 jours consécutifs.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-mybakup-blue mb-2">Comment fonctionne la prise en charge des soins médicaux à l'étranger ?</h3>
              <p className="text-gray-600">
                Vous pouvez soit utiliser notre réseau de tiers payant (sans avance de frais), soit être remboursé sur présentation des factures via notre application mobile. Notre service d'assistance est disponible 24/7 pour vous guider.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-mybakup-blue to-purple-600 rounded-xl p-8 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à partir sereinement ?</h2>
            <p className="mb-8">
              Obtenez votre couverture santé en quelques clics et partez l'esprit tranquille.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/chat-advisor')}
                className="px-8 py-3 bg-white text-mybakup-blue rounded-xl font-medium hover:bg-opacity-90 transition-colors"
              >
                Souscrire maintenant
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/chat-advisor')}
                className="px-8 py-3 border border-white text-white rounded-xl hover:bg-white/10 transition-colors"
              >
                Parler à un conseiller
              </motion.button>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}