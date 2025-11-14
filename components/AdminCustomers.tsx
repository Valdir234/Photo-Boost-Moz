
import React from 'react';
import { ADMIN_LOGO_URL } from '../constants';

export const AdminCustomers: React.FC = () => {
  return (
    <div className="animate-fade-in-up">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Gestão de Clientes</h2>
        <div className="text-center text-gray-500 mt-20 bg-white p-10 rounded-lg shadow-md">
            <img src={ADMIN_LOGO_URL} alt="Em Desenvolvimento" className="mx-auto h-24 w-auto mb-6 opacity-50" />
            <h3 className="text-xl font-semibold">Funcionalidade em Desenvolvimento</h3>
            <p>A gestão de clientes estará disponível em breve.</p>
        </div>
    </div>
  );
};