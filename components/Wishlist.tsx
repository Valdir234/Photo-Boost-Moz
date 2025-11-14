import React from 'react';
import { Product } from '../types';

interface WishlistProps {
  isOpen: boolean;
  wishlistItems: Product[];
  onClose: () => void;
  onRemoveItem: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ isOpen, wishlistItems, onClose, onRemoveItem, onAddToCart }) => {
  const handleAddToCartAndClose = (product: Product) => {
    onAddToCart(product);
  }
  
  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-2xl font-bold text-gray-800">Lista de Desejos</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          <div className="flex-grow p-6 overflow-y-auto">
            {wishlistItems.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <i className="fas fa-heart-broken text-4xl mb-4"></i>
                <p>A sua lista de desejos está vazia.</p>
                <p className="text-sm mt-2">Clique no coração nos produtos para guardá-los aqui.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {wishlistItems.map(product => (
                  <li key={product.id} className="flex space-x-4 border-b pb-4 last:border-b-0">
                    <img src={product.image} alt={product.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
                    <div className="flex-grow">
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="font-bold text-purple-600 mt-1">
                        {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleAddToCartAndClose(product)} className="text-sm bg-purple-600 text-white font-bold py-1 px-3 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1">
                            <i className="fas fa-cart-plus"></i>
                            Mover p/ Carrinho
                        </button>
                        <button onClick={() => onRemoveItem(product.id)} className="text-sm text-red-500 hover:text-red-700 font-semibold py-1 px-3 rounded-md hover:bg-red-50 transition-colors flex items-center gap-1">
                            <i className="fas fa-trash-alt"></i>
                            Remover
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
