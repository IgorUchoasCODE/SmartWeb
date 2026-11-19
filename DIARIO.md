# Diário de Bordo — Desafio "Resgate da SmartWeb"

**Disciplina:** Desenvolvimento Web I (2º Período) — Faculdade Senac AM (FATESE)  
**Docente:** Prof. João Marcos Aires Duarte  
**Equipe:** `EQ01`  
**Desafio Extra do Grupo:** Ordenação de Preços no Catálogo (`#ordenacao-preco`)

---

## 1. Etapa 1 — Diagnóstico Inicial (Tabela de Sintomas)

> Observação inicial feita sobre o arquivo original `smartwebinformatica-desafio.html` antes das correções estruturais e funcionais.

| Categoria | Sintoma observado na página original |
| :--- | :--- |
| **Funcionamento** | Ao abrir a página, o catálogo de produtos aparece vazio (`#catalogo` sem nenhum cartão). |
| **Funcionamento** | Clicar nas abas **A empresa**, **Contato**, **Perguntas frequentes** ou no botão **Produtos** não alterna corretamente as seções. |
| **Funcionamento** | Os filtros de linha (`Todas as linhas`, `Computadores e notebooks`, etc.) e o campo de busca não filtram o catálogo. |
| **Funcionamento** | Ao tentar montar mensagem no formulário de contato, a página recarrega e não exibe os erros próximos aos campos. |
| **Funcionamento** | Não há opção de ordenação de preços no catálogo nem remoção individual de itens do pedido. |
| **HTML** | Documento inicia direto em `<html>`, sem `<!DOCTYPE html>`, sem `lang="pt-BR"`, sem `<meta charset="UTF-8">` e sem `<meta name="viewport">`. |
| **HTML** | Uso de tabelas (`<table>`) para estruturar cabeçalho, seções institucionais e formulário de contato. |
| **HTML** | Presença de tags e atributos obsoletos (`<marquee>`, `<font>`, `<center>`, `bgcolor="white"`, múltiplos `<br>`). |
| **HTML** | ID duplicado (`id="c-wa"`) usado tanto no WhatsApp quanto no Telefone, além de inputs sem `<label>` e imagens sem `alt`. |
| **HTML** | Saltos na hierarquia de títulos (`<h1>` repetido várias vezes seguido por `<h5>` e `<h6>` sem `<h2>`, `<h3>` ou `<h4>`). |
| **CSS** | Em telas menores que `1200px` (incluindo celular `360px` e tablet `768px`), o `#menu` desaparece completamente. |
| **CSS** | `body { width: 1100px; }` força barra de rolagem horizontal em telas estreitas e quebra com zoom de 200%. |
| **CSS** | Uso abusivo de `!important` e seletores extremamente específicos (`div#topo table tr td div.logo span b`), além de estilos inline no HTML e no JS. |
| **Acessibilidade** | `* { outline: none !important; }` impede qualquer visualização do foco ao navegar com `Tab` e `Shift+Tab`. |
| **Acessibilidade** | Baixíssimo contraste entre texto e fundo (`#ccc`/`#bbb`/`#ddd` sobre `#fff`, e texto `#fff` sobre botão `#ffeb3b`). |
| **Acessibilidade** | Perguntas frequentes usam `<h6 onmouseover="..." onmouseout="...">`, impossibilitando uso por teclado, toque ou leitor de tela. |
| **Acessibilidade** | Status das portas do switch exibido apenas por quadrados verdes e vermelhos sem rótulo textual. |
| **Acessibilidade** | Uso de `<marquee>` e `.piscar` (0,4s infinito) sem suporte a `prefers-reduced-motion`, além de caixas `alert()` bloqueantes. |
| **JavaScript** | Console acusa erro de sintaxe fatal em `if (email.indexOf("@") = -1)` (`Invalid left-hand side in assignment`), impedindo a execução de todas as funções do script. |
| **JavaScript** | `window.onload = montaCatalogo()` invoca a função imediatamente antes do DOM existir; erro de digitação em `getElemetById`; laço `i <= produtos.length`; propriedade `.innerHtml`; `linhaAtual = "todas"` e `linhaAtual == l`. |
| **JavaScript** | `busca()` concatena input do usuário direto em `innerHTML` (risco de XSS), diferencia maiúsculas de minúsculas e ignora ocorrências na posição `0` (`indexOf > 0`). |

### Reflexão da Etapa 1 (Seção 5.1 da Apostila)

