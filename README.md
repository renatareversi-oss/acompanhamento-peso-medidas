# 💗 Acompanhamento de Peso & Medidas

App simples e fofo para acompanhar o peso e as medidas corporais de vários participantes.

## Funcionalidades

- Tela principal com um resumo de cada participante (avatar, peso atual e variação).
- Cadastro de múltiplos participantes, cada um com avatar (emoji + cor) personalizado.
- Perfil detalhado por participante: gráfico de evolução do peso, IMC, progresso até a meta e histórico de medições.
- Registro de peso e medidas (cintura, quadril, busto/peito, braço, coxa) por data, com edição e exclusão.
- Dados salvos no navegador (localStorage) — nada é enviado para servidores externos.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Recharts
