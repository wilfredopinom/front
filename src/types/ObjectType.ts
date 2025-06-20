export interface UserType {
  clerk_id: string;
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
  joinDate?: string;
  stats?: {
    published: number;
    claimed: number;
    delivered: number;
  };
}

export interface Report {
  id: string;
  userId: string;
  reason: 'fake' | 'inappropriate' | 'spam' | 'personal_data' | 'offensive' | 'other';
  description?: string;
  createdAt: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
}

export interface ObjectType {
  entregado_recuperado: boolean | null;
  id: string;
  name: string;
  title: string;
  description: string;
  categories: string;
  status: 'encontrado' | 'reclamado' | 'entregado';
  date: string;
  created_at: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  publisher: UserType;
  contactInfo?: ContactInfo;
  isPoliceStation?: boolean;
  claimsCount: number;
  claims: Array<{
    id: string;
    userId: string;
    message: string;
    date: string;
  }>;
  reports: Report[];
  claimer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
    claimDate?: string;
    claimMessage?: string;
  };
  monthlyReport?: string; // URL to PDF report for police station objects
}