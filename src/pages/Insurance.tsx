import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Clock,
  Phone,
  MapPin,
  CreditCard,
  Star,
  Heart,
  MessageSquare
} from 'lucide-react';

interface InsuranceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  bgColor: string;
  path: string;
}

interface InsuranceFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  avatar: string;
  rating: number;
}

const insuranceOptions: InsuranceOption[] = [
  {
    id: 'travel',
    title: 'Voyage',
    description: 'Couverture pour vos déplacements temporaires',
    icon: <Plane className="w-6 h-6 text-white" />,
    color: 'bg-gradient-to-r from-orange-500 to-red-500',
    textColor: 'text-white',
    bgColor: 'bg-orange-50',
    path: '/insurance/travel'
  },
  {
    id: 'expat',
    title: 'Expatriation',
    description: 'Protection complète pour votre vie à l\'étranger',
    icon: <Globe2 className="w-6 h-6 text-white" />,
    color: 'bg-gradient-to-r from-blue-500 to-purple-500',
    textColor: 'text-white',
    bgColor: 'bg-blue-50',
    path: '/insurance/expat'
  }
];

const features: InsuranceFeature[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Protection mondiale',
    description: 'Couverture dans plus de 190 pays'
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Assistance 24/7',
    description: 'Support multilingue disponible à tout moment'
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Téléconsultation',
    description: 'Accès illimité aux médecins en ligne'
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Réseau international',
    description: 'Accès à plus de 1 million de professionnels de santé'
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Tiers payant',
    description: 'Pas d\'avance de frais avec nos partenaires'
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Couverture famille',
    description: 'Protection pour toute la famille'
  }
];

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Pierre M.',
    location: 'Voyage en Asie du Sud-Est',
    text: 'J\'ai eu un accident de moto en Thaïlande et l\'assurance a tout pris en charge : hospitalisation, soins et même le rapatriement. Un service client réactif et efficace.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
    rating: 5
  },
  {
    id: '2',
    name: 'Julie D.',
    location: 'PVT en Australie',
    text: 'Pendant mon année en PVT, j\'ai dû consulter plusieurs fois. L\'application mobile m\'a permis de gérer facilement mes remboursements et de trouver des médecins parlant français.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Thomas R.',
    location: 'Expatrié au Canada',
    text: 'En tant qu\'expatrié, mon assurance me permet d\'accéder aux soins sans me soucier des coûts. Le service client est toujours disponible pour m\'aider avec mes démarches.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100&h=100',
    rating: 5
  }
];

export default function Insurance() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100/70 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-mybakup-blue" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-mybakup-blue">
              Assurance santé voyage
            </h1>
          </div>
          <img 
            src="https://i.imgur.com/jxMQcJi.png" 
            alt="MyBakup" 
            className="h-8"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-10">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-[#EDF5FF] to-[#FFE8E8] rounded-2xl p-6 md:p-8 overflow-hidden relative"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-mybakup-blue" />
                <h2 className="text-2xl font-bold text-mybakup-blue">
                  Votre santé n'a pas de frontières
                </h2>
              </div>
              <p className="text-gray-600">
                Obtenez une couverture santé complète pour votre prochain voyage en seulement 2 minutes. Protection mondiale, assistance 24/7 et prise en charge des frais médicaux.
              </p>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat-advisor')}
                  className="px-6 py-3 bg-mybakup-coral text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
                >
                  <span>Souscrire maintenant</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/chat-advisor')}
                  className="px-6 py-3 border border-mybakup-blue text-mybakup-blue rounded-xl hover:bg-mybakup-blue/5 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Parler à un conseiller</span>
                </motion.button>
              </div>
            </div>
            <motion.div 
              className="w-full md:w-auto flex-shrink-0"
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=400&h=300"
                alt="Voyageurs avec valises"
                className="w-full md:w-[300px] h-[200px] object-cover rounded-xl shadow-lg"
              />
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-200 rounded-full opacity-20 blur-2xl"></div>
        </motion.section>

        {/* Insurance Options */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-mybakup-coral" />
            Choisissez votre assurance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insuranceOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(option.path)}
                className={`${option.bgColor} rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-white`}
              >
                <div className={`${option.color} p-4 flex items-center gap-3`}>
                  <div className="p-2 rounded-full bg-white/20">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {option.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    {option.description}
                  </p>
                  <div className="space-y-2">
                    {option.id === 'travel' ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">Frais médicaux jusqu'à 150 000€</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">Rapatriement sanitaire</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">Assistance 24/7 multilingue</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">Frais médicaux jusqu'à 1 000 000€</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">Couverture mondiale complète</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">Téléconsultation illimitée</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-lg font-bold text-mybakup-blue">
                      {option.id === 'travel' ? 'Dès 2,99€/jour' : 'Dès 56€/mois'}
                    </span>
                    <div className="flex items-center gap-1 text-mybakup-coral">
                      <span>En savoir plus</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Check className="w-6 h-6 text-mybakup-coral" />
            Nos garanties essentielles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#EDF5FF] text-mybakup-blue">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-mybakup-blue">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h2 className="text-2xl font-semibold text-mybakup-blue mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-mybakup-coral" />
            Ce que disent nos voyageurs
          </h2>
          
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        {testimonial.rating % 1 > 0 && (
                          <div className="relative">
                            <Star className="w-4 h-4 text-gray-300" />
                            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${(testimonial.rating % 1) * 100}%` }}>
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 italic mb-4">"{testimonial.text}"</p>
                      <div>
                        <h3 className="font-medium text-mybakup-blue">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeTestimonial === index ? 'bg-mybakup-coral' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-mybakup-blue to-purple-600 rounded-xl p-8 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Prêt à voyager en toute sérénité ?</h2>
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