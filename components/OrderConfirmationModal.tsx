
import React, { useState } from 'react';
import { Order } from '../types';
import { CONTACT_INFO } from '../constants';
import { generateOrderWhatsAppMessage } from '../utils';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!order) return null;

  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=${generateOrderWhatsAppMessage(order)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(whatsappUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Falha ao copiar o link: ', err);
      alert('Não foi possível copiar o link.');
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative transform transition-all animate-zoom-in text-center">
        <div className="text-green-500 mb-4">
            <i className="fas fa-check-circle text-6xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Pedido Recebido!</h2>
        <p className="text-gray-600 mb-4">Obrigado, {order.customerName}! Seu pedido <span className="font-bold text-purple-600">#{order.id}</span> foi registado.</p>
        
        <div className="bg-gray-100 p-4 rounded-lg text-left mb-6">
            <h4 className="font-semibold mb-2">Resumo do Pedido:</h4>
            <ul className="text-sm space-y-1">
                {order.items.map(item => (
                    <li key={item.product.id} className="flex justify-between">
                        <span>{item.product.name} x {item.quantity}</span>
                    </li>
                ))}
            </ul>
             <p className="text-right font-bold mt-2 text-lg">Total: {order.totalAmount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</p>
        </div>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-6">
          <p className="font-bold">Passo Final e Mais Importante!</p>
          <p>Clique no botão abaixo para enviar os detalhes do seu pedido e o comprovativo de pagamento para o nosso WhatsApp. <br/><strong>O seu pedido só será processado após esta confirmação.</strong></p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-lg flex items-center justify-center gap-2"
            >
                <i className="fab fa-whatsapp"></i>
                Enviar via WhatsApp
            </a>
            <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                aria-label="Copiar link do pedido"
            >
                {isCopied ? (
                    <>
                        <i className="fas fa-check text-green-500"></i>
                        Copiado!
                    </>
                ) : (
                    <>
                        <i className="fas fa-copy"></i>
                        Copiar Link
                    </>
                )}
            </button>
        </div>

        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-800">Fechar</button>

      </div>
    </div>
  );
};
