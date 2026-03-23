import './style.css';
import { renderHome } from './ui/pages/Home';

// Iniciador Principal - Montando a Aplicação
const appContainer = document.querySelector<HTMLDivElement>('#app');

if (appContainer) {
  renderHome(appContainer);
} else {
  console.error("Oops! Container do App (#app) não encontrado no index.html.");
}