Um usuário comum com mouse e monitor largo perceberia imediatamente que os botões e links não respondem, o catálogo não carrega e o formulário recarrega a página — tornando o site praticamente inutilizável. Já para um usuário cego utilizando leitor de tela, as barreiras são ainda mais severas: não há link de salto (`skip-link`), não há regiões semânticas (`<header>`, `<nav>`, `<main>`), os campos do formulário não têm `<label>`, as imagens não possuem `alt`, os indicadores de status das portas são apenas quadrados coloridos sem texto e o FAQ depende de passagem do mouse (`onmouseover`). Para um usuário idoso utilizando zoom de 200% ou para alguém navegando em celular (`360px`), a largura fixa de `1100px`, as fontes pequenas e o desaparecimento do menu abaixo de `1200px` escondem a navegação principal e forçam rolagem horizontal constante, enquanto o texto cinza claro sobre branco e o texto branco sobre amarelo tornam a leitura exaustiva ou impossível.

---

## 2. Etapa 5 (Passo 2) — Cálculo de Especificidade CSS `(a, b, c)`

> Critério `(a, b, c)`: `a` = seletores de ID (`#id`), `b` = classes, atributos e pseudoclasses (`.classe`, `:hover`), `c` = elementos HTML e pseudoelementos (`div`, `h4`).

| Seletor do código original | Cálculo `(a, b, c)` | Problemas identificados no original | Como foi simplificado em `css/estilos.css` |
| :--- | :--- | :--- | :--- |
| `div#topo table tr td div.logo span b` | **(1, 1, 7)** + `!important` | Acoplamento extremo à estrutura HTML de tabela (`table tr td`) e uso de `!important` para forçar cor e fonte. | Substituído pela classe única `.logo-titulo` **(0, 1, 0)** sem `!important`. |
| `#produtos .card h4` | **(1, 1, 1)** | Especificidade alta com ID exigia que regras posteriores usassem `!important` para vencer. | Substituído pela classe única `.card-titulo` **(0, 1, 0)**. |
| `.card h4` | **(0, 1, 1)** + `!important` | Usava `!important` apenas para tentar sobrescrever `#produtos .card h4`. | Unificado em `.card-titulo` **(0, 1, 0)** sem conflitos nem `!important`. |
| `#topo` | **(1, 0, 0)** | Estilização por ID dificulta reutilização e cria cascata rígida. | Substituído pela classe `.topo` **(0, 1, 0)**. |
| `.aba:hover` | **(0, 2, 0)** | Combinava cor de baixa legibilidade (`#3b7fc0` sobre `#0a62a8`) e dependia de `float: left`. | Mantido com contraste acessível via `.aba:hover` **(0, 2, 0)** usando variáveis `--eq01-*` e layout Flexbox. |
| `* { outline: none !important; }` | **(0, 0, 0)** + `!important` | Removia o anel de foco de todos os elementos interativos no teclado. | Removido e substituído por `:focus-visible` **(0, 1, 0)** com borda sólida `3px` em `--eq01-cor-foco`. |

---

## 3. Registro Cronológico do Diário de Bordo

