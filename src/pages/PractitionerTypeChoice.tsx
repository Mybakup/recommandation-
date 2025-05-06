import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, Building2, UserCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PractitionerTypeChoice() {
  const navigate = useNavigate();
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const options = [
    {
      id: 'independent',
      title: 'Praticien indépendant',
      description: 'Gérez votre activité en toute autonomie',
      icon: UserCog,
      color: 'bg-[#FFE8E8]',
      textColor: 'text-mybakup-coral',
      path: '/practitioner-signup'
    },
    {
      id: 'facility',
      title: 'Centre de soins',
      description: 'Administrez votre établissement et votre équipe médicale',
      icon: Building2,
      color: 'bg-[#EDF5FF]',
      textColor: 'text-mybakup-blue',
      path: '/facility-registration'
    },
    {
      id: 'secretary',
      title: 'Secrétaire',
      description: 'Gérez les rendez-vous et l\'agenda des praticiens',
      icon: UserCircle,
      color: 'bg-[#E8F4FF]',
      textColor: 'text-[#47559E]',
      path: '/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-20 -left-20 w-[400px] h-[400px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 right-20 w-[500px] h-[500px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <header className="relative z-10 bg-white/70 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate('/profile-choice')}
            className="p-2 hover:bg-white/80 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-mybakup-blue" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-mybakup-blue">
            Type de praticien
          </h1>
        </div>
      </header>

      <main className="relative max-w-3xl mx-auto px-4 py-12">
        <div className="grid gap-6">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => navigate(option.path)}
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
                className="relative bg-white/80 backdrop-blur-sm rounded-xl p-6 text-left hover:shadow-xl transition-all border border-white/50 group overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-white/0"
                  animate={{
                    background: hoveredOption === option.id 
                      ? ['linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)', 
                         'linear-gradient(to right, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)', 
                         'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)']
                      : 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)'
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                <div className="flex items-center gap-4 relative z-10">
                  <motion.div 
                    className={`p-4 rounded-xl ${option.color} transition-all duration-300`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    animate={{ 
                      scale: hoveredOption === option.id ? [1, 1.05, 1] : 1,
                      rotate: hoveredOption === option.id ? [0, 5, 0, -5, 0] : 0
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: hoveredOption === option.id ? Infinity : 0,
                      repeatType: "loop"
                    }}
                  >
                    <Icon className={`w-8 h-8 ${option.textColor}`} />
                  </motion.div>
                  <div>
                    <motion.h2 
                      className={`text-xl font-semibold ${option.textColor} mb-2`}
                      animate={{ 
                        x: hoveredOption === option.id ? [0, 5, 0] : 0 
                      }}
                      transition={{ 
                        duration: 0.5, 
                        ease: "easeInOut" 
                      }}
                    >
                      {option.title}
                    </motion.h2>
                    <motion.p 
                      className="text-gray-600"
                      animate={{ 
                        opacity: hoveredOption === option.id ? [1, 0.8, 1] : 1 
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: hoveredOption === option.id ? Infinity : 0,
                        repeatType: "loop"
                      }}
                    >
                      {option.description}
                    </motion.p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </main>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}