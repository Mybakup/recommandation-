import { Pharmacy } from '../types/medications';

export const pharmacies: Pharmacy[] = [
  {
    id: 'pharm1',
    name: 'Pharmacie Centrale',
    address: '15 Rue de la Paix',
    city: 'Paris, 75002',
    distance: '0.8 km',
    coordinates: {
      latitude: 48.8698,
      longitude: 2.3322
    },
    openingHours: [
      { day: 'Lundi', hours: '8:30 - 20:00' },
      { day: 'Mardi', hours: '8:30 - 20:00' },
      { day: 'Mercredi', hours: '8:30 - 20:00' },
      { day: 'Jeudi', hours: '8:30 - 20:00' },
      { day: 'Vendredi', hours: '8:30 - 20:00' },
      { day: 'Samedi', hours: '9:00 - 19:00' },
      { day: 'Dimanche', hours: '10:00 - 13:00' }
    ],
    phone: '+33 1 42 61 25 55',
    hasDelivery: true,
    deliveryTime: '30-45 min',
    deliveryFee: 3.50,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=2669&h=1500'
  },
  {
    id: 'pharm2',
    name: 'Pharmacie Internationale',
    address: '2 Boulevard des Capucines',
    city: 'Paris, 75009',
    distance: '1.2 km',
    coordinates: {
      latitude: 48.8704,
      longitude: 2.3292
    },
    openingHours: [
      { day: 'Lundi', hours: '8:00 - 22:00' },
      { day: 'Mardi', hours: '8:00 - 22:00' },
      { day: 'Mercredi', hours: '8:00 - 22:00' },
      { day: 'Jeudi', hours: '8:00 - 22:00' },
      { day: 'Vendredi', hours: '8:00 - 22:00' },
      { day: 'Samedi', hours: '8:00 - 22:00' },
      { day: 'Dimanche', hours: '8:00 - 22:00' }
    ],
    phone: '+33 1 42 65 88 29',
    hasDelivery: true,
    deliveryTime: '20-35 min',
    deliveryFee: 0,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=2669&h=1500'
  },
  {
    id: 'pharm3',
    name: 'Pharmacie du Marais',
    address: '8 Rue des Archives',
    city: 'Paris, 75004',
    distance: '1.5 km',
    coordinates: {
      latitude: 48.8570,
      longitude: 2.3545
    },
    openingHours: [
      { day: 'Lundi', hours: '9:00 - 19:30' },
      { day: 'Mardi', hours: '9:00 - 19:30' },
      { day: 'Mercredi', hours: '9:00 - 19:30' },
      { day: 'Jeudi', hours: '9:00 - 19:30' },
      { day: 'Vendredi', hours: '9:00 - 19:30' },
      { day: 'Samedi', hours: '9:00 - 19:30' },
      { day: 'Dimanche', hours: 'Fermé' }
    ],
    phone: '+33 1 42 72 03 23',
    hasDelivery: true,
    deliveryTime: '45-60 min',
    deliveryFee: 5.00,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1586015555751-63c29b8cd2eb?auto=format&fit=crop&q=80&w=2669&h=1500'
  },
  {
    id: 'pharm4',
    name: 'Grande Pharmacie Opéra',
    address: '32 Avenue de l\'Opéra',
    city: 'Paris, 75002',
    distance: '1.7 km',
    coordinates: {
      latitude: 48.8685,
      longitude: 2.3325
    },
    openingHours: [
      { day: 'Lundi', hours: '8:30 - 20:00' },
      { day: 'Mardi', hours: '8:30 - 20:00' },
      { day: 'Mercredi', hours: '8:30 - 20:00' },
      { day: 'Jeudi', hours: '8:30 - 20:00' },
      { day: 'Vendredi', hours: '8:30 - 20:00' },
      { day: 'Samedi', hours: '9:00 - 19:00' },
      { day: 'Dimanche', hours: 'Fermé' }
    ],
    phone: '+33 1 42 66 84 98',
    hasDelivery: false,
    deliveryTime: '',
    deliveryFee: 0,
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=2670&h=1500'
  },
  {
    id: 'pharm5',
    name: 'Pharmacie des Champs-Élysées',
    address: '84 Avenue des Champs-Élysées',
    city: 'Paris, 75008',
    distance: '2.3 km',
    coordinates: {
      latitude: 48.8715,
      longitude: 2.3108
    },
    openingHours: [
      { day: 'Lundi', hours: '9:00 - 21:00' },
      { day: 'Mardi', hours: '9:00 - 21:00' },
      { day: 'Mercredi', hours: '9:00 - 21:00' },
      { day: 'Jeudi', hours: '9:00 - 21:00' },
      { day: 'Vendredi', hours: '9:00 - 21:00' },
      { day: 'Samedi', hours: '9:00 - 21:00' },
      { day: 'Dimanche', hours: '10:00 - 20:00' }
    ],
    phone: '+33 1 45 62 02 41',
    hasDelivery: true,
    deliveryTime: '25-40 min',
    deliveryFee: 4.50,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=2670&h=1500'
  }
];

