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
};

/**
 * Utilitário de Geocoding (Open-Meteo) para obter Lat/Lon e País
 * Essencial para o fluxo em cascata das APIs
 */
export async function getCoordinates(cityName: string): Promise<GeoData | undefined> {
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const response = await fetch(geoUrl);
    
    if (!response.ok) return undefined;
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) return undefined;
    
    const firstMatch = data.results[0];
    return {
      lat: firstMatch.latitude,
      lon: firstMatch.longitude,
      countryCode: firstMatch.country_code,
      countryName: firstMatch.country,
      admin1: firstMatch.admin1
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
