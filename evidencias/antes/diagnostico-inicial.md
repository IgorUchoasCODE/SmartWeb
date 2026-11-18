# Evidências — Antes do Resgate (Etapa 1)

Este diretório armazena os registros do diagnóstico inicial realizados sobre o código original `smartwebinformatica-desafio.html` antes das refatorações.

## Achados Técnicos Documentados no Código Original

1. **Console (JavaScript):**
   - `Uncaught SyntaxError: Invalid left-hand side in assignment` na linha `if (email.indexOf("@") = -1)` (impedia a compilação de todo o bloco `<script>`).
   - Erro de grafia `document.getElemetById("email")`.
   - Inicialização incorreta `window.onload = montaCatalogo()` no `<head>` antes do DOM existir.
   - Ausência dos arquivos de imagem `logo.png` e `switch-24-portas.jpg` (além de `produto0.png`..`produto11.png` antes da etapa da Fabilene), gerando erros 404 de carregamento.
2. **Validação W3C HTML:**
   - Ausência de `<!DOCTYPE html>`, `lang="pt-BR"`, `<meta charset="UTF-8">` e `<meta name="viewport">`.
   - Tags e atributos obsoletos (`<marquee>`, `<font>`, `<center>`, `bgcolor="white"`).
   - ID duplicado `id="c-wa"` em dois elementos distintos.
   - Imagens sem `alt`, campos de formulário sem `<label>` e saltos hierárquicos de título (`<h1>` -> `<h5>` / `<h6>`).
3. **Responsividade e Acessibilidade:**
   - `body { width: 1100px; }` causava rolagem horizontal severa em `360px`, `768px` e com zoom de `200%`.
   - `@media (max-width: 1200px) { #menu { display: none; } }` escondia a navegação inteira no celular e em notebooks padrão.
   - `* { outline: none !important; }` anulava o foco de teclado e `#ccc`/`#bbb` sobre `#fff` e `#fff` sobre `#ffeb3b` violavam o contraste mínimo 4.5:1.

## Capturas de Tela a Anexar pela Equipe (com data e hora do sistema)
- `console-antes.png` — Painel Console (F12) no arquivo original.
- `lighthouse-antes.png` (ou `.html`) — Relatório inicial do Lighthouse (Acessibilidade e Boas práticas).
- `w3c-antes.png` — Resultado do W3C Markup Validation Service no arquivo original.
- `tela-360px-antes.png`, `tela-768px-antes.png`, `tela-1280px-antes.png`, `zoom-200-antes.png`.