export const medicationAvailability = [
  // Paracétamol
  { medicationId: 'paracetamol', pharmacyId: 'pharm1', price: 3.50, inStock: true, stockQuantity: 45 },
  { medicationId: 'paracetamol', pharmacyId: 'pharm2', price: 3.20, inStock: true, stockQuantity: 32 },
  { medicationId: 'paracetamol', pharmacyId: 'pharm3', price: 3.60, inStock: true, stockQuantity: 28 },
  { medicationId: 'paracetamol', pharmacyId: 'pharm4', price: 3.40, inStock: true, stockQuantity: 15 },
  { medicationId: 'paracetamol', pharmacyId: 'pharm5', price: 3.80, inStock: true, stockQuantity: 22 },
  
  // Ibuprofène
  { medicationId: 'ibuprofen', pharmacyId: 'pharm1', price: 4.20, inStock: true, stockQuantity: 38 },
  { medicationId: 'ibuprofen', pharmacyId: 'pharm2', price: 4.00, inStock: true, stockQuantity: 25 },
  { medicationId: 'ibuprofen', pharmacyId: 'pharm3', price: 4.50, inStock: true, stockQuantity: 19 },
  { medicationId: 'ibuprofen', pharmacyId: 'pharm4', price: 4.30, inStock: false, estimatedRestockDate: '2024-04-20' },
  { medicationId: 'ibuprofen', pharmacyId: 'pharm5', price: 4.70, inStock: true, stockQuantity: 12 },
  
  // Aspirine
  { medicationId: 'aspirin', pharmacyId: 'pharm1', price: 3.80, inStock: true, stockQuantity: 42 },
  { medicationId: 'aspirin', pharmacyId: 'pharm2', price: 3.60, inStock: true, stockQuantity: 30 },
  { medicationId: 'aspirin', pharmacyId: 'pharm3', price: 4.00, inStock: true, stockQuantity: 25 },
  { medicationId: 'aspirin', pharmacyId: 'pharm4', price: 3.90, inStock: true, stockQuantity: 18 },
  { medicationId: 'aspirin', pharmacyId: 'pharm5', price: 4.20, inStock: true, stockQuantity: 20 },
  
  // Amoxicilline
  { medicationId: 'amoxicillin', pharmacyId: 'pharm1', price: 8.50, inStock: true, stockQuantity: 15 },
  { medicationId: 'amoxicillin', pharmacyId: 'pharm2', price: 8.20, inStock: true, stockQuantity: 12 },
  { medicationId: 'amoxicillin', pharmacyId: 'pharm3', price: 8.80, inStock: false, estimatedRestockDate: '2024-04-18' },
  { medicationId: 'amoxicillin', pharmacyId: 'pharm4', price: 8.40, inStock: true, stockQuantity: 8 },
  { medicationId: 'amoxicillin', pharmacyId: 'pharm5', price: 9.00, inStock: true, stockQuantity: 10 },
  
  // Loratadine
  { medicationId: 'loratadine', pharmacyId: 'pharm1', price: 6.90, inStock: true, stockQuantity: 22 },
  { medicationId: 'loratadine', pharmacyId: 'pharm2', price: 6.50, inStock: true, stockQuantity: 18 },
  { medicationId: 'loratadine', pharmacyId: 'pharm3', price: 7.20, inStock: true, stockQuantity: 14 },
  { medicationId: 'loratadine', pharmacyId: 'pharm4', price: 6.80, inStock: true, stockQuantity: 10 },
  { medicationId: 'loratadine', pharmacyId: 'pharm5', price: 7.50, inStock: false, estimatedRestockDate: '2024-04-19' },
  
  // Oméprazole
  { medicationId: 'omeprazole', pharmacyId: 'pharm1', price: 9.80, inStock: true, stockQuantity: 18 },
  { medicationId: 'omeprazole', pharmacyId: 'pharm2', price: 9.50, inStock: true, stockQuantity: 15 },
  { medicationId: 'omeprazole', pharmacyId: 'pharm3', price: 10.20, inStock: true, stockQuantity: 12 },
  { medicationId: 'omeprazole', pharmacyId: 'pharm4', price: 9.90, inStock: false, estimatedRestockDate: '2024-04-21' },
  { medicationId: 'omeprazole', pharmacyId: 'pharm5', price: 10.50, inStock: true, stockQuantity: 9 },
  
  // Salbutamol
  { medicationId: 'salbutamol', pharmacyId: 'pharm1', price: 12.40, inStock: true, stockQuantity: 10 },
  { medicationId: 'salbutamol', pharmacyId: 'pharm2', price: 12.00, inStock: false, estimatedRestockDate: '2024-04-17' },
  { medicationId: 'salbutamol', pharmacyId: 'pharm3', price: 12.80, inStock: true, stockQuantity: 8 },
  { medicationId: 'salbutamol', pharmacyId: 'pharm4', price: 12.50, inStock: true, stockQuantity: 6 },
  { medicationId: 'salbutamol', pharmacyId: 'pharm5', price: 13.00, inStock: true, stockQuantity: 7 },
  
  // Metformine
  { medicationId: 'metformin', pharmacyId: 'pharm1', price: 7.60, inStock: true, stockQuantity: 25 },
  { medicationId: 'metformin', pharmacyId: 'pharm2', price: 7.30, inStock: true, stockQuantity: 20 },
  { medicationId: 'metformin', pharmacyId: 'pharm3', price: 7.90, inStock: true, stockQuantity: 18 },
  { medicationId: 'metformin', pharmacyId: 'pharm4', price: 7.70, inStock: true, stockQuantity: 15 },
  { medicationId: 'metformin', pharmacyId: 'pharm5', price: 8.10, inStock: true, stockQuantity: 22 },
  
  // Atorvastatine
  { medicationId: 'atorvastatin', pharmacyId: 'pharm1', price: 15.80, inStock: true, stockQuantity: 14 },
  { medicationId: 'atorvastatin', pharmacyId: 'pharm2', price: 15.50, inStock: true, stockQuantity: 12 },
  { medicationId: 'atorvastatin', pharmacyId: 'pharm3', price: 16.20, inStock: false, estimatedRestockDate: '2024-04-22' },
  { medicationId: 'atorvastatin', pharmacyId: 'pharm4', price: 15.90, inStock: true, stockQuantity: 9 },
  { medicationId: 'atorvastatin', pharmacyId: 'pharm5', price: 16.50, inStock: true, stockQuantity: 11 },
  
  // Lévothyroxine
  { medicationId: 'levothyroxine', pharmacyId: 'pharm1', price: 5.40, inStock: true, stockQuantity: 30 },
  { medicationId: 'levothyroxine', pharmacyId: 'pharm2', price: 5.20, inStock: true, stockQuantity: 25 },
  { medicationId: 'levothyroxine', pharmacyId: 'pharm3', price: 5.70, inStock: true, stockQuantity: 22 },
  { medicationId: 'levothyroxine', pharmacyId: 'pharm4', price: 5.50, inStock: true, stockQuantity: 18 },
  { medicationId: 'levothyroxine', pharmacyId: 'pharm5', price: 5.90, inStock: true, stockQuantity: 20 }
];