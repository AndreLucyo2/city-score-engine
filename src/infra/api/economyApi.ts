export type EconomyData = {
  gdp?: number;
};

/**
 * Busca o "Gross Domestic Product" (PIB) do país a partir da API do Banco Mundial.
 * Espera receber o código ISO-2 Alpha de um país ou nome (ex: BR, US, Deu).
 * A api retornará um Array com Metadados[0] e Dados reais[1].
 */
export async function getEconomy(countryCode: string): Promise<EconomyData | undefined> {
  try {
    // Código do WorldBank Indicator de GDP em US$ = NY.GDP.MKTP.CD
    const url = `https://api.worldbank.org/v2/country/${encodeURIComponent(countryCode)}/indicator/NY.GDP.MKTP.CD?format=json`;
    const response = await fetch(url);
    
    // Se estourou requisição ou deu falha de HTTP...
    if (!response.ok) return undefined;
    
    const rawData = await response.json();
    
    // Formato estranho do World Bank:
    // Se der Match sem dados o array vêm assim: [{page:1..}, null]
    // Se der mismatch bruto pode vir com erro formatado json
    if (!rawData || !rawData[1] || rawData[1].length === 0) {
      return undefined;
    }

    // Procura na lista o dado mais recente de PIB que seja diferente de null
    const validGDPNode = rawData[1].find((item: any) => item.value !== null);
    
    return {
      gdp: validGDPNode ? validGDPNode.value : undefined
    };
  } catch (error) {
    console.error('[economyApi] Falha na integração do World Bank:', error);
    return undefined; // Sem lançar throw, atende ao Graceful Degradation do prompt
  }
}
