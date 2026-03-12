// Mensajes personalizados según el usuario
// Se elige aleatoriamente cada que inicia sesión

export const WELCOME_MESSAGES = {
  LPINA: [
    "¡HOLA LPINA! DISFRUTA TUS CARTAS",
    "LPINA, BIENVENIDO A TU COLECCIÓN DE AMOR",
    "¡LPINA! TUS CARTAS TE ESTÁN ESPERANDO",
    "QUÉ ALEGRÍA VERTE LPINA, EXPLORA TUS CARTAS",
    "LPINA, CADA CARTA TIENE UNA HISTORIA PARA TI",
    "BIENVENIDO LPINA, ¿CUÁL CARTA LEERÁS HOY?"
  ],
  FLORY: [
    "¡HOLA FLORY! DISFRUTA TUS CARTAS",
    "FLORY, BIENVENIDA A TU COLECCIÓN DE AMOR",
    "¡FLORY! TUS CARTAS TE ESTÁN ESPERANDO",
    "QUÉ ALEGRÍA VERTE FLORY, EXPLORA TUS CARTAS",
    "FLORY, CADA CARTA CONTIENE UN MENSAJE ESPECIAL",
    "BIENVENIDA FLORY, ¿CUÁL CARTA LEERÁS HOY?"
  ]
};

export const READING_MESSAGES = {
  LPINA: [
    "¿NO TE LATE LEER UNA CARTA NUEVA LPINA?",
    "LPINA, HAY MÁS CARTAS ESPERANDO POR TI",
    "¿CUÁL SERÁ LA PRÓXIMA CARTA LPINA?",
    "LPINA, ABRE UNA NUEVA CARTA Y SONRÍE",
    "¿LISTA PARA OTRA CARTA LPINA?",
    "LPINA, SIGUE LEYENDO TUS CARTAS ESPECIALES"
  ],
  FLORY: [
    "¿NO TE LATE LEER UNA CARTA NUEVA FLORY?",
    "FLORY, HAY MÁS CARTAS ESPERANDO POR TI",
    "¿CUÁL SERÁ LA PRÓXIMA CARTA FLORY?",
    "FLORY, ABRE UNA NUEVA CARTA Y SONRÍE",
    "¿LISTA PARA OTRA CARTA FLORY?",
    "FLORY, SIGUE LEYENDO TUS CARTAS ESPECIALES"
  ]
};

// Función para obtener un mensaje aleatorio
export function getRandomWelcomeMessage(username) {
  const messages = WELCOME_MESSAGES[username] || WELCOME_MESSAGES.LPINA;
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getRandomReadingMessage(username) {
  const messages = READING_MESSAGES[username] || READING_MESSAGES.LPINA;
  return messages[Math.floor(Math.random() * messages.length)];
}
