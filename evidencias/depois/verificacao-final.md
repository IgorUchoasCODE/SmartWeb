# Evidências — Depois do Resgate (Etapas 2 a 8)

Este diretório armazena os registros de verificação após a separação em `index.html`, `css/estilos.css` e `js/app.js` e a implementação do desafio de **Ordenação de Preços**.

## Verificações Técnicas Executadas

1. **Sintaxe JavaScript:** Validada com `node --check js/app.js` e `node --check main.js` sem erros.
2. **Ativos de Imagem:** Todos os 15 arquivos de imagem referenciados (`logo.png`, `switch-24-portas.jpg`, `produto0.png` a `produto12.png`) estão presentes no repositório.
3. **Testes Funcionais e de Aceitação (incluindo Ordenação de Preços):**
   - Exibição dos 13 produtos (12 originais + `FW-UTM5G`).
   - Ordenação crescente (`menor-preco`: de `R$ 489,00` a `R$ 4.290,00`), decrescente (`maior-preco`: de `R$ 4.290,00` a `R$ 489,00`) e restauração da ordem padrão (`padrao`).
   - Combinação simultânea de filtro por linha + busca case-insensitive (em nome, SKU e descrição) + ordenação por preço.
   - Adição de itens ao pedido via `data-sku` mantendo integridade mesmo com catálogo reordenado, cálculo numérico em reais e limpeza completa (`carrinho = []`).
   - Validação de contato sem recarregar a página, feedback por campo e proteção contra XSS usando `textContent`.
   - Acordeão do FAQ com 8 perguntas operável por clique e teclado (`<button aria-expanded>`).

## Capturas de Tela a Anexar pela Equipe (com data e hora do sistema)
- `console-depois.png` — Painel Console (F12) limpo ao abrir `index.html` pelo Live Server.
- `lighthouse-depois.png` (ou `.html`) — Relatório final do Lighthouse (Acessibilidade >= 90 e Boas práticas).
- `w3c-depois.png` — Resultado do W3C Markup Validation Service com zero erros.
- `tela-360px-depois.png`, `tela-768px-depois.png`, `tela-1280px-depois.png`, `zoom-200-depois.png`.