| Nº | Data | Sintoma observado | Causa encontrada (o porquê) | Seção da apostila | O que foi feito | Commit | Responsável |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 01 | 04/11 | Site original entregue com múltiplas falhas de funcionamento, semântica, CSS e acessibilidade. | Ponto de partida do desafio continha todo código legado em arquivo único. | Unidade 1 (1.5) | Criação do repositório Git e envio do arquivo original sem alterações. | `0d208ab` / `03058db` | IgorUchoasCODE |
| 02 | 09/11 | HTML, CSS e JS misturados em um único documento dificultando a leitura e manutenção. | Toda lógica e estilização estavam embutidas em tags `<script>` e `<style>`. | Unidades 1 e 3 (3.1) | Separação inicial em `smartwebinformatica-desafio.html`, `main.js` e `staly.css`. | `e0be711` | IgorUchoasCODE |
| 03 | 12/11 | Cores e espaçamentos espalhados em valores literais com baixo contraste. | Ausência de Custom Properties no `:root` e paleta original abaixo de 4.5:1. | Unidades 3 (3.8) e 5 (5.2) | Definição inicial de variáveis de tema e contraste no `:root` em `staly.css`. | `af7f6fe` / `a2cd249` | Samuel Menz |
| 04 | 12/11 e 14/11 | Falta de foco visível no teclado, títulos `h1` conflitantes e ausência de `box-sizing`. | `* { outline: none !important; }` suprimia o foco e havia dois blocos `h1` com `!important`. | Unidades 2 (2.6), 3 (3.2) e 5 (5.2) | Reset com `box-sizing: border-box`, `:focus-visible`, `.skip-link` e escala `h1`/`h2`/`h3`. | `6dcf723` / `b460d81` | Samuel Menz |
| 05 | 15/11 e 16/11 | Topo em tabela rígida, abas com `float` e botão com texto branco sobre amarelo ilegível. | Uso de `<table>` de layout, `float: left` e combinação `#fff` sobre `#ffeb3b`. | Unidades 3 (3.3) e 5 (5.2) | Reestruturação de `.topo`, `.aba` e `.botao` com Flexbox e alto contraste. | `c8aecb2` / `ad82ccf` | Samuel Menz |
| 06 | 16/11 | Imagens dos 12 produtos inexistentes e erros de condição na exibição do catálogo. | Faltavam `produto0.png`..`produto11.png`; laço usava `i <= produtos.length` e `.innerHtml`. | Unidades 6 e 8 | Adição das 12 imagens de produto e correções iniciais em `main.js`. | `b8bff4d` | Fabilene |
| 07 | 17/11 | Presença de animações intermitentes e indicadores visuais dependentes de cor. | `.piscar` piscava a cada 0,4s e `.verde`/`.vermelho` não tinham suporte acessível. | Unidade 5 (5.1 e 5.2) | Integração e ajustes iniciais de CSS via PR #5. | `775478c` / `c3986d7` | Samuel Menz |
| 08 | 18/11 | Script não executava ao carregar a página e Console acusava erros 404 de imagens. | Atribuição inválida `email.indexOf("@") = -1` travava o parser JS; `getElemetById` tinha erro de grafia; faltavam `logo.png`, `switch-24-portas.jpg` e `produto12.png`. | Seções 2.1, 6.2 e 6.5 | Correção de sintaxe/referência em `main.js`, uso de `DOMContentLoaded` e geração dos ativos de imagem ausentes. | `7ef4423` | Equipe EQ01 |
| 09 | 18/11 | Filtro, busca, carrinho, formulário, cópia e FAQ falhavam; ausência da ordenação de preços e do 13º produto; risco de XSS. | `filtra()` comparava com `==` em vez de atribuir `=`; `busca()` usava `indexOf > 0` e `innerHTML` inseguro; `total` iniciava `undefined`; `limpar()` atribuía string `""`; faltava seletor de ordenação por preço. | Unidades 6, 8 e Seção 11.4 | Reescrita modular de `main.js` com camadas de dados (13 produtos), estado, busca+filtro+ordenação por preço (crescente/decrescente), pedido por SKU, DOM seguro via `textContent` e `addEventListener`. | `e027d77` | Equipe EQ01 |
| 10 | 18/11 | Documento HTML sem `<!DOCTYPE>`, sem semântica HTML5, com IDs duplicados (`c-wa`), tabelas de layout e FAQ por `onmouseover`. | Estrutura original construída com marcação HTML4 obsoleta e manipuladores inline. | Unidades 2 e 5 | Reestruturação completa em HTML5 semântico válido (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), `<label>` em todos inputs, `alt`, status de portas com texto, seletor `#ordenacao-preco` e 8ª pergunta do FAQ em `<button aria-expanded>`. | `f98334d` | Equipe EQ01 |
| 11 | 18/11 | Variáveis CSS não aplicavam no layout (`--cor-*` vs `--eqX-*`), erro de chave `}` em `.btn-pedido-topo` e ausência de layout para catálogo/formulário/FAQ. | Divergência de prefixo no `:root`, chave extra quebrando o parser CSS e arquivo incompleto após merges. | Unidades 3 e 5 | Padronização dos tokens `--eq01-*` (com aliases `--eqX-*`), correção de sintaxe, remoção de `!important` e conclusão do CSS Mobile-First (`360px` -> `@media (min-width: 768px)` -> `1024px`) e `prefers-reduced-motion`. | `a575e61` | Equipe EQ01 |
| 12 | 18/11 | Projeto ainda apontava para nomes antigos (`smartwebinformatica-desafio.html`, `staly.css`, `main.js`) fora da estrutura da Etapa 8. | Etapa 8 exige entrega modularizada em `index.html`, `css/estilos.css` e `js/app.js` com cabeçalho de autoria. | Unidade 1 e Etapa 8 | Criação de `index.html`, `css/estilos.css` e `js/app.js` com separação estrita de responsabilidades e cabeçalhos `EQ01`. | `9c7835a` | Equipe EQ01 |
| 13 | 18/11 | Documentação do processo (`DIARIO.md`, `README.md`) e diretório de evidências ainda pendentes. | Necessidade de registrar formalmente todo o histórico, Ficha da Equipe, especificidade e métricas. | Seções 3, 4, 6 e 7 | Elaboração completa de `DIARIO.md`, `README.md` e estrutura `evidencias/antes` e `evidencias/depois`. | *(commit atual)* | Equipe EQ01 |
