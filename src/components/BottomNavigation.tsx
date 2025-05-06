import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Mic, Calendar, MapPin } from 'lucide-react';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Only show the bottom navigation on the home page
  if (location.pathname !== '/') {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Search, label: 'Recherche', path: '/search' },
    { icon: Calendar, label: 'Rendez-vous', path: '/appointments' },
    { icon: MapPin, label: 'Destination', path: '/travel-guide' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 animate-slide-up">
      <div className="max-w-md mx-auto relative flex justify-between items-center px-2">
        {/* Center Assistant Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5">
          <button
            onClick={() => navigate('/voice-command-v2')}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-lg"
          >
            <Mic className="w-5 h-5 text-white" />
          </button>
        </div>

        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center px-2 py-1 w-full"
          >
            <div className={`p-1 ${
              isActive(item.path) 
                ? 'text-mybakup-coral'
                : 'text-gray-500'
            }`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs ${
              isActive(item.path) 
                ? 'text-mybakup-coral font-medium' 
                : 'text-gray-500'
            }`}>
              {item.label}
            </span>
          </button>
        ))}

        {/* Empty space for center button */}
        <div className="w-full flex justify-center">
          <div className="w-12"></div>
        </div>

        {navItems.slice(2, 4).map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center px-2 py-1 w-full"
          >
            <div className={`p-1 ${
              isActive(item.path) 
                ? 'text-mybakup-coral'
                : 'text-gray-500'
            }`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs ${
              isActive(item.path) 
                ? 'text-mybakup-coral font-medium' 
                : 'text-gray-500'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}