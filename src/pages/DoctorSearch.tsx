import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Navigation2, ChevronDown, ArrowLeft, ThumbsUp } from 'lucide-react';
import { mockDoctors } from '../data/mockDoctors';
import { specialties } from '../data/specialties';
import DoctorProfile from '../components/DoctorProfile';
import Map, { Marker, Popup, NavigationControl, GeolocateControl, ViewState } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Doctor } from '../types';

const MAPBOX_TOKEN = 'pk.eyJ1IjoianVsaWVuYmFrYWxhIiwiYSI6ImNrb29nZzZ3ODAydGoyb3N0azFqeXJ4NG0ifQ.u23hDthOruKzsnMlZ5UgbQ';

const availableLanguages = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' }
];

export default function DoctorSearch() {
  const navigate = useNavigate();
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [popupInfo, setPopupInfo] = useState<Doctor | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 2.3522,
    latitude: 48.8566,
    zoom: 13,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  const mapRef = useRef(null);

  const popularSpecialties = specialties.filter(s => s.popular);
  const otherSpecialties = specialties.filter(s => !s.popular);

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
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  }, []);

  const handleViewStateChange = useCallback((newViewState: ViewState) => {
    setViewState(newViewState);
  }, []);

  // Generate random coordinates for doctors around the user's location
  const getDoctorCoordinates = (index: number) => {
    // Create a spiral pattern around the center
    const angle = index * 0.5;
    const radius = 0.002 + (index * 0.0005);
    
    return {
      longitude: viewState.longitude + (radius * Math.cos(angle)),
      latitude: viewState.latitude + (radius * Math.sin(angle))
    };
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Map Container */}
      <div className="flex-1 relative">
        <Map
          ref={mapRef}
          {...viewState}
          onMove={evt => handleViewStateChange(evt.viewState)}
          mapStyle="mapbox://styles/julienbakala/ckoogz6w01ukr17o5ezqj1x89"
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          attributionControl={true}
          reuseMaps
        >
          <GeolocateControl position="top-right" />
          <NavigationControl position="top-right" />
          
          {/* Doctor Markers */}
          {filteredDoctors.map((doctor, index) => {
            const coordinates = getDoctorCoordinates(index);
            return (
              <Marker
                key={doctor.id}
                longitude={coordinates.longitude}
                latitude={coordinates.latitude}
                anchor="bottom"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setPopupInfo(doctor);
                }}
              >
                <div 
                  className={`p-2 rounded-full bg-white shadow-md transition-all ${
                    selectedDoctor?.id === doctor.id 
                      ? 'ring-2 ring-mybakup-coral scale-110' 
                      : 'hover:scale-110'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-mybakup-coral"></div>
                </div>
              </Marker>
            );
          })}

          {/* Popup for selected doctor */}
          {popupInfo && (
            <Popup
              anchor="top"
              longitude={getDoctorCoordinates(filteredDoctors.findIndex(d => d.id === popupInfo.id)).longitude}
              latitude={getDoctorCoordinates(filteredDoctors.findIndex(d => d.id === popupInfo.id)).latitude}
              onClose={() => setPopupInfo(null)}
              closeOnClick={false}
              className="doctor-popup"
            >
              <div className="p-2 max-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={popupInfo.imageUrl}
                    alt={popupInfo.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-mybakup-blue text-sm">{popupInfo.name}</h3>
                    <p className="text-xs text-gray-600">{popupInfo.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-mybakup-coral font-medium">{popupInfo.distance}</p>
                  {popupInfo.recommendations && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <ThumbsUp className="w-2 h-2 mr-0.5" />
                      {popupInfo.recommendations}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDoctor(popupInfo)}
                  className="w-full text-center py-1 px-2 bg-mybakup-coral text-white text-xs rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Voir le profil
                </button>
              </div>
            </Popup>
          )}
        </Map>

        {/* Search Fields */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="max-w-xl mx-auto space-y-2">
            {/* Specialty and Language Dropdowns */}
            <div className="flex">
              {/* Specialty Dropdown */}
              <div className="relative flex-1 dropdown-container">
                <button
                  onClick={() => {
                    setShowSpecialtyDropdown(!showSpecialtyDropdown);
                    setShowLanguageDropdown(false);
                  }}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-l-xl border-r-0 text-left flex items-center justify-between shadow-lg"
                >
                  <span className={selectedSpecialty ? 'text-mybakup-blue' : 'text-gray-400'}>
                    {selectedSpecialty || 'Spécialité médicale'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    showSpecialtyDropdown ? 'transform rotate-180' : ''
                  }`} />
                </button>
                
                {showSpecialtyDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {popularSpecialties.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                          Les plus consultés
                        </div>
                        {popularSpecialties.map((specialty) => (
                          <button
                            key={specialty.id}
                            onClick={() => {
                              setSelectedSpecialty(specialty.name);
                              setShowSpecialtyDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-mybakup-blue"
                          >
                            {specialty.name}
                          </button>
                        ))}
                      </>
                    )}
                    
                    {otherSpecialties.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                          Toutes les spécialités
                        </div>
                        {otherSpecialties.map((specialty) => (
                          <button
                            key={specialty.id}
                            onClick={() => {
                              setSelectedSpecialty(specialty.name);
                              setShowSpecialtyDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-mybakup-blue"
                          >
                            {specialty.name}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="w-px bg-gray-200 h-12"></div>

              {/* Language Dropdown */}
              <div className="relative flex-1 dropdown-container">
                <button
                  onClick={() => {
                    setShowLanguageDropdown(!showLanguageDropdown);
                    setShowSpecialtyDropdown(false);
                  }}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-r-xl border-l-0 text-left flex items-center justify-between shadow-lg"
                >
                  <span className={selectedLanguage ? 'text-mybakup-blue' : 'text-gray-400'}>
                    {selectedLanguage || 'Langue parlée'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    showLanguageDropdown ? 'transform rotate-180' : ''
                  }`} />
                </button>

                {showLanguageDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {availableLanguages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          setSelectedLanguage(language.name);
                          setShowLanguageDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-mybakup-blue">{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Address Search */}
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Adresse"
                className="w-full h-12 pl-10 pr-24 bg-white border border-gray-200 rounded-xl text-mybakup-blue focus:outline-none focus:border-mybakup-coral shadow-lg"
              />
              <Search className="absolute left-3 w-5 h-5 text-gray-400" />
              <div className="absolute right-3 flex items-center gap-2">
                <button
                  onClick={() => {
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
                        (error) => console.error('Error getting location:', error)
                      );
                    }
                  }}
                  className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <Navigation2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div 
        className={`bg-white rounded-t-[2rem] shadow-lg transition-all duration-300 ease-in-out ${
          isListExpanded ? 'h-[70vh]' : 'h-auto'
        }`}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3" />
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigate('/')} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">Médecins à proximité</h2>
            <button 
              onClick={() => setIsListExpanded(!isListExpanded)}
              className="text-mybakup-coral hover:text-mybakup-coral/80 transition-colors px-4 py-2 bg-red-50 rounded-full"
            >
              {isListExpanded ? 'Voir carte' : 'Voir liste'}
            </button>
          </div>

          {/* Doctor List */}
          {isListExpanded ? (
            <div className="space-y-4 overflow-y-auto max-h-[calc(70vh-8rem)]">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
                    selectedDoctor?.id === doctor.id 
                      ? 'border-2 border-mybakup-coral' 
                      : 'border border-gray-100 hover:border-mybakup-coral'
                  } cursor-pointer`}
                >
                  <div className="p-4">
                    <div className="flex items-center">
                      <img
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-mybakup-blue">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Parle : {doctor.languages.join(', ')}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {doctor.recommendations && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                              <ThumbsUp className="w-3 h-3 mr-0.5" />
                              {doctor.recommendations} recommandations
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <span className="text-sm text-mybakup-coral font-medium">€{doctor.consultationPrice}</span>
                            <span className="text-xs text-gray-500 ml-1">/ consultation</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDoctor(doctor);
                            }}
                            className="px-4 py-2 bg-mybakup-coral text-white text-sm rounded-lg hover:bg-opacity-90 transition-colors"
                          >
                            Voir le profil
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`flex-shrink-0 w-72 bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
                    selectedDoctor?.id === doctor.id 
                      ? 'border-2 border-mybakup-coral shadow-md' 
                      : 'border border-gray-100 hover:border-mybakup-coral'
                  } cursor-pointer`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="p-4">
                    <div className="flex items-center">
                      <img
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-mybakup-blue">{doctor.name}</h3>
                          {doctor.recommendations && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                              <ThumbsUp className="w-2 h-2 mr-0.5" />
                              {doctor.recommendations}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {doctor.distance}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-mybakup-coral font-medium">€{doctor.consultationPrice}</span>
                        <span className="text-xs text-gray-500 ml-1">/ consultation</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(doctor);
                        }}
                        className="px-4 py-2 bg-mybakup-coral text-white text-sm rounded-lg hover:bg-opacity-90 transition-colors"
                      >
                        Voir le profil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <DoctorProfile 
          doctor={selectedDoctor} 
          onClose={() => setSelectedDoctor(null)} 
        />
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