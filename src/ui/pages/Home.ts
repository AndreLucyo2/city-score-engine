import { compareCities } from '../../app/useCases/compareCities';
import { CityCard } from '../components/CityCard';

export function renderHome(container: HTMLElement) {
  // Estrutura inicial da tela
  container.innerHTML = `
    <div class="home-container">
      <header class="app-header fade-in">
        <h1 style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
            <path d="M2 14l3.5-3.5a2 2 0 0 1 2.8 0l3.4 3.4a2 2 0 0 0 2.8 0L22 6" stroke="var(--accent)"></path>
          </svg>
          City Score Engine
        </h1>
        <p>Transformando dados em decisão prática. Em qual cidade vale a pena morar?</p>
      </header>

      <main class="app-main">
        <section class="glass-card form-section slide-up">
          <form id="compare-form" class="compare-form">
            <div class="input-group">
              <input type="text" id="city1" placeholder="Ex: Toledo, PR" required autocomplete="off" />
              <div class="vs-badge">VS</div>
              <input type="text" id="city2" placeholder="Ex: Marau, BR" required autocomplete="off" />
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: -0.5rem; text-align: center">
              💡 Dica: Para cidades com nomes comuns, digite sua sigla do Estado ou País (ex: <strong>Toledo, PR</strong> ou <strong>Toledo, BR</strong>) para garantir a localização exata de Geocoding.
            </p>
            <button type="submit" class="btn-primary" id="compare-btn">
              <span>Comparar Cidades</span>
            </button>
          </form>
        </section>

        <section id="results-container" class="results-container">
          <!-- Os cards das cidades ou spinners aparecerão aqui -->
        </section>
      </main>

      <footer class="fade-in" style="animation-delay: 0.6s; text-align: center; margin-top: 4rem; margin-bottom: 1rem; font-size: 0.8rem; color: var(--text-muted);">
        <p style="opacity: 0.8">Fontes Oficiais de Dados:</p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 0.5rem; flex-wrap: wrap">
          <a href="https://open-meteo.com" target="_blank" style="color: var(--text-muted); text-decoration: underline;">Open-Meteo</a>
          <a href="https://teleport.org" target="_blank" style="color: var(--text-muted); text-decoration: underline;">Teleport</a>
          <a href="https://data.worldbank.org/" target="_blank" style="color: var(--text-muted); text-decoration: underline;">Banco Mundial</a>
          <a href="https://restcountries.com" target="_blank" style="color: var(--text-muted); text-decoration: underline;">REST Countries</a>
        </div>
        <p style="margin-top: 1rem; opacity: 0.5; font-size: 0.70rem">
          * Algumas cidades menores sem cobertura das agências utilizam modelos de aproximação determinísticos para manter o app visualmente testável.
        </p>
      </footer>
    </div>
  `;

  // Referenciando os nós do DOM que precisamos manipular
  const form = document.getElementById('compare-form') as HTMLFormElement;
  const city1Input = document.getElementById('city1') as HTMLInputElement;
  const city2Input = document.getElementById('city2') as HTMLInputElement;
  const resultsContainer = document.getElementById('results-container') as HTMLElement;
  const compareBtn = document.getElementById('compare-btn') as HTMLButtonElement;

  // Ouvindo a submissão do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita recarregamento da página
    
    const city1 = city1Input.value.trim();
    const city2 = city2Input.value.trim();

    if (!city1 || !city2) return;

    // ----- ESTADO 1: LOADING -----
    compareBtn.disabled = true;
    compareBtn.innerHTML = '<span class="spinner"></span> Analisando...';
    
    // Mostra o spinner gigante na área de resultados
    resultsContainer.innerHTML = `
      <div class="loading-state fade-in">
        <div class="spinner-large"></div>
        <p style="color: var(--text-muted)">Consultando APIs de clima e processando dados para <strong>${city1}</strong> e <strong>${city2}</strong>...</p>
      </div>
    `;

    try {
      // ----- ESTADO 2: SUCESSO -----
      // Chamando a nossa Orquestração Mestre
      const cities = await compareCities([city1, city2]);
      
      // Renderizando os Cards. Usamos .join('') porque o map retorna um array de strings HTML
      // O 'index' define qual fica dourado/coroado, pois o array já volta ordenado do UseCase!
      resultsContainer.innerHTML = cities
        .map((city, index) => CityCard(city, index))
        .join('');

    } catch (error: any) {
      // ----- ESTADO 3: ERRO -----
      console.error(error);
      resultsContainer.innerHTML = `
        <div class="error-state fade-in glass-card error-card">
          <p>Ops! Não conseguimos comparar as cidades. 😿</p>
          <p style="font-size:0.9rem; margin-top:0.5rem; opacity: 0.8">${error.message}</p>
        </div>
      `;
    } finally {
      // Retorna o botão ao estado original independente do que aconteceu
      compareBtn.disabled = false;
      compareBtn.innerHTML = '<span>Comparar Cidades</span>';
    }
  });
}
