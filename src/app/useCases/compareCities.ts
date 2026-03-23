import type { City } from '../../domain/models/City';
import { ScoreCalculator } from '../../domain/services/ScoreCalculator';
import { getCityTemperature } from '../../infra/api/weatherApi';
import { getCityCostIndex } from '../../infra/api/costApi';
import { getCitySafetyIndex } from '../../infra/api/safetyApi';
import { LocalCache } from '../../infra/cache/localCache';

export async function compareCities(cityNames: string[]): Promise<City[]> {
  // Cria uma chave de cache consistente (ex: compareCities-saopaulo-tokyo)
  const normalizedNames = cityNames.map(name => name.trim().toLowerCase()).sort();
  const cacheKey = `compareCities-${normalizedNames.join('-')}`;
  
  // 1. TENTA RECUPERAR DO CACHE
  const cachedData = LocalCache.get<City[]>(cacheKey);
  if (cachedData) {
    console.log('Dados do LocalStorage recuperados com sucesso:', cachedData);
    return cachedData;
  }

  // Se não tem no cache, continua executando os fetchs
  const cityPromises = cityNames.map(async (name) => {
    // 2. BUSCA NA INFRA (APIs)
    // Fazemos Promise.all para as requisições das 3 APIs da mesma cidade rodarem em paralelo
    const [temperature, costIndex, safetyIndex] = await Promise.all([
      getCityTemperature(name),
      getCityCostIndex(name),
      getCitySafetyIndex(name)
    ]);

    // 3. RETORNA OBJETO SEGUINDO O CONTRATO (DOMAIN)
    const city: City = {
      name,
      temperature,
      costIndex,
      safetyIndex,
    };

    // 4. CHAMA REGRA DE NEGÓCIO PURA (DOMAIN)
    city.score = ScoreCalculator.calculate(city);

    return city;
  });

  const cities = await Promise.all(cityPromises);

  // 5. ORDENA pelo maior Score (Ranking)
  const sortedCities = cities.sort((a, b) => (b.score || 0) - (a.score || 0));

  // 6. SALVA NO CACHE com o TTL de 60 minutos (estabelecido no requisito)
  LocalCache.set(cacheKey, sortedCities, 60);

  return sortedCities;
}
