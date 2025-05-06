import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Calendar, Users, ArrowRight, Download, MessageSquare, Phone, MapPin, CreditCard, Info } from 'lucide-react';

export default function InsuranceConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const insuranceData = location.state || {
    plan: { name: 'Assurance voyage', price: 0 },
    dates: { start: new Date().toISOString(), end: new Date().toISOString() },
    travelers: [{ firstName: 'Utilisateur', lastName: 'MyBakup' }],
    totalPrice: 0,
    isExpat: false
  };

  // Génération d'un numéro de police fictif
  const policyNumber = `MYB-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-mybakup-blue">
            Confirmation
          </h1>
          <div className="p-2 rounded-xl bg-[#EDF5FF]">
            <Shield className="w-6 h-6 text-mybakup-blue" />
          </div>
        </div>
      </header>

      <motion.main 
        className="max-w-3xl mx-auto px-4 py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Success Message */}
        <motion.div 
          className="bg-white rounded-xl p-6 text-center space-y-4 shadow-sm border border-gray-100"
          variants={itemVariants}
        >
          <div className="flex justify-center">
            <motion.div 
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
          </div>
          <h2 className="text-xl font-semibold text-mybakup-blue">
            Votre assurance a été souscrite avec succès !
          </h2>
          <p className="text-gray-600">
            Votre numéro de police est <span className="font-medium text-mybakup-blue">{policyNumber}</span>
          </p>
          <p className="text-gray-600">
            Un email de confirmation a été envoyé à votre adresse email avec tous les détails de votre assurance.
          </p>
        </motion.div>

        {/* Insurance Details */}
        <motion.div 
          className="bg-white rounded-xl p-6 space-y-6 border border-gray-100 shadow-sm"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-mybakup-coral" />
            <div>
              <h3 className="font-semibold text-mybakup-blue">
                {insuranceData.plan.name}
              </h3>
              <p className="text-sm text-gray-600">
                Police n° {policyNumber}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Période</span>
              </div>
              <span className="text-mybakup-blue">
                {new Date(insuranceData.dates.start).toLocaleDateString()} 
                {insuranceData.dates.end && ` - ${new Date(insuranceData.dates.end).toLocaleDateString()}`}
              </span>
            </div>
            
            <div className="flex justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Assurés</span>
              </div>
              <span className="text-mybakup-blue">{insuranceData.travelers.length} personne(s)</span>
            </div>
            
            <div className="flex justify-between font-medium">
              <span className="text-gray-800">
                {insuranceData.isExpat ? 'Montant mensuel' : 'Montant total'}
              </span>
              <span className="text-xl text-mybakup-coral">{insuranceData.totalPrice.toFixed(2)}€</span>
            </div>
          </div>
        </motion.div>

        {/* Coverage Details */}
        <motion.div 
          className="bg-white rounded-xl p-6 space-y-4 border border-gray-100 shadow-sm"
          variants={itemVariants}
        >
          <h3 className="font-semibold text-mybakup-blue flex items-center gap-2">
            <Shield className="w-5 h-5 text-mybakup-coral" />
            Couverture principale
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-green-100 mt-0.5">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Frais médicaux</p>
                <p className="text-sm text-gray-600">
                  {insuranceData.isExpat 
                    ? "Jusqu'à 1 000 000€ de prise en charge" 
                    : "Jusqu'à 150 000€ de prise en charge"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-green-100 mt-0.5">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Assistance rapatriement</p>
                <p className="text-sm text-gray-600">Prise en charge à 100% des frais réels</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-full bg-green-100 mt-0.5">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Assistance 24/7</p>
                <p className="text-sm text-gray-600">Support multilingue disponible à tout moment</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map Coverage */}
        <motion.div 
          className="bg-white rounded-xl p-6 space-y-4 border border-gray-100 shadow-sm"
          variants={itemVariants}
        >
          <h3 className="font-semibold text-mybakup-blue flex items-center gap-2">
            <MapPin className="w-5 h-5 text-mybakup-coral" />
            Zone de couverture
          </h3>
          
          <div className="h-48 rounded-xl overflow-hidden bg-gray-100 relative">
            <img 
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
              alt="World map"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-4 text-white">
                <p className="font-medium">Couverture mondiale</p>
                <p className="text-sm text-white/80">Protection dans plus de 190 pays</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          className="bg-white rounded-xl p-6 space-y-4 border border-gray-100 shadow-sm"
          variants={itemVariants}
        >
          <h3 className="font-semibold text-mybakup-blue flex items-center gap-2">
            <Phone className="w-5 h-5 text-mybakup-coral" />
            Besoin d'aide ?
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#EDF5FF] text-mybakup-blue">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-mybakup-blue">Assistance 24/7</p>
              <a href="tel:+33123456789" className="text-gray-600 hover:underline">
                +33 1 23 45 67 89
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FFE8E8] text-mybakup-coral">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-mybakup-blue">Chat avec un conseiller</p>
              <button 
                onClick={() => navigate('/chat-advisor')}
                className="text-gray-600 hover:underline"
              >
                Démarrer une conversation
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Notre équipe d'assistance est disponible 24h/24 et 7j/7 pour vous aider en cas d'urgence pendant votre voyage.
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Simulation de téléchargement
              alert('Le téléchargement de votre attestation d\'assurance va commencer...');
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-mybakup-blue text-white rounded-xl hover:bg-opacity-90 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Télécharger mon attestation</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/chat-advisor')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-mybakup-coral text-mybakup-coral rounded-xl hover:bg-mybakup-coral/5 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Contacter un conseiller</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-mybakup-coral text-white rounded-xl hover:bg-opacity-90 transition-colors"
          >
            <span>Retour à l'accueil</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.main>
    </div>
  );
}