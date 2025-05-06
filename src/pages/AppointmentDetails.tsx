import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CreditCard,
  MessageCircle,
  Check,
  X,
  AlertCircle,
  Building2,
  Home,
  AppleIcon,
  Lock
} from 'lucide-react';
import DelayNotificationModal from '../components/DelayNotificationModal';

// Mock appointment data - In a real app, this would come from an API
const mockAppointment = {
  id: '1',
  status: 'confirmed',
  doctor: {
    name: 'Dr Sarah Chen',
    specialty: 'Généraliste',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    phone: '+33 1 23 45 67 89',
    email: 'dr.chen@medical.com',
    coordinates: {
      latitude: 48.8566,
      longitude: 2.3522
    }
  },
  date: '15 avril 2024',
  time: '14:30',
  location: {
    type: 'Cabinet',
    address: '123 Medical Center',
    city: 'Paris',
    postalCode: '75008',
    coordinates: {
      latitude: 48.8566,
      longitude: 2.3522
    }
  },
  patient: {
    name: 'John Doe',
    phone: '+33 6 12 34 56 78',
    email: 'john.doe@email.com',
    age: 35,
    gender: 'Homme'
  },
  price: 60,
  paymentStatus: 'pending',
  consultationType: 'Cabinet',
  notes: 'Première consultation pour un bilan général.'
};

