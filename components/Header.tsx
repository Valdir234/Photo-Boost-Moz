import React from 'react';
import { LOGO_URL } from '../constants';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onHistoryClick: () => void;
  onAdminClick: () => void;
  onHomeClick: () => void;
  isTransparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onHistoryClick, onAdminClick, onHomeClick, isTransparent = false }) => {
  
  const headerClasses = isTransparent
    ? "absolute top-0 left-0 right-0 z-40"
    : "bg-white shadow-md sticky top-0 z-40";
  
  const iconClasses = isTransparent
    ? "text-gray-800 hover:text-purple-600 transition-colors"
    : "text-gray-600 hover:text-purple-600 transition-colors";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div
          onClick={onHomeClick}
          className="flex items-center space-x-3 cursor-pointer"
          role="button"
          aria-label="Página inicial"
        >
          <img src={LOGO_URL} alt="Photo Boost Moz Logo" className="h-12 w-auto" />
        </div>
        <div className="flex items-center space-x-6">
           <button 
            onClick={onHistoryClick} 
            className={iconClasses}
            aria-label="Histórico de Pedidos"
          >
            <i className="fas fa-file-alt text-2xl"></i>
          </button>
           <button 
            onClick={onAdminClick} 
            className={iconClasses}
            aria-label="Gerir Pedidos"
          >
            <i className="fas fa-user text-2xl"></i>
          </button>
          <button 
            onClick={onCartClick} 
            className={`relative ${iconClasses}`}
            aria-label="Carrinho de Compras"
          >
            <i className="fas fa-shopping-cart text-2xl"></i>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};