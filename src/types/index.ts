export type RegionType = 'Northern Pakistan' | 'Pakistan Heritage & Coast';

export interface WeatherMonth {
  season: string;
  tempRange: string;
  condition: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region: RegionType;
  category: 'Mountains' | 'Lakes & Valleys' | 'Heritage & Culture' | 'Coast & Desert' | 'Luxury & City';
  shortDescription: string;
  fullIntro: string;
  overview: string;
  bestSeason: string;
  availableTours: number;
  elevationOrClimate: string;
  featured: boolean;
  popular: boolean;
  image: string;
  gallery: string[];
  attractions: { name: string; description: string }[];
  thingsToDo: string[];
  travelTips: string[];
  weather: WeatherMonth[];
  coordinates: { lat: number; lng: number; altitude?: number };
  mapCamera?: { range?: number; tilt?: number; heading?: number };
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
  accommodation: string;
}

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  destinationId: string;
  destinationName: string;
  country: string;
  region: RegionType;
  category: 'Expedition' | 'Luxury Retreat' | 'Cultural Heritage' | 'Honeymoon' | 'Family Tour' | 'Adventure Trek';
  packageType: 'Group Tour' | 'Private Tour' | 'Custom Ready';
  durationDays: number;
  durationLabel: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  availableSeats: number;
  departureDates: string[];
  featured: boolean;
  trending: boolean;
  shortDescription: string;
  overview: string;
  image: string;
  gallery: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  hotelInfo: { name: string; category: string; location: string };
  transportDetails: string;
  pickupPoints: string[];
  importantInfo: string[];
  cancellationPolicy: string;
}

export interface HotelRoom {
  id: string;
  name: string;
  capacity: number;
  bedType: string;
  pricePerNight: number;
  sizeSqm: number;
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  country: string;
  category: '5-Star Resort' | 'Boutique Heritage' | 'Alpine Lodge' | 'City Luxury';
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  image: string;
  gallery: string[];
  description: string;
  facilities: string[];
  rooms: HotelRoom[];
}

export interface FlightResult {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopCity?: string;
  baggage: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  price: number;
}

export interface VisaCountryRequirement {
  id: string;
  country: string;
  flagCode: string;
  categories: {
    type: 'Tourist Visa' | 'Business Visa' | 'Transit Visa' | 'Family Visit';
    processingTime: string;
    feeUsd: number;
    validity: string;
    documents: string[];
  }[];
}

export interface VisaApplication {
  id: string;
  applicantName: string;
  email: string;
  country: string;
  visaType: string;
  submittedDate: string;
  status: 'Under Review' | 'Documents Verified' | 'Embassy Processing' | 'Approved' | 'Action Required';
  trackingCode: string;
  feePaid: number;
}

export interface Review {
  id: string;
  customerName: string;
  customerCity: string;
  avatar: string;
  packageId: string;
  packageName: string;
  destinationName: string;
  rating: number;
  travelDate: string;
  createdAt: string;
  verifiedBooking: boolean;
  text: string;
  photos?: string[];
  status: 'Approved' | 'Pending';
}

export interface BlogComment {
  id: string;
  author: string;
  date: string;
  content: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category:
    | 'Pakistan Travel Guides'
    | 'Northern Pakistan'
    | 'Adventure Travel'
    | 'Family Travel'
    | 'Travel Tips'
    | 'Budget Travel'
    | 'Honeymoon'
    | 'Food and Culture'
    | 'Travel News';
  destination: string;
  tags: string[];
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  publishDate: string;
  readingTime: string;
  views: number;
  featured: boolean;
  trending: boolean;
  sections: {
    id: string;
    heading: string;
    paragraphs: string[];
    quote?: string;
    image?: string;
    tip?: string;
  }[];
  relatedPackageIds: string[];
  relatedDestinationSlugs: string[];
  comments: BlogComment[];
}

export interface BookingRecord {
  id: string;
  reference: string;
  packageId: string;
  packageTitle: string;
  destination: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  departureDate: string;
  adults: number;
  children: number;
  roomType: 'Standard Twin' | 'Deluxe Panorama' | 'Executive Suite';
  extras: string[];
  paymentMethod: 'Card Payment' | 'Bank Transfer' | 'Advance Deposit';
  paymentPlan: 'Full Payment' | 'Advance 30%';
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Refund Requested';
  createdAt: string;
  passengerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationality: string;
    dob: string;
    passportNumber?: string;
    specialRequirements?: string;
  };
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  validUntil: string;
  active: boolean;
  usageCount: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  tier: 'Explorer' | 'Gold Voyager' | 'Summit Club';
  joinedAt: string;
  totalBookings: number;
  totalSpent: number;
  avatar: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'Senior Tour Director' | 'Visa Specialist' | 'Operations Manager' | 'Luxury Concierge' | 'Finance Lead';
  region: string;
  activeTours: number;
  status: 'Active' | 'On Expedition';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Booking' | 'Visa' | 'Payment' | 'Itinerary';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  lastUpdate: string;
  message: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'booking' | 'promo' | 'visa' | 'system';
}
