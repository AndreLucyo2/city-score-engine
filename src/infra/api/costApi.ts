/**
 * Busca o índice de custo de vida da cidade (0 a 100).
 * Para fins de MVP (já que não existem APIs gratuitas como a do Numbeo sem Paywall/CORS),
 * utilizamos um algoritmo determinístico que sempre gera o mesmo score realístico para a mesma cidade.
 */
export async function getCityCostIndex(cityName: string): Promise<number> {
  // Simulação de delay de rede
  await new Promise(resolve => setTimeout(resolve, 600));

  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
     hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Limita o valor entre 0 e 100 (Custo)
  const normalized = Math.abs(hash) % 101; 
  return normalized;
}
