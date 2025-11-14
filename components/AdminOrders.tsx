
import React, { useState } from 'react';
import { Order } from '../types';
import { calculatePriceDetails } from '../utils';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onUpdateOrder }) => {

  const handleToggleStatus = (order: Order) => {
    const newStatus = order.status === 'Pendente' ? 'Concluído' : 'Pendente';
    onUpdateOrder({ ...order, status: newStatus });
  };

  const handleContactCustomer = (order: Order) => {
    const message = encodeURIComponent(`Olá ${order.customerName}! O seu pedido #${order.id} da Photo Boost Moz foi concluído e está pronto para ser levantado/enviado. 😊`);
    window.open(`https://wa.me/${order.customerContact.replace(/\D/g, '')}?text=${message}`, '_blank');
  }

  const pendingOrders = orders.filter(o => o.status === 'Pendente').length;
  const completedOrders = orders.filter(o => o.status === 'Concluído').length;

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Gestão de Pedidos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Total de Pedidos</p>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
        </div>
         <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
         <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm text-gray-500">Concluídos</p>
            <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 bg-white p-10 rounded-lg shadow-md">
          <p className="text-xl">Nenhum pedido recebido ainda.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pedido ID</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                            <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acções</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.slice().reverse().map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="p-4 whitespace-nowrap"><span className="font-mono text-purple-700">#{order.id}</span><br/><span className="text-xs text-gray-500">{order.date}</span></td>
                                <td className="p-4 whitespace-nowrap">{order.customerName}<br/><span className="text-xs text-gray-500">{order.customerContact}</span>{order.customerEmail && <><br/><span className="text-xs text-blue-500">{order.customerEmail}</span></>}</td>
                                <td className="p-4 whitespace-nowrap font-semibold">{order.totalAmount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</td>
                                <td className="p-4 whitespace-nowrap text-center">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleToggleStatus(order)} title="Mudar Status" className="text-gray-500 hover:text-blue-600"><i className="fas fa-sync-alt"></i></button>
                                        <button onClick={() => handleContactCustomer(order)} title="Contactar Cliente via WhatsApp" className="text-gray-500 hover:text-green-600"><i className="fab fa-whatsapp"></i></button>
                                        {order.customerEmail && (
                                            <a href={`mailto:${order.customerEmail}`} title="Contactar Cliente via Email" className="text-gray-500 hover:text-red-600"><i className="fas fa-envelope"></i></a>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};
