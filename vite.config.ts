// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  // O "base" garante que os caminhos JS/CSS fiquem corretos no GitHub Pages.
  // Assumindo que o nome do seu repositório no GitHub será "city-score-engine"
  base: '/city-score-engine/',
});
