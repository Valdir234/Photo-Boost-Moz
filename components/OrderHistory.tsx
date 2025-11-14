import React from 'react';
import { Order } from '../types';
import { calculatePriceDetails } from '../utils';

interface OrderHistoryProps {
  orders: Order[];
  onBackToShop: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, onBackToShop }) => {
  return (
    <main className="container mx-auto px-6 py-12 min-h-[calc(100vh-200px)]">
      <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
        <h2 className="text-4xl font-extrabold text-gray-900">Histórico de Pedidos</h2>
        <button
          onClick={onBackToShop}
          className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-store"></i>
          Voltar à Loja
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 bg-white p-10 rounded-lg shadow-md">
          <i className="fas fa-receipt text-5xl mb-4 text-gray-400"></i>
          <p className="text-xl">Você ainda não fez nenhum pedido.</p>
          <p>Seus pedidos anteriores aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.slice().reverse().map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start border-b pb-4 mb-4 flex-wrap gap-2">
                <div>
                  <p className="font-bold text-lg text-gray-800">Pedido <span className="text-purple-600">#{order.id}</span></p>
                  <p className="text-sm text-gray-500">Data: {order.date}</p>
                </div>
                <div className="flex items-center gap-4 text-right">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                    </span>
                    <p className="font-bold text-xl text-gray-900">
                        {order.totalAmount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                    </p>
                </div>
              </div>
              <ul className="space-y-3">
                {order.items.map(item => {
                  const priceDetails = calculatePriceDetails(item);
                  return (
                    <li key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-2 pb-3 border-b last:border-b-0">
                      <div className="flex items-center">
                         <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-md object-cover mr-4" />
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                        </div>
                      </div>
                       <p className="text-gray-700 font-medium sm:text-right">
                        {priceDetails.finalPrice.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                      </p>
                      {item.customizationNotes && (
                         <div className="w-full mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-md border-l-2 border-purple-300">
                              <p className="font-semibold text-gray-700">Notas de personalização:</p>
                              <p className="whitespace-pre-wrap">{item.customizationNotes}</p>
                         </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              {order.notes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-sm text-gray-700">Observações Gerais do Pedido:</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{order.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};
