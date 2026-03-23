export type CountryData = {
  population: number;
  currency: string;
};

/**
 * Busca dados extras do País pela API "REST Countries".
 * Espera o nome principal do País em Inglês (ex: 'Brazil', 'Germany') 
 * provido pela camada App.
 */
export async function getCountry(countryName: string): Promise<CountryData | undefined> {
  try {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return undefined;
    }
    
    const data = await response.json();
    
    // O array pode ser vazio
    if (!data || data.length === 0) return undefined;
    
    // Pega o primeiro país que combinou
    const country = data[0];
    
    // As moedas ficam num Objeto dinâmico: { "BRL": { "name": "...", "symbol": "..." } }
    // Vamos pegar a primeira key.
    const currencyKeys = country.currencies ? Object.keys(country.currencies) : [];
    const mainCurrency = currencyKeys.length > 0 ? currencyKeys[0] : 'Unknown';

    return {
      population: country.population || 0,
      currency: mainCurrency
    };
  } catch (error) {
    console.error('[countryApi] Falha na integração:', error);
    return undefined; // Preserva o ecossistema e apenas retorna sem os dados extras
  }
}
