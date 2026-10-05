// Número internacional, solo dígitos. Ejemplo de formato peruano: 51 + 9 dígitos.
// También se puede configurar PUBLIC_WHATSAPP_NUMBER antes de compilar.
export const store = {
    whatsappNumber: import.meta.env?.PUBLIC_WHATSAPP_NUMBER || '51952468361',
};
