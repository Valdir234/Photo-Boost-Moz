
import React from 'react';
import { CartItem } from '../types';
import { calculatePriceDetails } from '../utils';
import { CartListItem } from './CartListItem';

interface ShoppingCartProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onCheckout: () => void;
  onRemoveItem: (productId: number) => void;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, items, onClose, onCheckout, onRemoveItem }) => {
  const totalPrice = items.reduce((total, item) => total + calculatePriceDetails(item).finalPrice, 0);

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
            <h2 className="text-2xl font-bold text-gray-800">Seu Pedido</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          <div className="flex-grow p-6 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <i className="fas fa-shopping-basket text-4xl mb-4"></i>
                <p>O seu carrinho está vazio.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map(item => (
                   <CartListItem 
                    key={item.product.id}
                    item={item}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-purple-700">
                  {totalPrice.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-lg"
              >
                Finalizar Pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
