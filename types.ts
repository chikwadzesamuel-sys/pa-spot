
export enum ServiceCategory {
  HOUSE = 'HOUSE',
  CAR = 'CAR'
}

export interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

export interface CleanerBid {
  id: string;
  name: string;
  rating: number;
  completedJobs: number;
  price: number;
  timeEstimate: string;
  avatar: string;
  description: string;
}

export interface BookingDetails {
  category: ServiceCategory;
  subType: string; // e.g., "3 Bedroom House" or "SUV Exterior"
  userPrice: number;
  location: Location;
  additionalNotes: string;
}

export type AppStep = 'SERVICE_SELECT' | 'DETAILS' | 'LOCATION' | 'NEGOTIATION' | 'CONFIRMED';
