---
name: MyBills
description: Controle financeiro sério, sem travar recurso atrás de plano
colors:
  bg: "#1a1a1a"
  bg-alt: "#161616"
  surface: "#242424"
  border: "#2a2a2a"
  ink: "#F1F5F9"
  ink-dim: "#94A3B8"
  ink-dimmer: "#64748B"
  signal-purple: "#8B5CF6"
  signal-purple-dark: "#6C2BD9"
  signal-purple-light: "#A78BFA"
  teal: "#00BFA5"
  ok: "#22C55E"
  warn: "#F5A623"
  danger: "#EF4444"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(40px, 6vw, 76px)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(17px, 2vw, 21px)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
rounded:
  xs: "2px"
  sm: "9px"
  md: "13px"
  lg: "18px"
  xl: "24px"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "20px"
  lg: "26px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.signal-purple}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "15px 30px"
  button-primary-hover:
    backgroundColor: "{colors.signal-purple-dark}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "15px 30px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "15px 30px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "20px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-dim}"
    typography: "{typography.mono}"
    rounded: "{rounded.pill}"
    padding: "7px 15px"
---

# Design System: MyBills

## 1. Overview

**Creative North Star: "The Open Ledger"**

MyBills se comporta como um livro-caixa aberto sobre uma mesa escura à noite: nada trancado, nada escondido atrás de uma página seguinte. O fundo quase-preto (`--bg` #1a1a1a) não é frieza de banco corporativo, é a mesa em que só o que importa recebe luz. Essa luz é sempre o mesmo sinal, um roxo elétrico único (`--accent` #8B5CF6), nunca disperso em múltiplas cores concorrendo por atenção.

A tipografia reforça a honestidade: Bricolage Grotesque para tudo que é linguagem humana, JetBrains Mono só para números, porque dinheiro merece ser lido com precisão, não estilizado. O sistema rejeita explicitamente o visual de banco tradicional (azul/verde institucional, sisudo) e o clichê de SaaS de IA genérico (gradiente roxo/azul batido, hero-metric template, cards idênticos): aqui o roxo é assinatura única e rara, não decoração de fundo.

**Key Characteristics:**
- Fundo quase-preto como "mesa escura", não como tema dark genérico
- Um único sinal de cor (roxo) para tudo que é ação ou destaque
- Números sempre em mono, texto sempre em Bricolage Grotesque
- Cards flutuam com sombra grande e difusa, nunca com borda lateral colorida
- Cantos generosamente arredondados (9–24px), nunca angulosos, nunca circulares por padrão

## 2. Colors

Paleta quase-monocromática (fundo escuro + tons de cinza-azulado para texto) com um único acento saturado carregando toda a responsabilidade de "isso importa".

### Primary
- **Signal Purple** (#8B5CF6): a cor de ação. Usada em CTAs, ícones ativos, indicadores de saldo/gráfico em foco. Em textos e fundos grandes vira gradiente sutil `linear-gradient(135deg, #6C2BD9, #8B5CF6)` para dar profundidade sem introduzir uma segunda cor.
- **Signal Purple Dark** (#6C2BD9): estado hover/pressed do roxo, e ponta escura do gradiente.
- **Signal Purple Light** (#A78BFA): links em hover, texto de destaque sobre fundo escuro quando o roxo sólido teria contraste insuficiente.

### Neutral
- **Near-Black Stage** (#1a1a1a, `--bg`): fundo principal, a "mesa" onde tudo repousa.
- **Recessed Black** (#161616, `--bg-alt`): fundo de seções que devem recuar visualmente atrás do conteúdo principal.
- **Surface Charcoal** (#242424, `--surface`): fundo de cards, chips e paineis, um degrau acima do fundo.
- **Hairline Border** (#2a2a2a, `--border`): toda borda de 1px entre superfícies.
- **Paper Ink** (#F1F5F9, `--ink`): texto primário.
- **Dimmed Ink** (#94A3B8, `--ink-dim`): texto secundário, legendas, subtítulos.
- **Dimmer Ink** (#64748B, `--ink-dimmer`): metadados, timestamps, texto terciário.

### Named Rules
**The One Signal Rule.** Roxo é a única cor com permissão de significar "isso é acionável ou importante". Verde (`--ok`), vermelho (`--danger`) e âmbar (`--warn`) existem só para status financeiro (entrada/saída/alerta), nunca para decoração ou CTA. Teal (`--teal`) é reserva, não usar sem necessidade clara.

## 3. Typography

**Display Font:** Bricolage Grotesque (com fallback sans-serif)
**Body Font:** Bricolage Grotesque (mesma família, pesos diferentes)
**Label/Mono Font:** JetBrains Mono

**Character:** Uma família geométrica-humanista carrega toda a voz da marca; o mono entra só quando o conteúdo é um número que precisa ser lido com exatidão (saldos, valores, timestamps). O contraste vem do peso e do uso, não de misturar famílias parecidas.

### Hierarchy
- **Display** (600, `clamp(40px, 6vw, 76px)`, line-height 1.04, letter-spacing -0.02em): headline do hero, uma por página.
- **Headline** (700, 32px, line-height 1.15, letter-spacing -0.01em): títulos de seção (`.blur-h2`).
- **Title** (700, 19-20px): títulos de card e componentes de produto (ex: "Visão geral · Julho").
- **Body** (400, `clamp(17px, 2vw, 21px)`, line-height 1.55, max-width 640px / ~65-70ch): parágrafos de apoio do hero e seções.
- **Label** (500, 14px): nav links, botões, chips.
- **Mono** (600, 13-36px conforme contexto, letter-spacing -0.01em): todo valor monetário e todo timestamp.

### Named Rules
**The Number-Is-Mono Rule.** Qualquer número que representa dinheiro, porcentagem ou tempo é sempre JetBrains Mono, nunca a fonte de display. É o sinal visual de "isto é um dado real, não uma promessa".

## 4. Elevation

Sistema flutuante e profundo: os cards não se apoiam em bordas para se destacar do fundo, eles flutuam com sombras grandes e difusas (`0 20px 40px` a `0 40px 100px`, sempre em preto puro com opacidade 0.4-0.5). Quanto mais um elemento "paira" sobre o fluxo normal (badges animados no hero, o painel de produto), maior e mais difusa a sombra.

### Shadow Vocabulary
- **float-sm** (`box-shadow: 0 20px 40px rgba(0,0,0,0.4)`): chips e badges flutuantes no hero (animação `floaty`).
- **float-lg** (`box-shadow: 0 40px 100px rgba(0,0,0,0.5)`): o painel de produto principal, o elemento mais "elevado" da página.
- **glow-purple** (`box-shadow: 0 12px 34px rgba(108,43,217,0.42)`): CTA primário, o roxo projeta a própria sombra colorida em vez de preto.
- **glow-purple-sm** (`box-shadow: 0 6px 20px rgba(139,92,246,0.35)`): CTA secundário/nav, versão mais discreta do glow.

### Named Rules
**The Colored Glow Rule.** Só o CTA e elementos de ação roxos ganham sombra colorida (glow); todo o resto usa sombra preta neutra. Sombra colorida em elemento não-acionável é proibido, é o sinal reservado para "clique aqui".

## 5. Components

### Buttons
- **Shape:** cantos bem arredondados, 13px nos CTAs principais (`{rounded.md}`), 10px no CTA compacto do nav (`{rounded.sm}`).
- **Primary:** gradiente `linear-gradient(135deg, #6C2BD9, #8B5CF6)`, texto branco, padding 15px 30px, peso 600, sempre com `glow-purple`.
- **Secondary/Ghost:** fundo `{colors.surface}`, borda 1px `{colors.border}`, texto `{colors.ink}`, mesmo padding e radius do primary, sem glow.
- **Hover/Focus:** primary escurece para `signal-purple-dark`; ghost não muda de cor de fundo, só eleva levemente.

### Chips (badges de status)
- **Style:** fundo `{colors.surface}`, borda 1px `{colors.border}`, radius `{rounded.pill}` (999px), padding 7px 15px, texto mono 12-14px `{colors.ink-dim}`.
- **State:** um ponto de 7px colorido (verde para "ativo/online", roxo para "destaque") precede o texto quando o chip comunica status ao vivo.

### Cards / Containers
- **Corner Style:** 18px para paineis de produto (`{rounded.lg}`), 24px para o container-mãe do dashboard (`{rounded.xl}`).
- **Background:** `{colors.surface}` sobre `{colors.bg-alt}`, criando o degrau de profundidade.
- **Shadow Strategy:** ver Elevation; cards de conteúdo usam `float-sm`, o container principal usa `float-lg`.
- **Border:** sempre 1px `{colors.border}`, nunca `border-left`/`border-right` isolado como acento.
- **Internal Padding:** 20px padrão, 22-26px para cards de destaque (ex: saldo total).

### Inputs / Fields
- Não há campos de formulário na página atual (site institucional/marketing); ao introduzir um (ex: captura de e-mail), seguir o mesmo vocabulário de card: fundo `{colors.surface}`, borda `{colors.border}`, radius `{rounded.sm}`, foco com borda `{colors.signal-purple}` e leve `glow-purple-sm`.

### Navigation
- Barra fixa no topo, fundo `rgba(20,17,15,0.72)` com `backdrop-filter: blur(18px)`, borda inferior 1px `{colors.border}`. Links em `{colors.ink-dim}`, label 14px 500, sem sublinhado; CTA embutido no fim da nav segue o botão primary compacto.

### Painel de Produto (componente assinatura)
O mockup do app dentro do hero é o componente mais distintivo do sistema: um card `float-lg` de 24px de radius contendo sub-cards (saldo, receitas, despesas) em grid, cada um com gráfico de barras mínimo (`border-radius: 3px` por barra) e cor semântica (`--ok` para receita, `--danger` para despesa). É a prova visual da promessa "controle financeiro sério", deve sempre usar dados verossímeis, nunca placeholder óbvio tipo "Lorem ipsum".

## 6. Do's and Don'ts

### Do:
- **Do** usar roxo (`#8B5CF6` / gradiente `#6C2BD9→#8B5CF6`) como o único sinal de ação em qualquer tela; se dois elementos competem por roxo na mesma dobra, um deles está errado.
- **Do** manter números sempre em JetBrains Mono, texto sempre em Bricolage Grotesque.
- **Do** usar sombra preta grande e difusa para elevar cards (`float-sm`/`float-lg`), reservando glow roxo só para elementos acionáveis.
- **Do** manter todo recurso do produto visível e representado igualmente na página, sem hierarquia visual que sugira "isso é premium/bloqueado".

### Don't:
- **Don't** usar `border-left`/`border-right` colorido como faixa de destaque em card, lista ou alerta.
- **Don't** aproximar a paleta de azul/verde institucional de banco tradicional, mesmo que sutilmente.
- **Don't** cair no clichê de SaaS de IA genérico: sem gradiente roxo/azul decorativo solto, sem hero-metric template raso, sem grid de cards idênticos ícone+título+texto.
- **Don't** introduzir uma segunda cor de acento saturada; qualquer nova cor de destaque compete com o Signal Purple e quebra a regra do sinal único.
- **Don't** usar `background-clip: text` com gradiente para texto decorativo.
