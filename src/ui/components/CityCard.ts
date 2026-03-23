import type { City } from '../../domain/models/City';

export function CityCard(city: City, index: number): string {
  // Define cores de acordo com a nota
  let scoreClass = 'score-low';
  if ((city.score || 0) >= 7) {
    scoreClass = 'score-high';
  } else if ((city.score || 0) >= 4) {
    scoreClass = 'score-medium';
  }

  // O index 0 no array sorteado é o vencedor
  const winnerClass = index === 0 ? 'winner' : '';
  const crown = index === 0 ? '👑 ' : '';

  // Formata o PIB (GDP) em trilhões ou bilhões de dólares se existir
  let gdpDisplay = 'N/A';
  if (city.gdp) {
    if (city.gdp >= 1e12) gdpDisplay = `$${(city.gdp / 1e12).toFixed(2)} Tri`;
    else if (city.gdp >= 1e9) gdpDisplay = `$${(city.gdp / 1e9).toFixed(2)} Bi`;
    else gdpDisplay = `$${(city.gdp / 1e6).toFixed(2)} Mi`;
  }

  // População em milhões
  let popDisplay = 'N/A';
  if (city.population) {
    if (city.population >= 1e6) popDisplay = `${(city.population / 1e6).toFixed(1)} Mi`;
    else popDisplay = city.population.toLocaleString('pt-BR');
  }

  return `
    <div class="glass-card city-card fade-in ${winnerClass}" style="animation-delay: ${index * 0.15}s">
      <div class="city-header">
        <h2>
          ${crown}${city.name}
          <div style="font-size: 0.8rem; font-weight: normal; opacity: 0.6; margin-top: 4px; line-height: 1.2">
            ${city.admin1 ? city.admin1 + ', ' : ''}${city.countryName || 'Local não mapeado'}
          </div>
        </h2>
        <div class="score-badge ${scoreClass}">
          ${city.score?.toFixed(1) || '0.0'}
        </div>
      </div>
      
      <div class="city-metrics">
        <!-- Métricas Naturais -->
        <div class="metric">
          <span class="metric-icon">🌡️</span>
          <div class="metric-data">
            <span class="metric-label">Clima Atual</span>
            <span class="metric-value">${city.temperature.toFixed(1)}°C <span style="font-size:0.8rem;opacity:0.6">(${city.weatherDesc || ''})</span></span>
          </div>
        </div>
        
        <!-- Qualidade de Vida -->
        <div class="metric">
          <span class="metric-icon">💰</span>
          <div class="metric-data">
            <span class="metric-label">Custo de Vida</span>
            <span class="metric-value">${city.costIndex} <span style="font-size:0.8rem;opacity:0.6">/ 100</span></span>
          </div>
        </div>
        
        <div class="metric">
          <span class="metric-icon">🛡️</span>
          <div class="metric-data">
            <span class="metric-label">Segurança</span>
            <span class="metric-value">${city.safetyIndex} <span style="font-size:0.8rem;opacity:0.6">/ 100</span></span>
          </div>
        </div>
        
        <!-- Novos Dados Econômicos / Países -->
        <div class="metric" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; margin-top: 0.5rem">
          <span class="metric-icon">🌎</span>
          <div class="metric-data">
            <span class="metric-label">População do País</span>
            <span class="metric-value">${popDisplay}</span>
          </div>
        </div>

        <div class="metric">
          <span class="metric-icon">💸</span>
          <div class="metric-data">
            <span class="metric-label">PIB (Banco Mundial)</span>
            <span class="metric-value">${gdpDisplay} <span style="font-size:0.8rem;opacity:0.6">(${city.currency || 'Moeda ?'})</span></span>
          </div>
        </div>

      </div>
    </div>
  `;
}
