export type City = {
  name: string;
  temperature: number; // em graus Celsius
  costIndex: number; // índice de custo de vida, por exemplo, de 0 a 100
  safetyIndex: number; // índice de segurança, por exemplo, de 0 a 100
  score?: number; // score final calculado da cidade (0 a 10)
  
  // Novos dados adicionados pelas APIs integradas:
  weatherDesc?: string;
  population?: number; // do País
  currency?: string;
  gdp?: number;
  countryName?: string;
  admin1?: string;
  
  // Detalhes extras de Geocoding
  cityPopulation?: number;
  timezone?: string;
  elevation?: number;

  // Detalhes extras de Qualidade de Vida (0 a 100)
  healthcare?: number;
  education?: number;
  environment?: number;
  qualityOfLifeScore?: number;
};
