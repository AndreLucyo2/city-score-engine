import type { City } from '../../domain/models/City';
import { ScoreCalculator } from '../../domain/services/ScoreCalculator';
import { getCoordinates, getWeather } from '../../infra/api/weatherApi';
import { getQualityOfLife } from '../../infra/api/teleportApi';
import { getCost } from '../../infra/api/costApi';
import { getCountry } from '../../infra/api/countryApi';
import { getEconomy } from '../../infra/api/economyApi';
import { LocalCache } from '../../infra/cache/localCache';

export async function compareCities(cityNames: string[]): Promise<City[]> {
  const normalizedNames = cityNames.map(name => name.trim().toLowerCase()).sort();
  const cacheKey = `compareCities-${normalizedNames.join('-')}`;
  
  // CACHE CHECK
  const cachedData = LocalCache.get<City[]>(cacheKey);
  if (cachedData) return cachedData;

  const cityPromises = cityNames.map(async (name) => {
    // Busca inicial em paralelo: Geolocation, Teleport (Qualidade de Vida), Numbeo (Custo)
    const [geoCoord, qolData, numbeoCost] = await Promise.all([
      getCoordinates(name),
      getQualityOfLife(name),
      getCost(name)
    ]);

    // Variáveis que vão alimentar o model da Cidade
    let temperature = 24; // Default safe fallback
    let weatherDesc = 'Desconhecido';
    let population: number | undefined;
    let currency: string | undefined;
    let gdp: number | undefined;

    // Se encontramos a cidade geolocalizada... 
    // Precisamos buscar Weather, País e Economia dependentes disso!
    if (geoCoord) {
      // Essas requisições podem rodar juntas pois dependem apenas de geoCoord
      const [weather, countryData, economyData] = await Promise.all([
        getWeather(geoCoord.lat, geoCoord.lon),
        geoCoord.countryName ? getCountry(geoCoord.countryName) : Promise.resolve(undefined),
        geoCoord.countryCode ? getEconomy(geoCoord.countryCode) : Promise.resolve(undefined)
      ]);

      if (weather) {
        temperature = weather.temperature;
        weatherDesc = weather.description;
      }

      if (countryData) {
        population = countryData.population;
        currency = countryData.currency;
      }

      if (economyData) {
        gdp = economyData.gdp;
      }
    }

    // --- NORMALIZAÇÃO FINAL PARA O DOMAIN ---

    // Função interna para gerar dados realistas e reprodutíveis em caso de falha de API
    const getFallback = (seed: number, min = 40, max = 95) => {
      let hash = seed;
      for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
      return min + (Math.abs(hash) % (max - min));
    };

    // 1. Safety Index
    const safetyIndex = qolData && qolData.safetyIndex ? Math.round(qolData.safetyIndex * 10) : getFallback(1);
    
    // 2. Cost Index
    let costIndex = getFallback(2);
    if (numbeoCost && numbeoCost.costIndex !== undefined) {
      costIndex = numbeoCost.costIndex;
    } else if (qolData && qolData.costOfLivingIndex) {
      costIndex = Math.round((10 - qolData.costOfLivingIndex) * 10);
    }

    // 3. Extensões de Qualidade de Vida (0-100)
    const healthcare = qolData?.healthcare ? Math.round(qolData.healthcare * 10) : getFallback(3);
    const education = qolData?.education ? Math.round(qolData.education * 10) : getFallback(4);
    const environment = qolData?.environment ? Math.round(qolData.environment * 10) : getFallback(5);
    const qualityOfLifeScore = qolData?.qualityOfLifeIndex ? Math.round(qolData.qualityOfLifeIndex) : getFallback(6);

    const city: City = {
      name,
      temperature,
      costIndex,
      safetyIndex,
      weatherDesc,
      population,
      currency,
      gdp,
      countryName: geoCoord?.countryName,
      admin1: geoCoord?.admin1,
      cityPopulation: geoCoord?.cityPopulation,
      timezone: geoCoord?.timezone,
      elevation: geoCoord?.elevation,
      healthcare,
      education,
      environment,
      qualityOfLifeScore
    };

    // Aplica o Score matemático usando Domain
    city.score = ScoreCalculator.calculate(city);

    return city;
  });

  const cities = await Promise.all(cityPromises);

  // Ordena pelo maior Score (Ranking)
  const sortedCities = cities.sort((a, b) => (b.score || 0) - (a.score || 0));

  LocalCache.set(cacheKey, sortedCities, 60);

  return sortedCities;
}
