
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onAddToCart }) => {
  const isSingleQuantity = product.name === 'Design de Logotipo' || product.name === 'Menu de Restaurante';
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o modal de detalhes seja aberto
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000); // O feedback desaparece após 2 segundos
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group cursor-pointer"
      onClick={() => onProductClick(product)}
      role="button"
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <div className="relative">
        <img className="w-full h-56 object-cover" src={product.image} alt={product.name} />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
             <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                <i className="fas fa-search-plus"></i>
                Ver Detalhes
            </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 h-16">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-purple-600">
            {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
            {!isSingleQuantity && <span className="text-sm font-normal text-gray-500"> /unid.</span>}
          </p>
          <button 
            onClick={handleAddToCartClick}
            disabled={isAdded}
            className={`text-white font-bold py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 ${
              isAdded ? 'bg-green-500' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isAdded ? (
              <>
                <i className="fas fa-check"></i>
                Adicionado!
              </>
            ) : (
              <>
                <i className="fas fa-cart-plus"></i>
                Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
