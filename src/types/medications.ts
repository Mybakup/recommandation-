export interface Medication {
  genericFr: string;
  genericEn: string;
  brandNameEn: string;
  indication: string;
}

export interface SearchResult {
  medication: Medication;
  matchType: 'genericFr' | 'genericEn' | 'brandNameEn';
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  distance: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  openingHours: {
    day: string;
    hours: string;
  }[];
  phone: string;
  hasDelivery: boolean;
  deliveryTime: string;
  deliveryFee: number;
  rating: number;
  imageUrl: string;
}

export interface MedicationAvailability {
  medicationId: string;
  pharmacyId: string;
  price: number;
  inStock: boolean;
  stockQuantity?: number;
  estimatedRestockDate?: string;
}