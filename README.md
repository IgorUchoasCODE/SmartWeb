# Desafio "Resgate da SmartWeb" — Equipe EQ01

Projeto prático da disciplina **Desenvolvimento Web I (2º Período)** — Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas (Faculdade Senac AM – FATESE), ministrada pelo Prof. João Marcos Aires Duarte.

O objetivo do desafio é diagnosticar e corrigir falhas estruturais, semânticas, visuais, funcionais, de acessibilidade (WCAG) e de segurança (XSS) no site institucional e catálogo de pedidos da **SmartWeb Informática e Redes**, utilizando exclusivamente **HTML5, CSS3 e JavaScript puros** (sem frameworks externos).

---

## 1. Ficha da Equipe (Requisitos Exclusivos — Seção 4)

| Item da Ficha | Valor aplicado pela equipe | Justificativa técnica e local de aplicação |
| :--- | :--- | :--- |
| **Código da equipe** | `EQ01` | Aplicado nos cabeçalhos de autoria de [index.html](index.html), [css/estilos.css](css/estilos.css) e [js/app.js](js/app.js), e como prefixo `--eq01-` em todas as Custom Properties de `:root`. |
| **Cor de destaque (hexadecimal)** | Primária `#0a5896` e Destaque `#ffd600` (com texto `#1a1a1a`) | A cor primária `#0a5896` com texto branco `#ffffff` atinge contraste de **7.2:1 (WCAG AAA)**. Para a cor de destaque `#ffd600`, o código original usava texto branco `#fff` (contraste insuficiente); substituímos o texto sobreposto por `#1a1a1a` (`--eq01-cor-destaque-texto`), elevando o contraste para **~13.3:1**, bem acima do mínimo de 4.5:1. |
| **Breakpoint principal (px)** | `768px` (`@media (min-width: 768px)`) | Escrito em abordagem **mobile-first**: a base atende telas de `360px` em coluna única sem rolagem horizontal, expandindo o topo, menu horizontal, barra de controles (`2fr 1fr`), catálogo (2 colunas em `768px` e 3 em `1024px`) e seção de contato em `768px`. |
| **Produto extra (13º item)** | `Firewall UTM Corporativo Gigabit, 5 portas` (`FW-UTM5G`, linha `rede`, `R$ 1.890,00`) | Inserido no array `PRODUTOS` em [js/app.js](js/app.js) seguindo exatamente as chaves originais (`nome`, `sku`, `linha`, `preco`, `desc`, `img`) e acompanhado do arquivo `produto12.png`. |
| **Pergunta extra do FAQ (8ª pergunta)** | *"Como posso ordenar os produtos pelo preço do catálogo?"* | Integrada ao componente de acordeão acessível em `<section id="faq">` com botão nativo `<button type="button" class="faq-pergunta" aria-expanded="false" aria-controls="faq-resp-8">`. |
| **Recurso extra do grupo** | **Ordenação de Preços** (`#ordenacao-preco`) | Funcionalidade atribuída ao grupo, descrita em detalhes na seção abaixo. |

---

## 2. Recurso Extra do Grupo: Ordenação de Preços

A funcionalidade de **Ordenação de Preços** foi implementada respeitando a separação de responsabilidades entre HTML5, CSS3 e JavaScript:

- **Estrutura (`index.html`):** No painel `.controles-catalogo`, o elemento `<select id="ordenacao-preco">` vinculado ao `<label for="ordenacao-preco">` oferece três critérios:
  - `padrao`: Ordem padrão do catálogo;
  - `menor-preco`: Menor preço primeiro (ordem crescente);
  - `maior-preco`: Maior preço primeiro (ordem decrescente).
- **Apresentação (`css/estilos.css`):** Em dispositivos móveis (`360px`), o seletor ocupa 100% da largura com altura mínima de toque de `44px`; a partir de `768px`, é posicionado em grid (`2fr 1fr`) ao lado do campo de busca.
- **Comportamento (`js/app.js`):**
  1. `obterProdutosProcessados()` aplica em cadeia: filtro por linha (`estado.linhaAtual`) -> filtro textual (`estado.termoBusca` em `nome`, `desc` e `sku`) -> ordenação numérica por preço sobre uma cópia imutável (`[...filtrados].sort(...)`) convertendo `Number(a.preco)` e `Number(b.preco)`.
  2. Os botões *"Adicionar ao pedido"* usam o identificador único `data-sku` em vez do índice do loop, garantindo que o produto correto seja adicionado ao carrinho mesmo quando o catálogo está reordenado por preço.
  3. O resumo acessível em `#resultadoBusca` (`aria-live="polite"`) informa em tempo real a quantidade exibida, a linha, o critério de ordenação ativo e o termo buscado.

