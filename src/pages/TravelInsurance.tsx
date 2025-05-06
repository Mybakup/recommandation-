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
  MapPin,
  MessageSquare,
  Info,
  Star
} from 'lucide-react';

interface InsurancePlan {
  id: string;
  name: string;
  price: number;
  interval: 'day' | 'month';
  features: string[];
  isPopular?: boolean;
  color: string;
  bgColor: string;
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
    limit: 'Jusqu\'à 150 000€'
  },
  {
    icon: <Plane className="w-5 h-5" />,
    title: 'Rapatriement',
    description: 'Transport sanitaire d\'urgence',
    limit: 'Frais réels'
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Assistance',
    description: 'Support médical et logistique',
    limit: '24h/24 - 7j/7'
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Bagages',
    description: 'Perte, vol et retard',
    limit: 'Jusqu\'à 2 000€'
  }
];

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
    color: 'bg-gradient-to-r from-blue-400 to-blue-500',
    bgColor: 'bg-blue-50'
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
    color: 'bg-gradient-to-r from-mybakup-coral to-red-500',
    bgColor: 'bg-mybakup-coral/10'
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
    color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50'
  }
];

export default function TravelInsurance() {
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
              Assurance Voyage
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
          className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 md:p-8 overflow-hidden relative"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-mybakup-coral" />
                <h2 className="text-2xl font-bold text-mybakup-blue">
                  MyBakup Voyage
                </h2>
              </div>
              <p className="text-gray-600">
                Une protection complète pour tous vos voyages, adaptée à vos besoins et à ceux de votre famille.
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
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=400&h=300"
                alt="Travel"
                className="w-full md:w-[300px] h-[200px] object-cover rounded-xl shadow-lg"
              />
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-200 rounded-full opacity-20 blur-2xl"></div>
        </motion.section>

        {/* Insurance Plans */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-mybakup-coral" />
            Nos formules voyage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insurancePlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedPlan(plan.id);
                  navigate('/chat-advisor');
                }}
                className={`${plan.bgColor} rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-white relative`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-mybakup-coral text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      RECOMMANDÉ
                    </div>
                  </div>
                )}
                <div className={`${plan.color} p-4 flex items-center justify-between`}>
                  <h3 className="text-xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <div className="text-white text-right">
                    <span className="text-2xl font-bold">{plan.price}€</span>
                    <span className="text-sm">/{plan.interval}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 bg-mybakup-coral text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Choisir cette formule</span>
                    <ArrowRight className="w-4 h-4" />
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

        {/* Destination Coverage */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
              <Globe2 className="w-6 h-6 text-mybakup-coral" />
              Couverture mondiale
            </h2>
            <p className="text-gray-600 mb-4">
              Notre assurance voyage vous couvre dans plus de 190 pays à travers le monde, vous permettant de voyager en toute sérénité.
            </p>
          </div>
          <div className="h-64 relative">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
              alt="World map"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="font-medium">Couverture dans tous les pays du monde</span>
                </div>
                <p className="text-sm text-white/80">
                  À l'exception des pays sous sanctions internationales
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Special Features */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-mybakup-coral" />
            Les plus MyBakup
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#FFE8E8] text-mybakup-coral">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-mybakup-blue">
                    Téléconsultation 24/7
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Accédez à des médecins francophones où que vous soyez dans le monde, à tout moment.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#EDF5FF] text-mybakup-blue">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-mybakup-blue">
                    Réseau international
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Accédez à notre réseau de plus de 1 million de professionnels de santé à travers le monde.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-green-50 text-green-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-mybakup-blue">
                    Tiers payant
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Pas d'avance de frais dans notre réseau de partenaires internationaux.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-mybakup-blue">
                    Assistance multilingue
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Nos conseillers parlent plus de 15 langues pour vous assister partout dans le monde.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Travel Types */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Plane className="w-6 h-6 text-mybakup-coral" />
            Types de voyages couverts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-[#f8d488]/20 rounded-xl p-6 border border-[#f8d488]/30"
            >
              <h3 className="font-semibold text-mybakup-blue text-lg mb-2">Voyage touristique</h3>
              <p className="text-gray-600 mb-3">Dès 2,99€/jour</p>
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600&h=300"
                alt="Voyageur avec valise"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat-advisor')}
                  className="py-2 px-4 bg-[#f8d488] text-white rounded-full hover:bg-opacity-90 transition-colors"
                >
                  Obtenir un prix
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat-advisor')}
                  className="py-2 px-4 border border-[#f8d488] text-[#f8d488] rounded-full hover:bg-[#f8d488]/5 transition-colors"
                >
                  En savoir plus
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-[#5dc2a7]/20 rounded-xl p-6 border border-[#5dc2a7]/30"
            >
              <h3 className="font-semibold text-mybakup-blue text-lg mb-2">Séjour + de 3 mois</h3>
              <p className="text-gray-600 mb-3">Dès 36€/mois</p>
              <img 
                src="https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&q=80&w=600&h=300"
                alt="Voyageur longue durée"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat-advisor')}
                  className="py-2 px-4 bg-[#5dc2a7] text-white rounded-full hover:bg-opacity-90 transition-colors"
                >
                  Obtenir un prix
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat-advisor')}
                  className="py-2 px-4 border border-[#5dc2a7] text-[#5dc2a7] rounded-full hover:bg-[#5dc2a7]/5 transition-colors"
                >
                  En savoir plus
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Info className="w-6 h-6 text-mybakup-coral" />
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-mybakup-blue mb-2">Qui peut souscrire à l'assurance voyage ?</h3>
              <p className="text-gray-600">
                Toute personne résidant en France, en Europe ou à l'international peut souscrire à notre assurance voyage, quel que soit son âge ou sa nationalité.
              </p>
            </div>
            
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-mybakup-blue mb-2">Quand souscrire à l'assurance voyage ?</h3>
              <p className="text-gray-600">
                Vous pouvez souscrire à tout moment avant votre départ. Idéalement, souscrivez dès que vous réservez votre voyage pour bénéficier de la garantie annulation.
              </p>
            </div>
            
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-mybakup-blue mb-2">Comment fonctionne le remboursement des frais médicaux ?</h3>
              <p className="text-gray-600">
                En cas de frais médicaux, vous pouvez soit utiliser notre réseau de tiers payant (sans avance de frais), soit être remboursé sur présentation des factures via notre application mobile.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-mybakup-blue mb-2">Les maladies chroniques sont-elles couvertes ?</h3>
              <p className="text-gray-600">
                Les maladies chroniques stables et contrôlées sont couvertes. Les traitements d'entretien peuvent être pris en charge selon la formule choisie.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center"
        >
          <h2 className="text-xl font-semibold text-mybakup-blue mb-4">
            Prêt à partir sereinement ?
          </h2>
          <p className="text-gray-600 mb-6">
            Obtenez votre devis personnalisé en quelques minutes
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chat-advisor')}
              className="px-6 py-3 bg-mybakup-coral text-white rounded-xl hover:bg-opacity-90 transition-colors"
            >
              Souscrire maintenant
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/chat-advisor')}
              className="px-6 py-3 border border-mybakup-blue text-mybakup-blue rounded-xl hover:bg-mybakup-blue/5 transition-colors"
            >
              Parler à un conseiller
            </motion.button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}