
import React, { useState, useEffect } from 'react';
import { CONTACT_INFO } from '../constants';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: { name: string; contact: string; email: string; notes: string }) => void;
  totalAmount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onConfirm, totalAmount }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<'mpesa' | 'emola' | null>(null);
  const [errors, setErrors] = useState<{ name?: string; contact?: string; email?: string }>({});

  useEffect(() => {
    const newErrors: { name?: string; contact?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório.';
    }

    if (!contact.trim()) {
      newErrors.contact = 'O contacto é obrigatório.';
    } else if (!/^8[2-7]\d{7}$/.test(contact.trim())) {
      newErrors.contact = 'Formato inválido. Ex: 841234567 (9 dígitos).';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Por favor, insira um email válido.';
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);

  }, [name, contact, email]);
  
  useEffect(() => {
    if (!isOpen) {
        setName('');
        setContact('');
        setEmail('');
        setNotes('');
        setCopiedNumber(null);
        setErrors({});
    }
  }, [isOpen])

  if (!isOpen) return null;

  const handleCopy = (number: string, type: 'mpesa' | 'emola') => {
    navigator.clipboard.writeText(number).then(() => {
        setCopiedNumber(type);
        setTimeout(() => setCopiedNumber(null), 2000);
    }).catch(err => {
        console.error("Falha ao copiar número:", err);
    });
  };

  const handleConfirm = () => {
    if (isFormValid) {
        onConfirm({ name, contact, email, notes });
    }
  }
  
  const getInputClasses = (_fieldName: 'name' | 'contact' | 'email') => {
    // Return a consistent, neutral style for all inputs, as requested.
    // Validation feedback is provided by the error messages below the inputs.
    return 'w-full p-3 border border-gray-200 bg-gray-100 rounded-md focus:ring-2 focus:ring-purple-500 transition-colors text-black';
  }

  const buttonClasses = `w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 text-lg flex items-center justify-center gap-2 transform focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
      isFormValid 
      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl focus:ring-green-400 animate-pulse' 
      : 'bg-gray-400 cursor-not-allowed'
  }`;

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-lg w-full relative transform transition-all animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <i className="fas fa-times text-2xl"></i>
        </button>
        
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Finalizar Pedido</h2>
            <p className="text-gray-600">Total: <span className="font-extrabold text-purple-600 text-2xl">{totalAmount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span></p>
        </div>

        <div className="space-y-6">
            {/* Step 1: Payment */}
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <span className="bg-purple-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">1</span>
                    Efetue o Pagamento
                </h3>
                <p className="text-sm text-gray-700 mb-4">Efectue o pagamento para um dos números abaixo. Clique no ícone para copiar o número.</p>
                <div className="grid grid-cols-1 gap-4">
                    {/* M-Pesa Card */}
                    <div className="bg-white p-3 rounded-lg flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-purple-400">
                        <div className="flex items-center gap-4">
                            <img src="https://tse3.mm.bing.net/th/id/OIP.FujUVhTH9m3jcglXHLe4iwAAAA?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" alt="M-Pesa" className="h-10 w-auto"/>
                            <div>
                                <p className="text-sm text-gray-500">M-Pesa</p>
                                <p className="font-bold text-gray-800 tracking-wider text-lg">{CONTACT_INFO.phone1}</p>
                            </div>
                        </div>
                        <button onClick={() => handleCopy(CONTACT_INFO.phone1, 'mpesa')} className="text-gray-500 hover:text-purple-600 text-lg px-3 py-2 rounded-md transition-colors" title="Copiar número">
                            {copiedNumber === 'mpesa' ? <i className="fas fa-check-circle text-green-500 text-2xl"></i> : <i className="fas fa-copy text-xl"></i>}
                        </button>
                    </div>
                    {/* E-Mola Card */}
                    <div className="bg-white p-3 rounded-lg flex justify-between items-center transition-all duration-300 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-purple-400">
                        <div className="flex items-center gap-4">
                            <img src="https://tse3.mm.bing.net/th/id/OIP.SXecGH8XxXln1_3ZeIbL-AHaEW?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" alt="E-Mola" className="h-10 w-auto object-contain"/>
                            <div>
                                <p className="text-sm text-gray-500">E-Mola</p>
                                <p className="font-bold text-gray-800 tracking-wider text-lg">{CONTACT_INFO.phone2}</p>
                            </div>
                        </div>
                        <button onClick={() => handleCopy(CONTACT_INFO.phone2, 'emola')} className="text-gray-500 hover:text-purple-600 text-lg px-3 py-2 rounded-md transition-colors" title="Copiar número">
                            {copiedNumber === 'emola' ? <i className="fas fa-check-circle text-green-500 text-2xl"></i> : <i className="fas fa-copy text-xl"></i>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Step 2: Form */}
            <div>
                 <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <span className="bg-purple-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">2</span>
                    Finalizar Pedido
                </h3>
                <div className="space-y-4">
                     <div>
                         <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-1">Seu Nome Completo</label>
                         <input type="text" id="customer-name" value={name} onChange={e => setName(e.target.value)} className={getInputClasses('name')} required placeholder="Ex: João Silva"/>
                         {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>
                     <div>
                         <label htmlFor="customer-contact" className="block text-sm font-medium text-gray-700 mb-1">Seu Contacto (WhatsApp)</label>
                         <input type="tel" id="customer-contact" value={contact} onChange={e => setContact(e.target.value)} className={getInputClasses('contact')} required placeholder="Ex: 85xxxxxxx"/>
                         {errors.contact && <p className="text-red-600 text-xs mt-1">{errors.contact}</p>}
                    </div>
                     <div>
                         <label htmlFor="customer-email" className="block text-sm font-medium text-gray-700 mb-1">Seu Email <span className="text-xs text-gray-500">(Opcional)</span></label>
                         <input type="email" id="customer-email" value={email} onChange={e => setEmail(e.target.value)} className={getInputClasses('email')} placeholder="Ex: gema@email.com"/>
                         {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700 mb-1">Observações do Pedido (opcional)</label>
                        <textarea
                            id="order-notes"
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full p-3 border border-gray-200 bg-gray-100 rounded-md focus:ring-2 focus:ring-purple-500 transition-colors text-black"
                            placeholder="Ex: Detalhes de design, contacto alternativo, etc."
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Step 3: Confirm */}
            <div>
                 <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                    <span className="bg-purple-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">3</span>
                    Confirme o Pedido
                </h3>
                <button 
                    onClick={handleConfirm}
                    disabled={!isFormValid}
                    className={buttonClasses}
                >
                    {isFormValid ? <i className="fab fa-whatsapp"></i> : <i className="fas fa-lock"></i>}
                    Paguei, Confirmar Pedido
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
