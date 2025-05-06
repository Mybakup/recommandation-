import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Globe, Shield, MessageSquare, Clock } from 'lucide-react';

export default function ProfileChoice() {
  const navigate = useNavigate();
  const [activeProfile, setActiveProfile] = useState<'traveler' | 'professional'>('traveler');
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [dragStartX, setDragStartX] = useState(0);

  // Hide swipe hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDragStart = (e: any) => {
    setDragStartX(e.clientX || e.touches?.[0]?.clientX || 0);
  };

  const handleDragEnd = (e: any, info: any) => {
    const dragEndX = e.clientX || e.changedTouches?.[0]?.clientX || 0;
    const dragDistance = dragEndX - dragStartX;
    
    if (dragDistance > 100 && activeProfile === 'professional') {
      setActiveProfile('traveler');
    } else if (dragDistance < -100 && activeProfile === 'traveler') {
      setActiveProfile('professional');
    }
  };

  const handleProfileClick = (profile: 'traveler' | 'professional') => {
    setActiveProfile(profile);
  };

  const handleContinue = () => {
    if (activeProfile === 'traveler') {
      navigate('/home');
    } else {
      navigate('/practitioner-type');
    }
  };

  // Avantages pour chaque profil
  const travelerBenefits = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Accès mondial",
      description: "Trouvez des médecins dans plus de 40 pays"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Assurance voyage",
      description: "Protection complète pendant vos voyages"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Traduction médicale",
      description: "Communiquez facilement avec les médecins locaux"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Assistance 24/7",
      description: "Support médical disponible à tout moment"
    }
  ];

  const professionalBenefits = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Visibilité internationale",
      description: "Attirez des patients du monde entier"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Gestion simplifiée",
      description: "Organisez facilement vos rendez-vous"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Communication multilingue",
      description: "Échangez avec vos patients dans leur langue"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Disponibilité flexible",
      description: "Gérez vos horaires selon vos besoins"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF5FF] via-white to-[#FFE8E8] relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-mybakup-coral/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-mybakup-blue/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

      <header className="relative z-10 bg-white/70 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-mybakup-blue" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-mybakup-blue">
            Choisir un profil
          </h1>
        </div>
      </header>

      {/* Swipe indicator */}
      {showSwipeHint && (
        <div className="text-center text-gray-500 text-xs mt-4 animate-swipe-hint">
          Glissez pour basculer entre les profils
        </div>
      )}

      <motion.main 
        className="relative max-w-4xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)] flex flex-col md:flex-row items-center justify-center gap-8"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Traveler Profile */}
        <div className={`w-full md:w-1/2 flex flex-col items-center ${activeProfile === 'traveler' ? 'order-first' : 'order-last md:order-first'}`}>
          <motion.div 
            className={`relative ${activeProfile === 'traveler' ? 'animate-float' : ''}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: activeProfile === 'traveler' ? 1 : 0.6, 
              scale: activeProfile === 'traveler' ? 1 : 0.8
            }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-red-500 overflow-hidden ${activeProfile === 'traveler' ? 'profile-pulse' : ''}`}>
              <img 
                src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300"
                alt="Voyageur"
                className="w-full h-full object-cover"
                onClick={() => handleProfileClick('traveler')}
              />
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-center">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                Profil Voyageur
              </h2>
            </div>
          </motion.div>

          {activeProfile === 'traveler' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 w-full max-w-xs bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50"
            >
              {travelerBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-2">
                  <div className="p-2 rounded-lg bg-[#FFE8E8] text-mybakup-coral">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-mybakup-blue">{benefit.title}</h3>
                    <p className="text-xs text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Professional Profile */}
        <div className={`w-full md:w-1/2 flex flex-col items-center ${activeProfile === 'professional' ? 'order-first' : 'order-first md:order-last'}`}>
          <motion.div 
            className={`relative ${activeProfile === 'professional' ? 'animate-float' : ''}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: activeProfile === 'professional' ? 1 : 0.6, 
              scale: activeProfile === 'professional' ? 1 : 0.8
            }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-[#47559E] overflow-hidden ${activeProfile === 'professional' ? 'profile-pulse' : ''}`}>
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300"
                alt="Professionnel de santé"
                className="w-full h-full object-cover"
                onClick={() => handleProfileClick('professional')}
              />
            </div>
            <div className="absolute bottom-5 left-0 right-0 text-center">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                Profil Professionnel
              </h2>
            </div>
          </motion.div>

          {activeProfile === 'professional' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 w-full max-w-xs bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50"
            >
              {professionalBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-2">
                  <div className="p-2 rounded-lg bg-[#EDF5FF] text-mybakup-blue">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-mybakup-blue">{benefit.title}</h3>
                    <p className="text-xs text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.main>

      {/* Continue Button */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <motion.button
          onClick={handleContinue}
          className={`w-full max-w-xs py-4 ${
            activeProfile === 'traveler' ? 'bg-[#ff3c00]' : 'bg-[#47559E]'
          } text-white rounded-full font-bold text-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Continuer</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}