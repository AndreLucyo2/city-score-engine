import type { City } from '../../domain/models/City';

export function CityCard(city: City, index: number): string {
  // Define cores de acordo com a nota
  let scoreClass = 'score-low';
  if ((city.score || 0) >= 7) {
    scoreClass = 'score-high';
  } else if ((city.score || 0) >= 4) {
    scoreClass = 'score-medium';
  }

  const winnerClass = index === 0 ? 'winner' : '';
  const crown = index === 0 ? '👑 ' : '';

  // Formatadores de display
  const gdpDisplay = city.gdp ? `$${(city.gdp / 1e12).toFixed(2)} Tri` : 'N/A';
  const countryPop = city.population ? (city.population / 1e6).toFixed(1) + ' Mi' : 'N/A';
  
  // Como lidar com os novos dados:
  const cityPop = city.cityPopulation ? (city.cityPopulation / 1e6 < 1 ? city.cityPopulation.toLocaleString('pt-BR') : (city.cityPopulation / 1e6).toFixed(1) + ' Mi') : 'N/A';
  
  // Utilidade para criar Pill de indice Teleport
  const renderIndexPill = (value?: number) => {
    if (value === undefined) return `<span class="pill pill-off">N/A</span>`;
    const color = value >= 70 ? 'var(--accent)' : (value >= 40 ? 'var(--warning)' : 'var(--danger)');
    return `<span class="pill" style="color: ${color}; border-color: ${color}">${value}/100</span>`;
  };

  return `
    <div class="glass-card city-card fade-in ${winnerClass}" style="animation-delay: ${index * 0.15}s">
      <div class="city-header" style="margin-bottom: 1rem">
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

        <div class="metric-group-title">Métricas da Cidade</div>
        
        <div class="metric">
          <span class="metric-icon">🌡️</span>
          <div class="metric-data">
            <span class="metric-label">Clima & Geo</span>
            <span class="metric-value">
              ${city.temperature.toFixed(1)}°C <span style="font-size:0.8rem;opacity:0.6">(${city.weatherDesc || ''})</span>
              ${city.elevation !== undefined ? `<br><small style="opacity:0.5">Alt: ${city.elevation}m</small>` : ''}
            </span>
          </div>
        </div>

        <div class="metric">
          <span class="metric-icon">🏙️</span>
          <div class="metric-data">
            <span class="metric-label">Estrutura Local</span>
            <span class="metric-value">
              Pop: ${cityPop} 
              ${city.timezone ? `<br><small style="opacity:0.5">Fuso: ${city.timezone}</small>` : ''}
            </span>
          </div>
        </div>
        
        <div class="metric-group-title">Índices de Qualidade (0-100)</div>
        
        <div class="metric-indexes-grid">
          <div class="index-item">
            <span class="metric-label">Custo Vida</span>
            ${renderIndexPill(city.costIndex)}
          </div>
          <div class="index-item">
            <span class="metric-label">Segurança</span>
            ${renderIndexPill(city.safetyIndex)}
          </div>
          <div class="index-item">
            <span class="metric-label">Saúde</span>
            ${renderIndexPill(city.healthcare)}
          </div>
          <div class="index-item">
            <span class="metric-label">Educação</span>
            ${renderIndexPill(city.education)}
          </div>
          <div class="index-item">
            <span class="metric-label">Meio Amb.</span>
            ${renderIndexPill(city.environment)}
          </div>
          <div class="index-item" style="border-left: 1px solid rgba(255,255,255,0.2); padding-left: 8px">
            <span class="metric-label" style="color:var(--primary)">QoL Global</span>
            ${renderIndexPill(city.qualityOfLifeScore)}
          </div>
        </div>

        <div class="metric-group-title">Dados Nacionais (País)</div>
        
        <div class="metric" style="padding: 0.5rem">
          <span class="metric-icon">🌎</span>
          <div class="metric-data">
            <span class="metric-value" style="font-size: 0.95rem">
              Pop: ${countryPop} | PIB: ${gdpDisplay} 
              <br><small style="opacity:0.5">Moeda: ${city.currency || 'N/A'}</small>
            </span>
          </div>
        </div>

      </div>
    </div>
  `;
}
