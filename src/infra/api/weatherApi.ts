export type WeatherData = {
  temperature: number;
  description: string;
};

export type GeoData = {
  lat: number;
  lon: number;
  countryCode: string;
  countryName: string;
  admin1?: string;
  cityPopulation?: number;
  timezone?: string;
  elevation?: number;
};

/**
 * Utilitário de Geocoding (Open-Meteo) para obter Lat/Lon e País
 * Essencial para o fluxo em cascata das APIs
 */
export async function getCoordinates(query: string): Promise<GeoData | undefined> {
  try {
    // Permite que o usuário digite "Toledo, PR" ou "Toledo - BR"
    const parts = query.split(/[,-]/).map(p => p.trim());
    const cityName = parts[0];
    const qualifier = parts.length > 1 ? parts[1].toLowerCase() : '';

    // Busca 20 resultados em vez de apenas 1
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=20&language=en&format=json`;
    const response = await fetch(geoUrl);
    
    if (!response.ok) return undefined;
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) return undefined;
    
    // Fallback normal é o primeiro match (cidade mais famosa com aquele nome)
    let bestMatch = data.results[0];

    // Se o usuário digitou uma sigla (qualifier), tentamos encontrar na array!
    if (qualifier) {
      const foundMatch = data.results.find((res: any) => {
        const countryCode = (res.country_code || '').toLowerCase();
        const country = (res.country || '').toLowerCase();
        const state = (res.admin1 || '').toLowerCase();

        return countryCode === qualifier || 
               country === qualifier || 
               state === qualifier ||
               state.includes(qualifier) ||
               country.includes(qualifier);
      });

      if (foundMatch) {
        bestMatch = foundMatch; // Sobrescreve pelo que deu o match perfeito!
      }
    }

    return {
      lat: bestMatch.latitude,
      lon: bestMatch.longitude,
      countryCode: bestMatch.country_code,
      countryName: bestMatch.country,
      admin1: bestMatch.admin1,
      cityPopulation: bestMatch.population,
      timezone: bestMatch.timezone,
      elevation: bestMatch.elevation
    };
  } catch (error) {
    console.error('[weatherApi getCoordinates] Falha de resolução:', error);
    return undefined;
  }
}

/**
 * Busca o clima atual na Open-Meteo usando latitude e longitude.
 * @param lat Latitude
 * @param lon Longitude
 */
export async function getWeather(lat: number, lon: number): Promise<WeatherData | undefined> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return undefined; // Fallback silencioso conforme exigido
    }
    
    const data = await response.json();
    
    if (!data.current_weather) {
      return undefined;
    }

    const code = data.current_weather.weathercode;
    let desc = 'Desconhecido';
    if (code === 0) desc = 'Céu Limpo ☀️';
    else if (code <= 3) desc = 'Nublado ⛅';
    else if (code <= 69) desc = 'Chuva Leve ☔';
    else if (code <= 99) desc = 'Tempestade ⛈️';

    return {
      temperature: data.current_weather.temperature,
      description: desc
    };
  } catch (error) {
    console.error('[weatherApi] Falha na integração:', error);
    return undefined;
  }
}
