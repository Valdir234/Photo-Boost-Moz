import React from 'react';

interface AboutUsProps {
  onExplore: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onExplore }) => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Column */}
          <div className="w-full lg:w-5/12">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
              alt="Equipa criativa da Photo Boost Moz a colaborar"
              className="rounded-lg shadow-2xl object-cover w-full h-auto"
            />
          </div>
          {/* Content Column */}
          <div className="w-full lg:w-7/12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Sobre Nós</h2>
            <h3 className="text-xl font-semibold text-purple-600 mb-6">A Sua Agência de Design Criativo em Moçambique</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Na Photo Boost Moz, somos apaixonados por transformar ideias em realidade visual. Somos uma agência de design moçambicana dedicada a ajudar marcas, empreendedores e empresas a destacarem-se no mercado digital com soluções criativas e de alta qualidade.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Nossa missão é impulsionar o seu sucesso, criando designs que não só são esteticamente apelativos, mas que também comunicam a sua mensagem de forma clara e eficaz. Acreditamos no poder de um bom design para construir conexões duradouras com o seu público.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                        <i className="fas fa-lightbulb text-2xl"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">Design Inovador</h4>
                        <p className="text-gray-600">Criatividade que capta a atenção.</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                        <i className="fas fa-headset text-2xl"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">Atendimento Dedicado</h4>
                        <p className="text-gray-600">A sua visão é a nossa prioridade.</p>
                    </div>
                </div>
            </div>
            <button 
                onClick={onExplore} 
                className="bg-purple-600 text-white font-bold py-3 px-8 rounded-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              Conheça os Nossos Serviços <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
