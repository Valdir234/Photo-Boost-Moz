
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product, CartItem, Order } from './types';
import { PRODUCTS, CONTACT_INFO } from './constants';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ShoppingCart } from './components/ShoppingCart';
import { CheckoutModal } from './components/CheckoutModal';
import { Chatbot } from './components/Chatbot';
import { OrderHistory } from './components/OrderHistory';
import { ProductDetailModal } from './components/ProductDetailModal';
import { calculatePriceDetails, generateCartWhatsAppMessage } from './utils';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { WelcomeBanner } from './components/WelcomeBanner';
import { AboutUs } from './components/AboutUs';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'shop' | 'history' | 'admin'>('shop');
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderForConfirmation, setOrderForConfirmation] = useState<Order | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const productsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('orderHistory');
      if (savedOrders) {
        const parsedOrders: any[] = JSON.parse(savedOrders);
        const migratedOrders = parsedOrders.map(order => ({
          ...order,
          status: order.status || 'Concluído',
          customerName: order.customerName || 'Cliente Antigo',
          customerContact: order.customerContact || '',
          customerEmail: order.customerEmail || undefined,
        }));
        setOrderHistory(migratedOrders);
      }
    } catch (error) {
      console.error("Failed to parse order history from localStorage", error);
      localStorage.removeItem('orderHistory');
    }
  }, []);

  const handleAddToCart = (product: Product, quantity: number, customizationNotes: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, customizationNotes: customizationNotes.trim() ? customizationNotes : undefined }
            : item
        );
      }
      return [...prevCart, { product, quantity, customizationNotes: customizationNotes.trim() ? customizationNotes : undefined }];
    });
    
    setToastMessage(`"${product.name}" adicionado ao carrinho!`);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  const handleQuickAddToCart = (product: Product) => {
    handleAddToCart(product, 1, '');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetailModal = () => {
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  
  const handleConfirmCheckout = (details: { name: string; contact: string; email: string; notes: string }) => {
    setIsCheckoutOpen(false);
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: `CM-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      items: cart,
      totalAmount: totalAmount,
      customerName: details.name,
      customerContact: details.contact,
      customerEmail: details.email.trim() || undefined,
      notes: details.notes.trim() || undefined,
      status: 'Pendente'
    };
    
    const updatedHistory = [...orderHistory, newOrder];
    setOrderHistory(updatedHistory);
    localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));

    setCart([]);
    setOrderForConfirmation(newOrder);
  }

  const handleUpdateOrder = (updatedOrder: Order) => {
    const updatedHistory = orderHistory.map(o => o.id === updatedOrder.id ? updatedOrder : o);
    setOrderHistory(updatedHistory);
    localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
    setToastMessage(`Pedido #${updatedOrder.id} atualizado!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCartClick = () => {
    setCurrentPage('shop');
    setIsCartOpen(true);
  };

  const handleExploreClick = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const totalAmount = cart.reduce((total, item) => total + calculatePriceDetails(item).finalPrice, 0);
  
  const renderPage = () => {
    switch(currentPage) {
        case 'history':
            return <OrderHistory orders={orderHistory} onBackToShop={() => setCurrentPage('shop')} />;
        case 'admin':
            return <AdminDashboard orders={orderHistory} onUpdateOrder={handleUpdateOrder} onBackToShop={() => setCurrentPage('shop')} />;
        case 'shop':
        default:
            return (
                <>
                  {isBannerVisible && (
                    <WelcomeBanner 
                      onClose={() => setIsBannerVisible(false)}
                      onExplore={handleExploreClick}
                    />
                  )}

                  <main ref={productsRef} className="container mx-auto px-6 py-12">
                    <div className="text-center mb-12">
                      <h2 className="text-4xl font-extrabold text-gray-900">Nossos Serviços Criativos</h2>
                      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Transformamos suas ideias em designs incríveis. Escolha um serviço para começar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {PRODUCTS.map(product => (
                        <ProductCard key={product.id} product={product} onProductClick={handleProductClick} onAddToCart={handleQuickAddToCart} />
                      ))}
                    </div>
                  </main>
                  
                  <AboutUs onExplore={handleExploreClick} />

                  <footer 
                    className="text-white relative bg-cover bg-center bg-fixed" 
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603217041434-32555543a13f?q=80&w=1974&auto=format&fit=crop')" }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                    <div className="container mx-auto px-6 py-12 text-center relative z-10">
                        <h3 className="text-xl font-bold mb-6">Entre em Contacto</h3>
                        <div className="flex flex-col justify-center items-center gap-3 text-lg">
                            <a href={`tel:${CONTACT_INFO.phone1}`} className="hover:text-purple-400 transition-colors flex items-center gap-2"><i className="fas fa-phone"></i><span>{CONTACT_INFO.phone1}</span></a>
                            <a href={`tel:${CONTACT_INFO.phone2}`} className="hover:text-purple-400 transition-colors flex items-center gap-2"><i className="fas fa-phone"></i><span>{CONTACT_INFO.phone2}</span></a>
                            <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-purple-400 transition-colors flex items-center gap-2"><i className="fas fa-envelope"></i><span>{CONTACT_INFO.email}</span></a>
                             <a href={`https://wa.me/${CONTACT_INFO.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors flex items-center gap-2">
                                <i className="fab fa-whatsapp text-2xl"></i><span>WhatsApp</span>
                            </a>
                        </div>
                        <p className="mt-8 pt-6 border-t border-gray-700 text-gray-400 text-sm">&copy; {new Date().getFullYear()} Photo Boost Moz. Todos os direitos reservados.</p>
                    </div>
                  </footer>
                </>
            );
    }
  }

  const rootDivClasses = currentPage === 'admin' 
    ? ''
    : "min-h-screen bg-gray-50 font-sans";

  return (
    <div className={rootDivClasses}>
      {currentPage !== 'admin' && (
        <Header 
          cartItemCount={cart.length} 
          onCartClick={handleCartClick}
          onHistoryClick={() => setCurrentPage('history')}
          onAdminClick={() => setCurrentPage('admin')}
          onHomeClick={() => setCurrentPage('shop')}
          isTransparent={currentPage === 'shop' && isBannerVisible}
        />
      )}
      
      {renderPage()}

      {currentPage !== 'admin' && (
        <>
          <ShoppingCart
            isOpen={isCartOpen}
            items={cart}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
            onRemoveItem={handleRemoveFromCart}
          />
          
          <CheckoutModal 
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onConfirm={handleConfirmCheckout}
            totalAmount={totalAmount}
          />

          <OrderConfirmationModal
            order={orderForConfirmation}
            onClose={() => setOrderForConfirmation(null)}
          />
          
          <ProductDetailModal 
            product={selectedProduct}
            onClose={handleCloseDetailModal}
            onAddToCart={handleAddToCart}
          />
          
          <Chatbot />
          
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${generateCartWhatsAppMessage(cart)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-44 right-6 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-50"
            aria-label="Contactar via WhatsApp com detalhes do carrinho"
          >
            <i className="fab fa-whatsapp text-4xl"></i>
          </a>

          <button
            onClick={handleCartClick}
            className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-110 z-50"
            aria-label="Abrir carrinho de compras"
          >
            <i className="fas fa-shopping-cart text-2xl"></i>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          
          {toastMessage && (
             <div className="fixed top-24 right-6 bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg animate-fade-in-down z-50">
                <i className="fas fa-check-circle mr-2"></i>
                {toastMessage}
            </div>
          )}
        </>
      )}
      
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        
        @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
        
        @keyframes zoom-in {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in { animation: zoom-in 0.3s ease-out forwards; }

        @keyframes message-sent {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-message-sent { animation: message-sent 0.3s ease-out forwards; }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
            50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); }
        }
        .animate-bounce { animation: bounce 1s infinite; }

        @keyframes pulse {
            50% {
                transform: scale(1.03);
            }
        }
        .animate-pulse { animation: pulse 2s infinite; }
      `}</style>

    </div>
  );
};

export default App;