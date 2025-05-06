import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Map, { Marker, Popup, NavigationControl, GeolocateControl, ViewState } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Pill, 
  MapPin, 
  Navigation2, 
  Clock, 
  Phone, 
  CreditCard, 
  Truck, 
  Star, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Filter,
  Loader2,
  Lock,
  AppleIcon
} from 'lucide-react';
import { medications } from '../data/medications';
import { pharmacies, medicationAvailability } from '../data/pharmacies';
import { searchMedications } from '../utils/searchMedications';
import type { SearchResult, Pharmacy, MedicationAvailability } from '../types/medications';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianVsaWVuYmFrYWxhIiwiYSI6ImNrb29nZzZ3ODAydGoyb3N0azFqeXJ4NG0ifQ.u23hDthOruKzsnMlZ5UgbQ';

const examples = [
  "Paracétamol",
  "Tylenol",
  "Ibuprofen",
  "Ventolin"
];

export default function MedicationLocator() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentExample, setCurrentExample] = useState(0);
  const [selectedMedication, setSelectedMedication] = useState<SearchResult | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [availablePharmacies, setAvailablePharmacies] = useState<{
    pharmacy: Pharmacy;
    availability: MedicationAvailability;
  }[]>([]);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 13,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  const [popupInfo, setPopupInfo] = useState<Pharmacy | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    hasDelivery: false,
    openNow: false,
    minRating: 0
  });
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState<'standard' | 'express'>('standard');
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
  const [orderPlaced, setOrderPlaced] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState(prev => ({
            ...prev,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            zoom: 13
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const searchResults = searchMedications(query, medications);
    setResults(searchResults);
    setSelectedMedication(null);
    setAvailablePharmacies([]);
    setSelectedPharmacy(null);
  };

  const handleMedicationSelect = (medication: SearchResult) => {
    setSelectedMedication(medication);
    
    // Find pharmacies that have this medication
    const medicationId = medication.medication.genericEn.toLowerCase().replace(/\s+/g, '-');
    const availabilities = medicationAvailability.filter(
      avail => avail.medicationId.toLowerCase() === medicationId && avail.inStock
    );
    
    const pharmaciesWithMedication = availabilities.map(avail => {
      const pharmacy = pharmacies.find(p => p.id === avail.pharmacyId);
      return {
        pharmacy: pharmacy!,
        availability: avail
      };
    }).filter(item => {
      if (filters.hasDelivery && !item.pharmacy.hasDelivery) return false;
      if (filters.minRating > 0 && item.pharmacy.rating < filters.minRating) return false;
      // TODO: Add open now filter logic
      return true;
    }).sort((a, b) => {
      // Sort by price
      return a.availability.price - b.availability.price;
    });
    
    setAvailablePharmacies(pharmaciesWithMedication);
    
    // Update map view to show all pharmacies
    if (pharmaciesWithMedication.length > 0) {
      // Center map on first pharmacy
      setViewState(prev => ({
        ...prev,
        longitude: pharmaciesWithMedication[0].pharmacy.coordinates.longitude,
        latitude: pharmaciesWithMedication[0].pharmacy.coordinates.latitude,
        zoom: 13
      }));
    }
  };

  const handlePharmacySelect = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    
    // Center map on selected pharmacy
    setViewState(prev => ({
      ...prev,
      longitude: pharmacy.coordinates.longitude,
      latitude: pharmacy.coordinates.latitude,
      zoom: 15
    }));
  };

  const handleDeliveryRequest = () => {
    setShowDeliveryOptions(true);
  };

  const handlePlaceOrder = () => {
    if (deliveryAddress.trim() === '') {
      alert('Veuillez entrer une adresse de livraison');
      return;
    }
    
    setShowPaymentModal(true);
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
        setOrderPlaced(true);
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

  const calculateTotalPrice = () => {
    if (!selectedMedication || !selectedPharmacy) return 0;
    
    const medicationId = selectedMedication.medication.genericEn.toLowerCase().replace(/\s+/g, '-');
    const availability = medicationAvailability.find(
      avail => avail.medicationId.toLowerCase() === medicationId && avail.pharmacyId === selectedPharmacy.id
    );
    
    if (!availability) return 0;
    
    let total = availability.price;
    
    // Add delivery fee if applicable
    if (showDeliveryOptions && selectedPharmacy.hasDelivery) {
      total += selectedPharmacy.deliveryFee;
      
      // Add express delivery fee
      if (deliveryTime === 'express') {
        total += 5; // Extra fee for express delivery
      }
    }
    
    return total;
  };

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
              Localisation de médicaments
            </h1>
          </div>
          <div className="p-2 rounded-xl bg-[#FFE8E8]">
            <Pill className="w-6 h-6 text-mybakup-coral" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={`Rechercher "${examples[currentExample]}"`}
                className="w-full h-12 pl-12 pr-12 bg-white border border-gray-200 rounded-xl text-mybakup-blue focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Recherchez par nom français, anglais ou marque commerciale
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm overflow-hidden"
          >
            <h3 className="font-semibold text-mybakup-blue mb-4">Filtres</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasDelivery}
                  onChange={(e) => setFilters({...filters, hasDelivery: e.target.checked})}
                  className="rounded text-mybakup-coral focus:ring-mybakup-coral"
                />
                <span className="text-gray-700">Livraison disponible</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={(e) => setFilters({...filters, openNow: e.target.checked})}
                  className="rounded text-mybakup-coral focus:ring-mybakup-coral"
                />
                <span className="text-gray-700">Ouvert maintenant</span>
              </label>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note minimale
                </label>
                <div className="flex items-center gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters({...filters, minRating: rating})}
                      className={`px-3 py-1 rounded-lg border transition-colors ${
                        filters.minRating === rating
                          ? 'border-mybakup-coral bg-mybakup-coral/5 text-mybakup-coral'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {rating === 0 ? 'Tous' : rating}
                      {rating > 0 && <Star className="w-3 h-3 inline ml-1" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {results.length > 0 && !selectedMedication && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-mybakup-blue">
              {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
            </h2>
            <div className="grid gap-4">
              {results.map((result, index) => (
                <motion.div
                  key={`${result.medication.genericFr}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleMedicationSelect(result)}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#FFE8E8] text-mybakup-coral">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-mybakup-blue">
                        {result.matchType === 'genericFr' 
                          ? result.medication.genericFr 
                          : result.matchType === 'genericEn' 
                            ? result.medication.genericEn 
                            : result.medication.brandNameEn}
                      </h3>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Nom français</p>
                          <p className={`text-sm ${result.matchType === 'genericFr' ? 'text-mybakup-coral font-medium' : 'text-gray-700'}`}>
                            {result.medication.genericFr}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Nom anglais</p>
                          <p className={`text-sm ${result.matchType === 'genericEn' ? 'text-mybakup-coral font-medium' : 'text-gray-700'}`}>
                            {result.medication.genericEn}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Marque commerciale</p>
                        <p className={`text-sm ${result.matchType === 'brandNameEn' ? 'text-mybakup-coral font-medium' : 'text-gray-700'}`}>
                          {result.medication.brandNameEn}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Indication</p>
                        <p className="text-sm text-gray-700">{result.medication.indication}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Medication with Pharmacies */}
        {selectedMedication && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedMedication(null);
                  setAvailablePharmacies([]);
                  setSelectedPharmacy(null);
                }}
                className="flex items-center gap-2 text-mybakup-blue hover:text-mybakup-coral transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Retour aux résultats</span>
              </button>
              <span className="text-sm text-gray-500">
                {availablePharmacies.length} pharmacie{availablePharmacies.length !== 1 ? 's' : ''} disponible{availablePharmacies.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Medication Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#FFE8E8] text-mybakup-coral">
                  <Pill className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-mybakup-blue text-lg">
                    {selectedMedication.medication.genericFr}
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Nom français</p>
                      <p className="text-sm text-gray-700">
                        {selectedMedication.medication.genericFr}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nom anglais</p>
                      <p className="text-sm text-gray-700">
                        {selectedMedication.medication.genericEn}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Marque commerciale</p>
                    <p className="text-sm text-gray-700">
                      {selectedMedication.medication.brandNameEn}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Indication</p>
                    <p className="text-sm text-gray-700">{selectedMedication.medication.indication}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            {availablePharmacies.length > 0 && (
              <div className="h-64 rounded-xl overflow-hidden shadow-sm">
                <Map
                  ref={mapRef}
                  {...viewState}
                  onMove={evt => setViewState(evt.viewState)}
                  mapStyle="mapbox://styles/julienbakala/ckoogz6w01ukr17o5ezqj1x89"
                  mapboxAccessToken={MAPBOX_TOKEN}
                  style={{ width: '100%', height: '100%' }}
                  attributionControl={true}
                  reuseMaps
                >
                  <GeolocateControl position="top-right" />
                  <NavigationControl position="top-right" />
                  
                  {/* Pharmacy Markers */}
                  {availablePharmacies.map(({ pharmacy }) => (
                    <Marker
                      key={pharmacy.id}
                      longitude={pharmacy.coordinates.longitude}
                      latitude={pharmacy.coordinates.latitude}
                      anchor="bottom"
                      onClick={e => {
                        e.originalEvent.stopPropagation();
                        setPopupInfo(pharmacy);
                      }}
                    >
                      <div 
                        className={`p-2 rounded-full bg-white shadow-md transition-all ${
                          selectedPharmacy?.id === pharmacy.id 
                            ? 'ring-2 ring-mybakup-coral scale-110' 
                            : 'hover:scale-110'
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full bg-mybakup-coral"></div>
                      </div>
                    </Marker>
                  ))}

                  {/* Popup for selected pharmacy */}
                  {popupInfo && (
                    <Popup
                      anchor="top"
                      longitude={popupInfo.coordinates.longitude}
                      latitude={popupInfo.coordinates.latitude}
                      onClose={() => setPopupInfo(null)}
                      closeOnClick={false}
                      className="pharmacy-popup"
                    >
                      <div className="p-2 max-w-[200px]">
                        <h3 className="font-medium text-mybakup-blue text-sm">{popupInfo.name}</h3>
                        <p className="text-xs text-gray-600">{popupInfo.address}</p>
                        <p className="text-xs text-mybakup-coral font-medium mb-2">{popupInfo.distance}</p>
                        <button
                          onClick={() => {
                            handlePharmacySelect(popupInfo);
                            setPopupInfo(null);
                          }}
                          className="w-full text-center py-1 px-2 bg-mybakup-coral text-white text-xs rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                          Sélectionner
                        </button>
                      </div>
                    </Popup>
                  )}
                </Map>
              </div>
            )}

            {/* Pharmacies List */}
            {availablePharmacies.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-mybakup-blue">
                  Pharmacies disponibles
                </h3>
                <div className="space-y-4">
                  {availablePharmacies.map(({ pharmacy, availability }) => (
                    <motion.div
                      key={pharmacy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handlePharmacySelect(pharmacy)}
                      className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border ${
                        selectedPharmacy?.id === pharmacy.id 
                          ? 'border-mybakup-coral' 
                          : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={pharmacy.imageUrl}
                          alt={pharmacy.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-mybakup-blue">{pharmacy.name}</h4>
                              <p className="text-sm text-gray-600">{pharmacy.address}, {pharmacy.city}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="ml-1 text-sm text-gray-600">{pharmacy.rating}</span>
                                </div>
                                <span className="text-sm text-gray-600">{pharmacy.distance}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-mybakup-coral">{availability.price.toFixed(2)}€</p>
                              <p className="text-xs text-gray-500">En stock: {availability.stockQuantity}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {pharmacy.hasDelivery && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Truck className="w-3 h-3 mr-1" />
                                Livraison {pharmacy.deliveryTime}
                              </span>
                            )}
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Ouvert aujourd'hui
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-500">Aucune pharmacie trouvée pour ce médicament</p>
              </div>
            )}
          </div>
        )}

        {/* Selected Pharmacy Details */}
        {selectedPharmacy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-mybakup-blue text-lg">Détails de la pharmacie</h3>
              <button
                onClick={() => setSelectedPharmacy(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-start gap-4">
              <img
                src={selectedPharmacy.imageUrl}
                alt={selectedPharmacy.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-mybakup-blue">{selectedPharmacy.name}</h4>
                <p className="text-sm text-gray-600">{selectedPharmacy.address}, {selectedPharmacy.city}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{selectedPharmacy.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">{selectedPharmacy.distance}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedPharmacy.hasDelivery && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Truck className="w-3 h-3 mr-1" />
                      Livraison {selectedPharmacy.deliveryTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Opening Hours */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-mybakup-blue">Horaires d'ouverture</h4>
                <button
                  onClick={() => document.getElementById('hours-collapse')?.classList.toggle('hidden')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              <div id="hours-collapse" className="hidden">
                <div className="space-y-1 text-sm">
                  {selectedPharmacy.openingHours.map((hour) => (
                    <div key={hour.day} className="flex justify-between">
                      <span className="text-gray-600">{hour.day}</span>
                      <span className="text-mybakup-blue font-medium">{hour.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Contact */}
            <div className="mt-4">
              <h4 className="font-medium text-mybakup-blue mb-2">Contact</h4>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${selectedPharmacy.phone}`} className="text-mybakup-blue hover:underline">
                  {selectedPharmacy.phone}
                </a>
              </div>
            </div>
            
            {/* Medication Price */}
            {selectedMedication && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-mybakup-blue">
                      {selectedMedication.medication.genericFr}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedMedication.medication.brandNameEn}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-mybakup-coral">
                      {calculateTotalPrice().toFixed(2)}€
                    </p>
                    {showDeliveryOptions && selectedPharmacy.hasDelivery && (
                      <p className="text-xs text-gray-500">
                        Inclut frais de livraison: {selectedPharmacy.deliveryFee}€
                        {deliveryTime === 'express' && ' + 5€ (express)'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              {selectedPharmacy.hasDelivery && !showDeliveryOptions && !orderPlaced && (
                <button
                  onClick={handleDeliveryRequest}
                  className="flex-1 py-3 bg-mybakup-coral text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                >
                  <Truck className="w-5 h-5" />
                  <span>Livraison à domicile</span>
                </button>
              )}
              
              {!showDeliveryOptions && !orderPlaced && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPharmacy.coordinates.latitude},${selectedPharmacy.coordinates.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 border border-mybakup-blue text-mybakup-blue rounded-xl font-medium hover:bg-mybakup-blue/5 transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Itinéraire</span>
                </a>
              )}
            </div>
            
            {/* Delivery Options */}
            {showDeliveryOptions && !orderPlaced && (
              <div className="mt-4 space-y-4">
                <h4 className="font-medium text-mybakup-blue">Options de livraison</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de livraison
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Entrez votre adresse complète"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mybakup-coral"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de livraison
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryTime('standard')}
                      className={`p-3 rounded-xl border-2 text-center transition-colors ${
                        deliveryTime === 'standard'
                          ? 'border-mybakup-coral bg-mybakup-coral/5 text-mybakup-coral'
                          : 'border-gray-200 hover:border-mybakup-coral'
                      }`}
                    >
                      <div className="font-medium">Standard</div>
                      <div className="text-sm opacity-80">{selectedPharmacy.deliveryTime}</div>
                      <div className="text-sm font-medium mt-1">{selectedPharmacy.deliveryFee.toFixed(2)}€</div>
                    </button>
                    <button
                      onClick={() => setDeliveryTime('express')}
                      className={`p-3 rounded-xl border-2 text-center transition-colors ${
                        deliveryTime === 'express'
                          ? 'border-mybakup-coral bg-mybakup-coral/5 text-mybakup-coral'
                          : 'border-gray-200 hover:border-mybakup-coral'
                      }`}
                    >
                      <div className="font-medium">Express</div>
                      <div className="text-sm opacity-80">15-30 min</div>
                      <div className="text-sm font-medium mt-1">{(selectedPharmacy.deliveryFee + 5).toFixed(2)}€</div>
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowDeliveryOptions(false)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3 bg-mybakup-coral text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Commander
                  </button>
                </div>
              </div>
            )}
            
            {/* Order Confirmation */}
            {orderPlaced && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">Commande confirmée</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Votre commande a été placée avec succès. Vous recevrez une confirmation par email.
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      Livraison prévue: {deliveryTime === 'express' ? '15-30 minutes' : selectedPharmacy.deliveryTime}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Introduction */}
        {!selectedMedication && results.length === 0 && (
          <div className="space-y-6">
            <div className="bg-[#EDF5FF] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-mybakup-blue mb-4">
                Comment ça marche ?
              </h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  1. Recherchez votre médicament par son nom français, anglais ou sa marque commerciale
                </p>
                <p className="text-gray-600">
                  2. Trouvez les pharmacies qui ont ce médicament en stock près de vous
                </p>
                <p className="text-gray-600">
                  3. Choisissez entre récupérer votre médicament ou vous le faire livrer
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-mybakup-blue mb-4">
                Avantages du service
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#FFE8E8] text-mybakup-coral">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-mybakup-blue">Équivalents locaux</h3>
                    <p className="text-sm text-gray-600">
                      Trouvez facilement l'équivalent local de vos médicaments habituels
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#EDF5FF] text-mybakup-blue">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-mybakup-blue">Localisation précise</h3>
                    <p className="text-sm text-gray-600">
                      Identifiez les pharmacies les plus proches ayant votre médicament en stock
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-mybakup-blue">Livraison à domicile</h3>
                    <p className="text-sm text-gray-600">
                      Faites-vous livrer vos médicaments directement à votre hôtel ou domicile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-mybakup-blue">
                  Paiement de la commande
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
                    Votre commande est en cours de préparation.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Montant à payer</span>
                      <span className="text-xl font-semibold text-mybakup-blue">{calculateTotalPrice().toFixed(2)}€</span>
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
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Traitement en cours...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5" />
                            <span>Payer {calculateTotalPrice().toFixed(2)}€</span>
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
                            <Loader2 className="w-5 h-5 animate-spin" />
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

      {/* Custom styles for Mapbox popups */}
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .mapboxgl-popup-close-button {
          font-size: 16px;
          color: #666;
          right: 8px;
          top: 8px;
        }
        .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
          border-bottom-color: white;
        }
      `}</style>
    </div>
  );
}