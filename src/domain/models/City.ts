export type City = {
  name: string;
  temperature: number; // em graus Celsius
  costIndex: number; // índice de custo de vida, por exemplo, de 0 a 100
  safetyIndex: number; // índice de segurança, por exemplo, de 0 a 100
  score?: number; // score final calculado da cidade (0 a 10)
};
