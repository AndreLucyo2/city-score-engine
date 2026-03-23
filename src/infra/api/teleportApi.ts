export type QualityOfLifeData = {
  qualityOfLifeIndex: number;
  safetyIndex: number;
  costOfLivingIndex: number;
};

/**
 * Consome a API do Teleport fazendo o caminho do HATEOAS:
 * Search City -> Item -> Urban Area -> Scores
 */
export async function getQualityOfLife(cityName: string): Promise<QualityOfLifeData | undefined> {
  try {
    // 1. Busca a cidade para pegar o Link Principal
    const searchUrl = `https://api.teleport.org/api/cities/?search=${encodeURIComponent(cityName)}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return undefined;
    
    const searchData = await searchRes.json();
    const cityItems = searchData._embedded?.['city:search-results'];
    
    if (!cityItems || cityItems.length === 0) {
      return undefined; // Cidade não encontrada
    }
    
    // Pega a URL do item específico
    const cityUrl = cityItems[0]._links['city:item'].href;
    
    // 2. Acessa o Item da Cidade para pegar o Link da Urban Area
    const cityRes = await fetch(cityUrl);
    if (!cityRes.ok) return undefined;
    const cityData = await cityRes.json();
    
    const urbanAreaUrl = cityData._links?.['city:urban_area']?.href;
    
    if (!urbanAreaUrl) {
      return undefined; // Cidade pequena, sem Scores mapeados no Urban Area
    }
    
    // 3. Busca os Scores Finais da Urban Area
    const scoresUrl = `${urbanAreaUrl}scores/`;
    const scoresRes = await fetch(scoresUrl);
    if (!scoresRes.ok) return undefined;
    const scoresData = await scoresRes.json();
    
    // Estrutura de categories: { name: 'Safety', score_out_of_10: 7.5 }
    const categories: any[] = scoresData.categories || [];
    
    // Função utilitária interna
    const getScore = (name: string): number => {
      const cat = categories.find(c => c.name === name);
      return cat ? cat.score_out_of_10 : 0;
    };

    return {
      qualityOfLifeIndex: scoresData.teleport_city_score || 0,
      safetyIndex: getScore('Safety'),
      costOfLivingIndex: getScore('Cost of Living')
    };
  } catch (error) {
    console.error('[teleportApi] Falha na integração:', error);
    return undefined; // Nunca quebra a app
  }
}
