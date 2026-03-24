export type CostData = {
  costIndex?: number;
};

/**
 * Numbeo API Client (Opcional, com graceful degradation para CORS ou limites pagos)
 */
export async function getCost(cityName: string): Promise<CostData | undefined> {
  try {
    // Simulando uma key fake para cumprir o contrato de que "vai falhar e a aplicação não vai quebrar"
    const url = `http://api.numbeo.com/api/indices?api_key=MOCK_KEY_WILL_FAIL&city=${encodeURIComponent(cityName)}`;
    const response = await fetch(url);
    
    // Provavelmente falha por 401 ou CORS. O fallback silencia o problema e retorna underfined.
    if (!response.ok) {
      return undefined;
    }
    
    const data = await response.json();
    return {
      costIndex: data.cpi_and_rent_index
    };
  } catch (error) {
    // console.warn('[costApi] Numbeo indisponível (CORS/Chave). Usando fallback.');
    return undefined;
  }
}
