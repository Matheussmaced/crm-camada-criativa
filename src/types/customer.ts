export interface Customer {
  id: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerWithStats extends Customer {
  totalSpent: number;
  orderCount: number;
  lastPurchaseDate?: string;
}
