import { CartItem, Order, PriceDetails } from './types';

// Define os escalões de desconto, ordenados da quantidade mais alta para a mais baixa
const DISCOUNT_TIERS = [
  { threshold: 100, discount: 0.20 }, // 20% para 100+
  { threshold: 50, discount: 0.15 },  // 15% para 50+
  { threshold: 20, discount: 0.10 },  // 10% para 20+
];

/**
 * Calcula o preço de um item do carrinho, aplicando descontos com base na quantidade.
 * @param item - O item do carrinho para o qual o preço será calculado.
 * @returns Um objeto com o preço final, preço original e a percentagem de desconto.
 */
export const calculatePriceDetails = (item: CartItem): PriceDetails => {
  const { product, quantity } = item;
  const isSingleQuantity = product.name === 'Design de Logotipo' || product.name === 'Menu de Restaurante';
  const originalPrice = product.price * quantity;

  // Sem descontos para itens de quantidade única
  if (isSingleQuantity) {
    return {
      finalPrice: originalPrice,
      originalPrice: originalPrice,
      discountApplied: 0,
    };
  }

  const applicableTier = DISCOUNT_TIERS.find(tier => quantity >= tier.threshold);

  if (applicableTier) {
    const discountAmount = originalPrice * applicableTier.discount;
    return {
      finalPrice: originalPrice - discountAmount,
      originalPrice: originalPrice,
      discountApplied: applicableTier.discount * 100,
    };
  }

  // Sem desconto se a quantidade não atingir nenhum limiar de escalão
  return {
    finalPrice: originalPrice,
    originalPrice: originalPrice,
    discountApplied: 0,
  };
};

/**
 * Gera uma mensagem formatada para o WhatsApp com os detalhes do pedido.
 * @param order - O objeto do pedido.
 * @returns A mensagem formatada e codificada para URL.
 */
export const generateOrderWhatsAppMessage = (order: Order): string => {
  const intro = `*Novo Pedido Photo Boost Moz!* 🎉\n\nOlá! Gostaria de confirmar o meu pedido:\n\n*ID do Pedido:* ${order.id}\n*Cliente:* ${order.customerName}\n*Contacto:* ${order.customerContact}\n${order.customerEmail ? `*Email:* ${order.customerEmail}\n` : ''}\n*Itens do Pedido:*\n`;

  const items = order.items.map(item => {
    const priceDetails = calculatePriceDetails(item);
    let itemText = `*${item.product.name}* (Qtd: ${item.quantity})\n`;
    itemText += `Subtotal: ${priceDetails.finalPrice.toLocaleString('pt-MZ')} MZN`;
    if (item.customizationNotes) {
      itemText += `\n  - _Notas: ${item.customizationNotes}_`;
    }
    return itemText;
  }).join('\n\n');

  const notes = order.notes ? `\n\n*Observações Gerais:*\n${order.notes}` : '';

  const total = `\n\n*Total do Pedido: ${order.totalAmount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}*`;
  
  const outro = `\n\nO pagamento será efectuado e o comprovativo enviado em breve. Obrigado!`;

  return encodeURIComponent(intro + items + notes + total + outro);
};

/**
 * Gera uma mensagem para o WhatsApp com os itens do carrinho atual.
 * @param items - A lista de itens no carrinho.
 * @returns A mensagem formatada e codificada para URL.
 */
export const generateCartWhatsAppMessage = (items: CartItem[]): string => {
  if (items.length === 0) {
    const message = "Olá! Gostaria de fazer uma encomenda ou tirar uma dúvida.";
    return encodeURIComponent(message);
  }

  const intro = `*Orçamento Rápido - Photo Boost Moz* 🛒\n\nOlá! Gostaria de um orçamento para os seguintes itens:\n`;

  const itemLines = items.map(item => {
    const priceDetails = calculatePriceDetails(item);
    let itemText = `\n- *${item.product.name}*`;
    itemText += `\n  Qtd: ${item.quantity}`;
    if (item.customizationNotes) {
      itemText += `\n  Notas: _${item.customizationNotes}_`;
    }
    itemText += `\n  Subtotal: ${priceDetails.finalPrice.toLocaleString('pt-MZ')} MZN`;
    return itemText;
  }).join('');

  const totalAmount = items.reduce((total, item) => total + calculatePriceDetails(item).finalPrice, 0);
  const total = `\n\n*Total Estimado: ${totalAmount.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}*`;
  
  const outro = `\n\nAguardo a vossa resposta. Obrigado!`;

  return encodeURIComponent(intro + itemLines + total + outro);
};
