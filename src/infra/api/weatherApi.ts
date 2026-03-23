export async function getCityTemperature(cityName: string): Promise<number> {
  try {
    // 1. Pega as Coordenadas (Latitude e Longitude) via Open-Meteo Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`;
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {
      throw new Error(`Falha na API de geocoding ao buscar ${cityName}`);
    }
    
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`Cidade "${cityName}" não encontrada ou sem dados climáticos válidos.`);
    }

    const { latitude, longitude } = geoData.results[0];

    // 2. Com as Exatas Coordenadas, Busca o Clima (Open-Meteo)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      throw new Error(`Falha ao buscar temperatura real para as coordenadas de ${cityName}`);
    }
    
    const weatherData = await weatherResponse.json();
    return weatherData.current_weather.temperature;
  } catch (error) {
    console.error(`Erro em getCityTemperature:`, error);
    throw error; // Repassa erro para a camada App
  }
}
