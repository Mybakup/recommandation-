import { Shield, MapPin } from 'lucide-react';

interface MainAction {
  icon: typeof Shield | typeof MapPin;
  title: string;
  description: string;
  path: string;
  color: string;
  textColor: string;
  borderColor: string;
}

export const mainActions: MainAction[] = [
  {
    icon: Shield,
    title: 'Assurer mon voyage',
    description: 'Souscrivez une assurance voyage en quelques clics',
    path: '/insurance',
    color: 'bg-[#f8f9ff]',
    textColor: 'text-[#47559E]',
    borderColor: 'border-[#47559E]'
  },
  {
    icon: MapPin,
    title: 'Trouver un praticien',
    description: 'Trouvez un médecin près de chez vous',
    path: '/search',
    color: 'bg-[#fff5f2]',
    textColor: 'text-[#ff3c00]',
    borderColor: 'border-[#ff3c00]'
  }
];