### Teste de aceitação proposto para o Recurso Extra
1. Abrir a aba **Produtos** e verificar 13 itens exibidos na ordem padrão.
2. Selecionar **"Menor preço primeiro (crescente)"**: o primeiro item deve ser `HD externo 2 TB, USB 3.0` (`R$ 489,00`) e o último `Notebook Pro 14", i5, 16 GB, SSD 512 GB` (`R$ 4.290,00`).
3. Selecionar **"Maior preço primeiro (decrescente)"**: a lista deve inverter começando em `R$ 4.290,00` e terminando em `R$ 489,00`.
4. Combinar o filtro **"Redes e conectividade"** com **"Menor preço primeiro"**: deve exibir 5 produtos ordenados de `R$ 620,00` (`RT-DWAN`) até `R$ 1.890,00` (`FW-UTM5G`).
5. Adicionar um item ao pedido com a lista ordenada e confirmar no painel **Meu pedido** que nome e valor correspondem exatamente ao cartão clicado.

---

## 3. Como Executar o Projeto

1. Clone ou baixe o repositório e acesse a pasta `SmartWeb`.
2. Abra a pasta no **Visual Studio Code**.
3. Utilize a extensão **Live Server** (clique com o botão direito em `index.html` -> *Open with Live Server*) ou execute um servidor HTTP local na raiz do projeto:
   ```bash
   npx serve .
   ```
   > **Importante:** Nunca abra o arquivo diretamente por duplo clique (`file://`); utilize sempre servidor local HTTP para que `sessionStorage`, `navigator.clipboard` e auditorias do DevTools/Lighthouse funcionem corretamente.

---

## 4. Separação de Responsabilidades (Arquitetura de Arquivos)

- `index.html` (e `smartwebinformatica-desafio.html` sincronizado): exclusivamente estrutura e semântica HTML5, sem atributos `style=`, sem manipuladores JS inline (`onclick`, `onkeyup`, `onmouseover`) e sem tags obsoletas.
- `css/estilos.css` (e `staly.css` sincronizado): toda a camada visual, tokens `--eq01-*`, Flexbox, CSS Grid, estados de foco `:focus-visible`, responsividade mobile-first (`768px` e `1024px`) e suporte a `prefers-reduced-motion`.
- `js/app.js` (e `main.js` sincronizado): modularizado em **Camada de Dados** (`PRODUTOS`, rótulos), **Estado** (`estado`), **Utilitários** (`formatarMoeda`), **Regras de Negócio** (`obterProdutosProcessados`, `ordenarPorPreco`, pedido), **Renderização segura via DOM/textContent** (anti-XSS) e **Registro de Eventos** (`addEventListener`).

---

## 5. Tabela Comparativa: Problemas Encontrados e Correções

| Problema encontrado | Seção / Unidade da apostila | Como corrigimos |
| :--- | :--- | :--- |
| Script no `<head>` com `window.onload = montaCatalogo()` executava antes do DOM existir e atribuía `undefined`. | Seções 2.1 e 6.5 (Unidades 2 e 6) | Movemos `<script src="js/app.js">` para o fechamento do `<body>` e inicializamos via `DOMContentLoaded`. |
| Erro de sintaxe `if (email.indexOf("@") = -1)` e erro de grafia `getElemetById`. | Seção 6.2 (Unidade 6) | Corrigido para `getElementById`, validação por expressão regular e comparação estrita (`===`). |
| `mostraAba()` buscava `#produto` (inexistente) e usava `element.style.display`. | Seções 3.1 e 8.2 (Unidades 3 e 8) | Corrigido seletor para `produtos` e controle de visibilidade exclusivo por classe `.ativa` e atributo `hidden`. |
| `montaCatalogo()` usava `i <= produtos.length`, `linhaAtual = "todas"` (atribuição) e `.innerHtml`. | Unidades 6 e 8 | Ajustado para `PRODUTOS.filter(...)`, criação de elementos via `document.createElement` e formatação com `Intl.NumberFormat("pt-BR")`. |
| `filtra(l)` usava `linhaAtual == l` sem alterar o estado. | Seção 6.2 (Unidade 6) | Corrigido em `filtrarPorLinha(linha)` com atribuição `estado.linhaAtual = linha`, `aria-pressed` e re-renderização. |
| `busca()` ignorava índice `0`, diferenciava maiúsculas, sobrescrevia o catálogo e gerava vulnerabilidade XSS via `innerHTML`. | Unidades 6, 8 e Seção 11.4 | Normalização `.trim().toLowerCase()`, busca em `nome`/`desc`/`sku`, integração com filtro e ordenação de preço, e exibição segura com `textContent`. |
| `adiciona()` somava strings sobre `total` `undefined` (`NaN`/concatenação) e `limpar()` redefinia `carrinho = ""`, além de usar `alert()`. | Unidades 5 (5.4), 6 e 8 | Inicialização numérica com `Number()`, controle por `sku`, `carrinho = []` ao limpar e feedback em `#feedback-pedido` com `aria-live="polite"`. |
| `enviar()` não interceptava o `submit` (recarregava a página), usava `alert()` e montava resultado com `innerHTML`. | Seções 2.3, 5.4, 6.5, 8.3 e 11.4 | `evento.preventDefault()`, validação com erros específicos por campo (`.erro-campo`) e resumo seguro via `textContent`. |
| `copiar()` usava ID duplicado `c-wa` e `document.execCommand("copy")` obsoleto com `alert()`. | Unidade 8 e MDN Web Docs | ID único `c-tel` no telefone, cópia assíncrona com `navigator.clipboard.writeText()` e feedback visual em `#feedback-copia`. |
| FAQ usava `<h6 onmouseover="..." onmouseout="...">` com `this.nextSibling`. | Unidades 2 e 5 | Substituído por `<h3><button type="button" class="faq-pergunta" aria-expanded="false" aria-controls="...">` operável por mouse e teclado. |
| Ausência de `<!DOCTYPE html>`, `lang`, `charset`, `viewport`, landmarks, `<label>` e `alt`, além de tabelas de layout e tags `<marquee>`, `<font>`, `<center>`. | Unidade 2 (2.1 a 2.6) | Reestruturação completa em HTML5 semântico com `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`, tabela semântica apenas para horários e um único `<h1>`. |
| CSS com largura fixa `1100px`, `#menu` oculto abaixo de `1200px`, abuso de `!important` e variáveis `--cor-*` incompatíveis com `var(--eqX-*)`. | Unidade 3 (3.1 a 3.8) | Correção das variáveis `--eq01-*`, eliminação de `!important`, layout Flexbox/Grid mobile-first (`360px` -> `768px` -> `1024px`). |
| Baixo contraste (`#ccc`/`#bbb` no branco e `#fff` no `#ffeb3b`), `outline: none !important`, `.piscar` rápido e status de portas só por cor. | Unidade 5 (5.1 a 5.4) | Contraste ajustado para >= 4.5:1, foco nítido com `:focus-visible`, remoção do piscamento agressivo (`prefers-reduced-motion`) e rótulos textuais para cada porta. |

