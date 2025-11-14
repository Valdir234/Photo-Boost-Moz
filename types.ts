export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  galleryImages: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizationNotes?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pendente' | 'Concluído';
  customerName: string;
  customerContact: string;
  customerEmail?: string;
  notes?: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface PriceDetails {
  finalPrice: number;
  originalPrice: number;
  discountApplied: number;
}