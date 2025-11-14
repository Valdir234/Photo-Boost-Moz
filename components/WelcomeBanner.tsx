import React from 'react';

interface WelcomeBannerProps {
  onClose: () => void;
  onExplore: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onClose, onExplore }) => {
  return (
    <div className="relative bg-gray-50 text-gray-800 rounded-lg shadow-xl overflow-hidden mx-4 my-6 md:mx-auto md:max-w-7xl animate-fade-in-down">
      <img 
        src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1964&auto=format&fit=crop" 
        alt="Creative digital design elements" 
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="relative p-8 md:p-12 pt-24 z-10 text-center">
        <button 
            onClick={onClose} 
            className="absolute top-3 right-3 text-gray-600 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Fechar banner de boas-vindas"
        >
          <i className="fas fa-times text-2xl"></i>
        </button>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight animate-fade-in-up text-gray-900">Bem-vindo à Photo Boost Moz!</h2>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto animate-fade-in-up">Soluções criativas e designs de alta qualidade para dar vida à sua marca.</p>
        <button 
            onClick={onExplore} 
            className="bg-purple-600 text-white font-bold py-3 px-8 rounded-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 text-lg"
        >
          Explorar Serviços <i className="fas fa-arrow-down ml-2 animate-bounce"></i>
        </button>
      </div>
    </div>
  );
};