export default function AppointmentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay' | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-600 border-red-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-5 h-5" />;
      case 'cancelled':
        return <X className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const handleDelayConfirm = (delayMinutes: number) => {
    // Here you would typically make an API call to notify the practitioner
    alert(`Le praticien a été informé de votre retard de ${delayMinutes} minutes.`);
  };

  const openInGoogleMaps = () => {
    const { address, city, postalCode } = mockAppointment.location;
    const query = encodeURIComponent(`${address}, ${postalCode} ${city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Close modal after showing success message
      setTimeout(() => {
        setShowPaymentModal(false);
        // In a real app, you would update the appointment status
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/appointments')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-mybakup-blue" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-mybakup-blue">
              Détails du rendez-vous
            </h1>
          </div>
          <div className={`px-4 py-2 rounded-full border ${getStatusColor(mockAppointment.status)} flex items-center gap-2`}>
            {getStatusIcon(mockAppointment.status)}
            <span>{getStatusText(mockAppointment.status)}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Doctor Info */}
        <section className="bg-white rounded-xl p-6">
          <div className="flex items-center gap-4">
            <img
              src={mockAppointment.doctor.imageUrl}
              alt={mockAppointment.doctor.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h2 className="font-semibold text-mybakup-blue">
                {mockAppointment.doctor.name}
              </h2>
              <p className="text-gray-600">{mockAppointment.doctor.specialty}</p>
            </div>
          </div>
        </section>

        {/* Patient Info */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-mybakup-blue flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient
          </h3>
          <div className="space-y-2">
            <p className="text-mybakup-blue font-medium">{mockAppointment.patient.name}</p>
            <p className="text-gray-600">{mockAppointment.patient.age} ans • {mockAppointment.patient.gender}</p>
            <p className="text-gray-600">{mockAppointment.patient.phone}</p>
            <p className="text-gray-600">{mockAppointment.patient.email}</p>
          </div>
        </section>

        {/* Appointment Info */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-mybakup-blue">Informations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-mybakup-blue">{mockAppointment.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Heure</p>
                <p className="text-mybakup-blue">{mockAppointment.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {mockAppointment.consultationType === 'Cabinet' ? (
                <Building2 className="w-5 h-5 text-gray-400" />
              ) : (
                <Home className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm text-gray-500">Type de consultation</p>
                <p className="text-mybakup-blue">{mockAppointment.consultationType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Tarif consultation</p>
                <p className="text-mybakup-blue">{mockAppointment.price}€</p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Section */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-mybakup-blue flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Paiement
          </h3>
          
          {paymentSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-700">Paiement effectué avec succès</p>
                <p className="text-sm text-green-600 mt-1">
                  Votre paiement de {mockAppointment.price}€ a été traité. Vous recevrez une confirmation par email.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-700">Paiement requis</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Pour confirmer votre rendez-vous, veuillez procéder au paiement de {mockAppointment.price}€.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-3 bg-mybakup-coral text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>Payer maintenant</span>
              </button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Paiement sécurisé</span>
              </div>
            </>
          )}
        </section>

        {/* Location */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-mybakup-blue flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localisation
          </h3>
          <div className="space-y-2">
            <button
              onClick={openInGoogleMaps}
              className="text-left hover:text-mybakup-coral transition-colors"
            >
              <p className="text-mybakup-blue hover:underline">
                {mockAppointment.location.address}
              </p>
              <p className="text-gray-600 hover:text-mybakup-coral">
                {mockAppointment.location.postalCode} {mockAppointment.location.city}
              </p>
            </button>
          </div>
          <div className="h-48 rounded-xl overflow-hidden mt-4">
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${mockAppointment.location.coordinates.longitude - 0.002}%2C${mockAppointment.location.coordinates.latitude - 0.002}%2C${mockAppointment.location.coordinates.longitude + 0.002}%2C${mockAppointment.location.coordinates.latitude + 0.002}&layer=mapnik&marker=${mockAppointment.location.coordinates.latitude}%2C${mockAppointment.location.coordinates.longitude}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Location map"
            />
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-mybakup-blue">Contact</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <a href={`tel:${mockAppointment.doctor.phone}`} className="text-mybakup-blue hover:underline">
                {mockAppointment.doctor.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <a href={`mailto:${mockAppointment.doctor.email}`} className="text-mybakup-blue hover:underline">
                {mockAppointment.doctor.email}
              </a>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-mybakup-blue">Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-5 h-5 text-mybakup-coral" />
              <span className="text-gray-700">Message</span>
            </button>
            <button 
              onClick={() => setShowDelayModal(true)}
              className="flex items-center justify-center gap-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <AlertCircle className="w-5 h-5 text-mybakup-coral" />
              <span className="text-gray-700">Annoncer un retard</span>
            </button>
          </div>
        </section>

        {/* Notes */}
        <section className="bg-white rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-mybakup-blue">Notes</h3>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600">{mockAppointment.notes}</p>
          </div>
        </section>

        {/* Cancel Button */}
        {mockAppointment.status !== 'cancelled' && (
          <button 
            className="w-full py-3 text-red-500 font-medium hover:underline"
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
                navigate('/appointments');
              }
            }}
          >
            Annuler le rendez-vous
          </button>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-mybakup-blue">
                  Paiement de la consultation
                </h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-semibold text-mybakup-blue mb-2">
                    Paiement réussi !
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Votre rendez-vous est maintenant confirmé.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Montant à payer</span>
                      <span className="text-xl font-semibold text-mybakup-blue">{mockAppointment.price}€</span>
                    </div>
                    
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-colors flex items-center justify-center gap-2 ${
                          paymentMethod === 'card' 
                            ? 'border-mybakup-coral bg-mybakup-coral/5' 
                            : 'border-gray-200'
                        }`}
                      >
                        <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-mybakup-coral' : 'text-gray-500'}`} />
                        <span className={paymentMethod === 'card' ? 'text-mybakup-coral' : 'text-gray-700'}>
                          Carte bancaire
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setPaymentMethod('apple-pay')}
                        className={`flex-1 py-3 rounded-xl border-2 transition-colors flex items-center justify-center gap-2 ${
                          paymentMethod === 'apple-pay' 
                            ? 'border-mybakup-coral bg-mybakup-coral/5' 
                            : 'border-gray-200'
                        }`}
                      >
                        <AppleIcon className={`w-5 h-5 ${paymentMethod === 'apple-pay' ? 'text-mybakup-coral' : 'text-gray-500'}`} />
                        <span className={paymentMethod === 'apple-pay' ? 'text-mybakup-coral' : 'text-gray-700'}>
                          Apple Pay
                        </span>
                      </button>
                    </div>
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro de carte
                        </label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom sur la carte
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date d'expiration
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: formatExpiryDate(e.target.value)})}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvc}
                            onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value.replace(/\D/g, '')})}
                            placeholder="123"
                            maxLength={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                            required
                          />
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-3 bg-mybakup-coral text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Traitement en cours...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            <span>Payer {mockAppointment.price}€</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                  
                  {paymentMethod === 'apple-pay' && (
                    <div className="space-y-6">
                      <button
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing}
                        className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Traitement en cours...</span>
                          </>
                        ) : (
                          <>
                            <AppleIcon className="w-5 h-5" />
                            <span>Payer avec Apple Pay</span>
                          </>
                        )}
                      </button>
                      
                      <p className="text-xs text-center text-gray-500">
                        En cliquant sur "Payer avec Apple Pay", vous serez redirigé vers Apple Pay pour finaliser votre paiement de manière sécurisée.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center mt-6 gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Paiement sécurisé via Stripe</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <DelayNotificationModal
        isOpen={showDelayModal}
        onClose={() => setShowDelayModal(false)}
        onConfirm={handleDelayConfirm}
      />
    </div>
  );
}