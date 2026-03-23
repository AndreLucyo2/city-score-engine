/**
 * Busca o índice de segurança da cidade (0 a 100).
 * Igual ao Custo de Vida, usamos algoritmo pseudorrandômico pelo nome.
 */
export async function getCitySafetyIndex(cityName: string): Promise<number> {
  // Simulação de delay de rede
  await new Promise(resolve => setTimeout(resolve, 450));

  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
     hash = cityName.charCodeAt(i) + ((hash << 7) - hash);
  }
  
  // Limita o valor entre 0 e 100 (Segurança)
  const normalized = Math.abs(hash) % 101; 
  return normalized;
}
