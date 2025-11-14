
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, customizationNotes: string) => void;
  onToggleWishlist: (productId: number) => void;
  isInWishlist: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, onToggleWishlist, isInWishlist }) => {
  if (!product) return null;

  const isSingleQuantity = product.name === 'Design de Logotipo' || product.name === 'Menu de Restaurante';
  
  const [quantity, setQuantity] = useState('1');
  const [customizationNotes, setCustomizationNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [mainImage, setMainImage] = useState(product.galleryImages[0] || product.image);

  useEffect(() => {
    // Reset state when product changes
    if (product) {
      setQuantity('1');
      setIsAdded(false);
      setCustomizationNotes('');
      setMainImage(product.galleryImages[0] || product.image);
    }
  }, [product]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or positive integers
    if (value === '' || /^[1-9]\d*$/.test(value)) {
        setQuantity(value);
    }
  };

  const handleBlur = () => {
      if (quantity.trim() === '' || parseInt(quantity, 10) < 1) {
          setQuantity('1');
      }
  }

  const handleAddToCart = () => {
    const numQuantity = isSingleQuantity ? 1 : parseInt(quantity, 10);

    if (isNaN(numQuantity) || numQuantity < 1) {
      return; // Should be blocked by disabled button, but as a safeguard
    }

    onAddToCart(product, numQuantity, customizationNotes);
    setIsAdded(true);
    setTimeout(() => {
      onClose(); // Fecha o modal após adicionar
    }, 1500);
  };

  const isQuantityValid = isSingleQuantity || (quantity.trim() !== '' && !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) > 0);

  return (
    <div 
        className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10">
          <i className="fas fa-times text-2xl"></i>
        </button>
        
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
            <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
                 <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
            </div>
            <div className="flex gap-2 justify-center">
                {product.galleryImages.map((img, index) => (
                    <div 
                        key={index}
                        className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === img ? 'border-purple-500' : 'border-transparent'}`}
                        onClick={() => setMainImage(img)}
                    >
                        <img src={img} alt={`${product.name} - imagem ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
        </div>
        
        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h2>
           <p className="text-2xl font-bold text-purple-600 mb-4">
            {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
            {!isSingleQuantity && <span className="text-sm font-normal text-gray-500"> /unid.</span>}
          </p>
          <p className="text-gray-600 mb-6">{product.longDescription}</p>

          <div className="mb-6">
              <label htmlFor="customization-notes" className="block text-sm font-medium text-gray-700 mb-2">
                Detalhes da Personalização (opcional)
              </label>
              <textarea
                  id="customization-notes"
                  rows={3}
                  value={customizationNotes}
                  onChange={(e) => setCustomizationNotes(e.target.value)}
                  disabled={isAdded}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:bg-gray-200"
                  placeholder="Ex: Cores, texto a incluir, estilo, links de referência, etc."
              ></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <div className="flex-grow flex items-center gap-2">
                {!isSingleQuantity && (
                    <div className="w-full sm:w-1/3">
                        <label htmlFor="quantity-input" className="sr-only">Quantidade</label>
                        <input
                            id="quantity-input"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={handleQuantityChange}
                            onBlur={handleBlur}
                            disabled={isAdded || isSingleQuantity}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:bg-gray-200 text-center"
                            aria-label="Quantidade do produto"
                        />
                    </div>
                )}
              <button
                onClick={handleAddToCart}
                disabled={isAdded || !isQuantityValid}
                className={`w-full text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-lg ${
                  isAdded
                    ? 'bg-green-500 cursor-not-allowed'
                    : !isQuantityValid 
                    ? 'bg-purple-300 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isAdded ? (
                  <>
                    <i className="fas fa-check"></i>
                    Adicionado!
                  </>
                ) : (
                  <>
                    <i className="fas fa-cart-plus"></i>
                    Adicionar
                  </>
                )}
              </button>
            </div>
             <button
                onClick={() => onToggleWishlist(product.id)}
                disabled={isAdded}
                className={`w-auto text-lg font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center border-2 ${
                    isAdded
                    ? 'cursor-not-allowed bg-gray-200 border-gray-200 text-gray-400'
                    : isInWishlist
                    ? 'bg-red-100 border-red-500 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={isInWishlist ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
            >
                <i className={`${isInWishlist ? 'fas' : 'far'} fa-heart text-xl`}></i>
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};
