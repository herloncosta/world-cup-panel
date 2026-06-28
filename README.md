# FIFA World Cup 2026 — Dashboard

Painel interativo com dados da Copa do Mundo FIFA 2026, incluindo classificação de grupos, partidas, confrontos do mata-mata e artilharia.

## Stack

- **React 19** + **TypeScript**
- **Vite 8** (bundler)
- **Tailwind CSS 4** (via plugin Vite)
- **Framer Motion** (animações)
- **Lucide React** (ícones)
- **React Router** (navegação entre páginas)
- **Oxlint** (linter)

## Funcionalidades

- **Dashboard analítica** com barra lateral (desktop) e abas inferiores (mobile)
- **Classificação por grupos** — 12 grupos com tabela completa (MP, W, D, L, GF, GA, GD, PTS)
- **Todas as partidas** — filtro por jogadas/pendentes, gols expansíveis, paginação
- **Mata-mata** — confrontos com cores por fase, placeholders para vencedores
- **Artilharia** — pódio dos top 3 + tabela com barras de progresso, paginação
- **Página de cada seleção** — estatísticas, classificação do grupo, artilharia e resultados
- **100% responsivo** — layout adaptável para desktop, tablet e mobile
- **Bandeiras** — emojis de bandeiras para 70+ seleções

## Estrutura

```
src/
├── api/api.ts              # Fetch dos dados do GitHub
├── components/
│   ├── Groups.tsx          # Tabelas de grupos
│   ├── Knockout.tsx        # Confrontos do mata-mata
│   ├── Matches.tsx         # Lista de partidas com filtros
│   ├── Pagination.tsx      # Componente reutilizável de paginação
│   ├── Scorers.tsx         # Artilharia com pódio e tabela
│   └── TeamLink.tsx        # Link de seleção com bandeira
├── hooks/useCopaData.ts    # Hook de dados
├── pages/
│   ├── Dashboard.tsx       # Layout principal com sidebar/abas
│   └── TeamPage.tsx        # Página detalhada de cada seleção
├── utils/
│   ├── flags.ts            # Mapeamento país → bandeira
│   ├── scorers.ts          # Cálculo de artilharia
│   └── standings.ts        # Cálculo de classificação
├── App.tsx                 # Rotas
├── index.css               # Tema WC2026
└── main.tsx                # Entry point
```

## Como rodar

```bash
npm install
npm run dev
```

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção (`tsc -b && vite build`) |
| `npm run lint` | Linter (oxlint) |
| `npm run preview` | Preview do build |

## Dados

Fonte: [openfootball/worldcup.json](https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json)

## Licença

Projeto para fins de estudo.
