# 🌍 City Score Engine

<p align="center">
  <em>Transformando dados em decisão prática. Em qual cidade vale a pena morar?</em>
</p>

## 🎯 Sobre o Projeto

O **City Score Engine** é um Single Page Application (SPA) focado em cruzar dados demográficos, climáticos, econômicos e de qualidade de vida de diversas cidades ao redor do globo. O grande diferencial deste repositório é que ele foi construído empregando conceitos robustos de **Clean Architecture** lado a lado com a metodologia **AI-First (AI-Friendly)** de desenvolvimento.

---

## 🤖 A Engenharia por Trás (Metodologia "AI-Friendly")

Este projeto é um *Case Study* explícito de como desenvolver software guiando Agentes de Inteligência Artificial Especializada por meio de **Engenharia de Prompt Arquitetural**. 

Os conhecimentos necessários para criar ambientes "Amigáveis à IA" (onde LLMs não alucinam e criam código de produção robusto) aplicados aqui incluem:

1. **Separação Rígida (Clean Structure):** O projeto foi fragmentado em `Domain`, `App`, `Infra` e `UI`. A IA não precisou analisar 1000 linhas de código macarrônico para resolver um _bug_ de clima. Os _prompts_ restringiram o escopo das refatorações para atuar exclusivamente na pasta alvo, evitando a reescrita desastrosa de outras lógicas.
2. **Tipagem Tática como Contrato:** Interfaces como (`City.ts`, `QualityOfLifeData.ts`) serviram de algemas para o modelo de linguagem. Ao solicitar a criação de um orquestrador (UseCase), a Tipagem Forte assegurou que as saídas geradas pela IA fossem invariavelmente controladas.
3. **Graceful Degradation (Engenharia de Resiliência):** Um ponto vital no trabalho de IAs com APIs é lidar com falhas de Redes. O projeto tem "Fallbacks Determinísticos". Quando uma cidade pequena (`"Toledo, BR"`) não encontrava dados nas Agências Mundiais, a IA arquitetou um Algoritmo de Hashing que traduz o nome da cidade em _Scores Temporários e Finais Reproduzíveis_ matematicamente. Nenhuma requisição quebra e nunca existem lacunas de visualização (`N/A`) no MVP do App.
4. **Funções Puras:** Lógicas de processamento como o `ScoreCalculator` foram projetadas sem _Side Effects_. O cálculo final atua totalmente no ar, blindado contra APIs pesadas, o que facilitou o trabalho da IA na hora de calibrar os pesos das variáveis de decisão na matemática de score.

---

## ✨ Características Visuais & Técnicas

* 🌐 **Geolocalização Avançada:** Integração profunda em cascatas (`HATEOAS`) com Custom Matchers, permitindo busca de dados flexível com siglas (Ex: _"Cidade, PR"_ ou _"Cidade, BR"_).
* 📊 **Indicadores Massivos:** Agregação simultânea via `Promise.all` de APIs do **Open-Meteo**, **Banco Mundial**, **Teleport (QoL)** e **REST Countries** num cache inteligente e rápido (`LocalStorage` com TTL de 60min).
* 🎨 **UI Premium (Estilo Dashboard):** Interface desenvolvida em Vanilla TypeScript + CSS puro com efeito `Glassmorphism` (vidro translúcido), manipulação de abas visuais e Dark Mode robusto. Nenhuma biblioteca Front-End reativa como React/Vue foi necessária, garantindo performance e leveza absurda do Bundler (Zero-Dependencies na View).

---

## 🏗️ Arquitetura

O padrão de diretórios reflete a lógica isolada em camadas claras:

```text
src/
 ├── app/
 │   └── useCases/
 │       └── compareCities.ts       // Orquestrador de Dados: Une Infra e Domain
 ├── domain/
 │   ├── models/
 │   │   └── City.ts                // Contrato dos Tipos e Estruturas de Base
 │   └── services/
 │       └── ScoreCalculator.ts     // Cálculo Lógico, Sem Estado (Regra de Negócios)
 ├── infra/
 │   ├── api/                       // Conectores Fetch Nativos (Clima, Países, Numbeo)
 │   │   ├── weatherApi.ts
 │   │   └── teleportApi.ts
 │   └── cache/
 │       └── localCache.ts          // Proxy Wrapper do LocalStorage
 ├── ui/
 │   ├── components/                // Componentes visuais String (ex: CityCard.ts)
 │   └── pages/                     // Lógica de Render, Manipulação do DOM e Loadings
 └── main.ts                        // Injeção Central do App (.app-container)
```

---

## 🛠️ Stack Tecnológico

- **TypeScript** - Superconjunto rígido do JavaScript
- **Vite** - Bundler veloz com HMR instantâneo
- **HTML5 & CSS3** - Estrutura nativa super customizada e otimizada

---

## 🚀 Como Executar

### 1. Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/city-score-engine.git

# Entre no diretório alvo
cd city-score-engine

# Instale os pacotes npm
npm install

# Suba o servidor inteligente do Vite
npm run dev
```

### 2. Implantação e Hospedagem em Segundos (Deploy via GitHub Actions)
O repósitorio vem embutido por padrão com a Action `.github/workflows/deploy.yml`. 
Isso traz a filosofia "Commit & Push":
* Qualquer versão subida (`push`) para a ramificação principal (`main`) acordará o **GitHub Actions**.
* Os robôs construirão sua aplicação estática para produção (`/dist`) automaticamente e a propagarão no **GitHub Pages** num link ativo, pronto para o seu portfólio.
