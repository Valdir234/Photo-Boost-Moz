import React from 'react';
import { CartItem } from '../types';
import { calculatePriceDetails } from '../utils';

interface CartListItemProps {
  item: CartItem;
  onRemoveItem: (productId: number) => void;
}

export const CartListItem: React.FC<CartListItemProps> = React.memo(({ item, onRemoveItem }) => {
  const priceDetails = calculatePriceDetails(item);
  return (
    <li className="flex space-x-4 border-b pb-4">
      <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
      <div className="flex-grow">
        <h4 className="font-semibold">{item.product.name}</h4>
        <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
        {item.customizationNotes && (
           <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded-md">
                <p className="font-semibold text-gray-700">Notas:</p>
                <p className="whitespace-pre-wrap">{item.customizationNotes}</p>
           </div>
        )}
        <div className="flex items-baseline flex-wrap mt-2">
           <span className="font-bold text-purple-600 mr-2">
            {priceDetails.finalPrice.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
          </span>
          {priceDetails.discountApplied > 0 && (
            <>
              <del className="text-xs text-gray-500">
                {priceDetails.originalPrice.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
              </del>
              <span className="ml-2 text-xs font-semibold bg-green-100 text-green-700 py-0.5 px-2 rounded-full">
                -{priceDetails.discountApplied}%
              </span>
            </>
          )}
        </div>
      </div>
      <button onClick={() => onRemoveItem(item.product.id)} className="text-red-500 hover:text-red-700 self-start mt-1 flex-shrink-0">
        <i className="fas fa-trash-alt"></i>
      </button>
    </li>
  );
});
