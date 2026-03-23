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

  return `
    <div class="glass-card city-card fade-in ${winnerClass}" style="animation-delay: ${index * 0.15}s">
      <div class="city-header">
        <h2>${crown}${city.name}</h2>
        <div class="score-badge ${scoreClass}">
          ${city.score?.toFixed(1) || '0.0'}
        </div>
      </div>
      
      <div class="city-metrics">
        <div class="metric">
          <span class="metric-icon">🌡️</span>
          <div class="metric-data">
            <span class="metric-label">Clima Atual</span>
            <span class="metric-value">${city.temperature.toFixed(1)}°C</span>
          </div>
        </div>
        
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
      </div>
    </div>
  `;
}
