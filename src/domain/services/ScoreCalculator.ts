import type { City } from '../models/City';

export class ScoreCalculator {
  /**
   * Calcula o score final de uma cidade, normalizando índices de 0 a 10.
   * score = (segurança * 0.4) + (custo invertido * 0.3) + (clima * 0.3)
   */
  static calculate(city: City): number {
    const safetyScore = ScoreCalculator.normalizeSafety(city.safetyIndex);
    const costScore = ScoreCalculator.normalizeCost(city.costIndex);
    const weatherScore = ScoreCalculator.normalizeWeather(city.temperature);

    const finalScore = (safetyScore * 0.4) + (costScore * 0.3) + (weatherScore * 0.3);
    
    // Arredondar para duas casas decimais
    return Math.round(finalScore * 100) / 100;
  }

  /**
   * Normaliza o índice de segurança (esperado de 0 a 100) para 0 a 10.
   */
  private static normalizeSafety(safetyIndex: number): number {
    const score = safetyIndex / 10;
    return ScoreCalculator.clamp(score, 0, 10);
  }

  /**
   * Normaliza o índice de custo de vida (0 a ~100) invertendo-o, 
   * de modo que um custo menor resulte num score maior (0 a 10).
   */
  private static normalizeCost(costIndex: number): number {
    // Exemplo: costIndex 100 => score 0; costIndex 50 => score 5; costIndex 0 => score 10
    const score = 10 - (costIndex / 10);
    return ScoreCalculator.clamp(score, 0, 10);
  }

  /**
   * Normaliza a temperatura em graus Celsius para um score de 0 a 10.
   * Temperatura ideal = 24ºC (recebe 10).
   * Temperatura muito fora ganha menos pontos (perde 0.5 a cada 1ºC de distância).
   */
  private static normalizeWeather(temperature: number): number {
    const IDEAL_TEMP = 24;
    const diff = Math.abs(temperature - IDEAL_TEMP);
    const score = 10 - (diff * 0.5);
    return ScoreCalculator.clamp(score, 0, 10);
  }

  /**
   * Garante que o score fique no intervalo desejado (min a max).
   */
  private static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