---

## 6. Comparação de Métricas: Antes e Depois

| Indicador / Verificação | Estado Original (`smartwebinformatica-desafio.html`) | Estado Atual Após Refatoração (`index.html`) |
| :--- | :--- | :--- |
| **Erros de sintaxe / referência no Console** | Erro fatal de sintaxe (`=` em `if`) impedia execução + 3 imagens ausentes (404). | **0 erros de sintaxe** verificado via `node --check js/app.js`; ativos `logo.png`, `switch-24-portas.jpg` e `produto12.png` presentes. |
| **Marcação HTML5 e Semântica** | Sem DOCTYPE, tabelas de layout, tags obsoletas (`<font>`, `<marquee>`, `<center>`), ID duplicado `c-wa`. | HTML5 semântico com landmarks, `<label>` em todos os controles, `alt` em todas as imagens e zero estilos/eventos inline (pronto para validação W3C; registrar captura em `evidencias/depois/`). |
| **Responsividade (360px / 768px / 1280px e Zoom 200%)** | `width: 1100px` causava overflow horizontal e `#menu` sumia abaixo de `1200px`. | Mobile-first em coluna única a partir de `360px`, breakpoint `768px` (2 colunas) e `1024px` (3 colunas), zero `!important`. |
| **Acessibilidade (WCAG / Teclado / Contraste)** | `outline: none !important`, baixo contraste (`#ccc`/`#fff`), FAQ inacessível por teclado. | `:focus-visible`, contraste >= 4.5:1, FAQ com `<button aria-expanded>`, `aria-live="polite"` e `prefers-reduced-motion` (executar auditoria Lighthouse no navegador e salvar relatório em `evidencias/depois/`). |

---

## 7. Declaração Obrigatória de Uso de Inteligência Artificial (Seção 3)

Em conformidade com a Seção 3 do Roteiro do Desafio:

- **Ferramenta utilizada:** Antigravity (assistente de desenvolvimento por IA).
- **Etapas em que foi utilizada:**
  1. Diagnóstico técnico dos defeitos no código original e nos arquivos iniciados pelos colegas no repositório.
  2. Correção de sintaxe/referência em JavaScript e CSS, refatoração modular com separação de responsabilidades (`index.html`, `css/estilos.css`, `js/app.js`) e prevenção contra XSS.
  3. Implementação do recurso extra do grupo (**Ordenação de Preços**) e do 13º produto/8ª pergunta do FAQ.
  4. Reestruturação semântica HTML5, ajustes de acessibilidade WCAG e organização dos commits e documentação (`DIARIO.md` e `README.md`).
- **Exemplos de prompts empregados:**
  - *"Verifique todas as regras da pasta do desafio, faça o pull das atualizações dos colegas, desenvolva as atualizações do desafio de ordenação de preços com responsabilidades separadas e modificações corretivas, registrando cada atualização no git como commit explicitando os motivos e o porquê."*
  - *"Como calcular a especificidade CSS de seletores legados e estruturar o código JavaScript separando dados, estado, renderização segura com textContent e addEventListener?"*
