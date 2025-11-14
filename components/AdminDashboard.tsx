import React, { useState } from 'react';
import { Order } from '../types';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminCustomers } from './AdminCustomers';
import { ADMIN_LOGO_URL } from '../constants';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
  onBackToShop: () => void;
}

type AdminView = 'orders' | 'products' | 'customers';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, onUpdateOrder, onBackToShop }) => {
  const [currentView, setCurrentView] = useState<AdminView>('customers');

  const renderView = () => {
    switch (currentView) {
      case 'orders':
        return <AdminOrders orders={orders} onUpdateOrder={onUpdateOrder} />;
      case 'products':
        return <AdminProducts />;
      case 'customers':
        return <AdminCustomers />;
      default:
        return <AdminOrders orders={orders} onUpdateOrder={onUpdateOrder} />;
    }
  };

  const NavLink: React.FC<{ view: AdminView; icon: string; label: string }> = ({ view, icon, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
        currentView === view
          ? 'bg-purple-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <i className={`fas ${icon} w-6 text-center`}></i>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-col p-4 fixed h-full shadow-lg hidden md:flex">
        <div className="flex items-center space-x-3 mb-10 p-2">
            <img src={ADMIN_LOGO_URL} alt="Photo Boost Moz Admin Logo" className="h-12 w-auto" />
            <div>
                <span className="font-bold text-lg">Admin</span>
                <span className="block text-xs text-gray-400">Photo Boost Moz</span>
            </div>
        </div>
        
        <nav className="flex-grow space-y-2">
          <NavLink view="orders" icon="fa-receipt" label="Pedidos" />
          <NavLink view="products" icon="fa-box-open" label="Produtos" />
          <NavLink view="customers" icon="fa-users" label="Clientes" />
        </nav>
        
        <div className="mt-auto">
           <button
            onClick={onBackToShop}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left text-gray-300 hover:bg-gray-700 hover:text-white"
            >
                <i className="fas fa-store w-6 text-center"></i>
                <span>Voltar à Loja</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="p-6 md:p-10">
          {renderView()}
        </div>
      </main>
    </div>
  );
};