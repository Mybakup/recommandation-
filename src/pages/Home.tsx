import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  UserCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  X,
  Play,
  ArrowRight,
  Bell,
  Shield,
  MessageSquare,
  Info
} from 'lucide-react';
import QuickSignupModal from '../components/QuickSignupModal';
import MarshAffinity from './MarshAffinity';
import DoctorProfile from '../components/DoctorProfile';
import RatingModal from '../components/RatingModal';
import { services } from '../data/services';
import { mainActions } from '../data/mainActions';
import { useRequireAuth } from '../hooks/useRequireAuth';
import AuthModal from '../components/auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { slides } from '../data/slides';
import { nextAppointment, pastAppointments } from '../data/appointments';

interface Notification {
  id: string;
  type: 'appointment' | 'insurance' | 'message' | 'system' | 'reminder';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  link?: string;
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMarshModal, setShowMarshModal] = useState(false);
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const { showAuthModal, setShowAuthModal } = useRequireAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Rappel de rendez-vous',
      message: 'Votre rendez-vous avec Dr. Sarah Chen est demain à 14:30',
      date: new Date(),
      read: false,
      link: '/appointments/1'
    },
    {
      id: '2',
      type: 'insurance',
      title: 'Assurance voyage',
      message: 'Votre assurance voyage expire dans 5 jours',
      date: new Date(Date.now() - 86400000),
      read: true,
      link: '/insurance'
    },
    {
      id: '3',
      type: 'message',
      title: 'Nouveau message',
      message: 'Dr. Jean Dupont vous a envoyé un message',
      date: new Date(Date.now() - 172800000),
      read: false,
      link: '/chat-advisor'
    },
    {
      id: '4',
      type: 'system',
      title: 'Mise à jour de l\'application',
      message: 'Une nouvelle version de l\'application est disponible',
      date: new Date(Date.now() - 259200000),
      read: true
    },
    {
      id: '5',
      type: 'reminder',
      title: 'Rappel médical',
      message: 'N\'oubliez pas de prendre vos médicaments',
      date: new Date(Date.now() - 345600000),
      read: false
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const from = location.state?.from?.pathname || '/';

  const handleProtectedAction = (action: () => void) => {
    if (!showAuthModal) {
      action();
    }
  };

  const handleServiceClick = (service: typeof services[0]) => {
    if (service.isExternal) {
      window.open(service.path, '_blank');
    } else {
      handleProtectedAction(() => navigate(service.path));
    }
  };

  const handleRatingSubmit = (ratings: any) => {
    console.log('Ratings submitted:', ratings);
    setShowRatingModal(false);
    setSelectedAppointment(null);
  };

  const getSliderTitle = () => {
    return currentSlide >= 1 ? "Les conseils des experts" : "Votre partenaire";
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({...notif, read: true})));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, read: true} : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'insurance':
        return <Shield className="w-5 h-5 text-green-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-gray-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-mybakup-coral" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF5FF]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#EDF5FF] z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="https://i.imgur.com/jxMQcJi.png" 
              alt="MyBakup" 
              className="h-6"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5 text-[#424e6f]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-mybakup-coral text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-medium text-mybakup-blue">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-mybakup-coral hover:underline"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-mybakup-coral/5' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className={`font-medium ${!notification.read ? 'text-mybakup-blue' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                <button 
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-gray-400 hover:text-red-500 p-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500">
                                  {notification.date.toLocaleDateString()}
                                </span>
                                {notification.link && (
                                  <button 
                                    onClick={() => {
                                      markAsRead(notification.id);
                                      navigate(notification.link!);
                                      setShowNotifications(false);
                                    }}
                                    className="text-xs text-mybakup-coral hover:underline"
                                  >
                                    Voir
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucune notification
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-100 text-center">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-gray-500 hover:text-mybakup-coral"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <UserCircle className="w-5 h-5 text-[#424e6f]" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome Message */}
          {user && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#424e6f]">Bonjour, {user.firstName}</h1>
              <p className="text-gray-600 mt-2 mb-6">Comment pouvons-nous vous aider aujourd'hui ?</p>
            </div>
          )}

          {/* Main Actions */}
          <section className="mb-8">
            <div className="flex flex-row gap-4 overflow-x-auto pb-2">
              {mainActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => handleProtectedAction(() => navigate(action.path))}
                  className={`h-[140px] ${action.color} rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border ${action.borderColor} group flex flex-col justify-between flex-shrink-0 w-[calc(50%-8px)]`}
                >
                  <div className={`p-3 rounded-xl ${action.color} flex justify-center`}>
                    <action.icon className={`w-6 h-6 ${action.textColor}`} />
                  </div>
                  <div className="text-center">
                    <h3 className={`font-semibold ${action.textColor} mb-1`}>{action.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Slider Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-mybakup-coral" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="text-xl font-semibold text-[#424e6f]">{getSliderTitle()}</h2>
              </div>
            </div>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`flex-shrink-0 w-[85%] sm:w-[500px] rounded-2xl overflow-hidden transition-transform duration-500 relative group cursor-pointer snap-start ${
                      slide.path ? 'hover:opacity-90' : ''
                    }`}
                    onClick={() => {
                      if (slide.path) {
                        if (slide.isPartner) {
                          setShowMarshModal(true);
                        } else {
                          navigate(slide.path);
                        }
                      }
                    }}
                  >
                    <div className="relative h-[200px] sm:h-[240px]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                      {slide.isVideo && (
                        <>
                          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                            {slide.duration}
                          </div>
                          <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-14 sm:h-14 bg-white shadow-lg rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                            <Play className="w-5 h-5 sm:w-7 sm:h-7 text-mybakup-coral fill-current" />
                          </button>
                        </>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
                        <div className="flex items-end justify-between gap-3">
                          {/* Description à gauche */}
                          <div className="flex-1 min-w-0">
                            {slide.isPartner && (
                              <img
                                src={slide.logo}
                                alt={slide.title}
                                className="h-6 sm:h-8 mb-2 sm:mb-3 drop-shadow-md"
                              />
                            )}
                            <span className="inline-block px-2 py-1 sm:px-3 sm:py-1.5 bg-[#ff3c00] text-white text-xs sm:text-sm font-medium rounded-full shadow-sm mb-2">
                              {slide.tag}
                            </span>
                            <h3 className="text-base sm:text-xl font-bold text-white drop-shadow-sm mb-1 sm:mb-2 line-clamp-2">
                              {slide.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/95 line-clamp-2 leading-snug">
                              {slide.description}
                            </p>
                          </div>

                          {/* Informations du praticien */}
                          {slide.isVideo && (
                            <div className="flex items-center gap-2 sm:gap-3 bg-black/30 p-2 sm:p-3 rounded-lg backdrop-blur-sm flex-shrink-0">
                              <img
                                src={slide.doctorImage}
                                alt={slide.doctorName}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white/20"
                              />
                              <div className="min-w-0">
                                <p className="text-white text-sm font-medium truncate">{slide.doctorName}</p>
                                <p className="text-white/80 text-xs truncate">{slide.doctorSpecialty}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex-shrink-0 w-[85%] sm:w-[500px] rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-6 snap-start">
                  <button
                    onClick={() => navigate('/health-tips')}
                    className="flex items-center gap-2 text-mybakup-coral hover:text-mybakup-coral/80 transition-colors"
                  >
                    <span className="font-medium">Voir plus de conseils santé</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-[#ff3c00] w-4' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-mybakup-coral" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor"/>
                </svg>
                <h2 className="text-xl font-semibold text-[#424e6f]">Mes services</h2>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {services.map((service, index) => (
                <div
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  className="flex-shrink-0 w-[240px] bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 group"
                >
                  <div className={`p-3 rounded-xl ${service.color} mb-3`}>
                    <service.icon className={`w-6 h-6 ${service.textColor}`} />
                  </div>
                  <h3 className="font-semibold text-[#424e6f] mb-1">{service.title}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Next Appointment */}
          <section className="mb-8">
            <div className="bg-[#FFE8E8] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#ff3c00]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h2 className="text-xl font-semibold text-[#ff3c00]">Mon prochain rendez-vous</h2>
                </div>
              </div>
              <div 
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all"
                onClick={() => setShowDoctorProfile(true)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={nextAppointment.doctor.imageUrl}
                    alt={nextAppointment.doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#424e6f]">
                      {nextAppointment.doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {nextAppointment.doctor.specialty}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{nextAppointment.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{nextAppointment.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{nextAppointment.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Past Appointments */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-[#424e6f]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.05078 11.0002C3.27441 7.55283 5.52078 4.62941 8.72078 3.54941C11.9208 2.46941 15.4341 3.51283 17.6541 6.20016C19.8741 8.8875 20.1874 12.5735 18.3874 15.5602C16.5874 18.5468 13.0874 20.1202 9.52078 19.4602C6.98745 18.9735 4.82078 17.3202 3.67078 15.0002C3.24745 14.0735 2.97078 13.0602 2.92078 12.0002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 4V8H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="text-xl font-semibold text-[#424e6f]">Historique des rendez-vous</h2>
              </div>
            </div>
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={appointment.doctor.imageUrl}
                      alt={appointment.doctor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#424e6f]">
                        {appointment.doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.doctor.specialty}
                      </p>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{appointment.date}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowRatingModal(true);
                      }}
                      className="px-4 py-2 bg-mybakup-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Noter ce praticien
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Modals */}
      <QuickSignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      />

      {showMarshModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center overflow-y-auto">
          <div className="relative w-full max-w-3xl mx-auto my-8">
            <button
              onClick={() => setShowMarshModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <MarshAffinity onClose={() => setShowMarshModal(false)} />
          </div>
        </div>
      )}

      {showDoctorProfile && (
        <DoctorProfile 
          doctor={nextAppointment.doctor} 
          onClose={() => setShowDoctorProfile(false)} 
        />
      )}

      {showRatingModal && selectedAppointment && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedAppointment(null);
          }}
          doctorName={selectedAppointment.doctor.name}
          onSubmit={handleRatingSubmit}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
}