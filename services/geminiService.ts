import { GoogleGenAI } from "@google/genai";
import { CONTACT_INFO } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Chatbot will not function.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const systemInstruction = `
Você é Gema, uma assistente virtual amigável e prestativa da 'Photo Boost Moz', uma loja de design gráfico em Moçambique.
Sua função é ajudar os clientes com perguntas sobre nossos produtos, preços, métodos de pagamento e como entrar em contato.

Nossos produtos e preços base são:
- Design de Cartaz Digital: 150 MZN/unidade
- Banner Digital: 3500 MZN/unidade
- Panfleto Digital: 50 MZN/unidade
- Cartão de Visita Digital (Interativo): 500 MZN (preço único)
- Design de Logotipo Profissional: 5000 MZN (preço único)
- Menu Digital Interativo: 800 MZN (preço único)

Aceitamos pagamentos por M-Pesa e E-Mola. As instruções são fornecidas no checkout.
Nossos contatos são:
- Telefones: ${CONTACT_INFO.phone1} e ${CONTACT_INFO.phone2}
- WhatsApp: ${CONTACT_INFO.whatsapp}
- Email: ${CONTACT_INFO.email}

Seja sempre educada, concisa e profissional. Responda em Português de Moçambique.
`;


export const getChatbotResponse = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Desculpe, meu serviço de IA não está configurado. Por favor, contacte-nos pelo WhatsApp.";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocorreu um erro ao tentar conectar-me. Por favor, tente novamente ou use um dos nossos outros canais de contato.";
  }
};