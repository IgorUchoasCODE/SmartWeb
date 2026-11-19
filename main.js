/* ==========================================================================
   PROJETO: Desafio Resgate da SmartWeb
   DISCIPLINA: Desenvolvimento Web I - 2º Período
   FACULDADE: Senac AM - FATESE | Prof. João Marcos Aires Duarte
   AUTORIA: Equipe EQ01 (Desafio do Grupo: Ordenação de Preços)
   ARQUIVO: main.js (JavaScript Modular ES6+, Acessível e Seguro contra XSS)
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   1. CAMADA DE DADOS (Catálogo e Rótulos)
   Nota: Mantidos integralmente os 12 produtos originais + 13º item da Ficha.
   -------------------------------------------------------------------------- */
const PRODUTOS = [
  {
    nome: 'Notebook Pro 14", i5, 16 GB, SSD 512 GB',
    sku: "NB-PRO14",
    linha: "comp",
    preco: "4290",
    desc: "Tela Full HD, teclado com numérico reduzido e bateria para o dia todo.",
    img: "produto0.png",
  },
  {
    nome: "Desktop Office, i5, 8 GB, SSD 256 GB",
    sku: "DT-OFFICE",
    linha: "comp",
    preco: "2890",
    desc: "Torre compacta para caixa e atendimento, com Windows 11 Pro.",
    img: "produto1.png",
  },
  {
    nome: "Mini PC Compacto, Ryzen 5, 16 GB",
    sku: "MP-R5",
    linha: "comp",
    preco: "2390",
    desc: "Cabe atrás do monitor e gasta pouca energia. Ideal para recepção.",
    img: "produto2.png",
  },
  {
    nome: 'Monitor 24" Full HD IPS',
    sku: "MN-24IPS",
    linha: "comp",
    preco: "849",
    desc: "Ângulo de visão aberto, entradas HDMI e DisplayPort, base ajustável.",
    img: "produto3.png",
  },
  {
    nome: "Switch gerenciável Gigabit, 24 portas",
    sku: "SW-GER24",
    linha: "rede",
    preco: "1690",
    desc: "VLANs, controle de banda e portas sobrando para a empresa crescer.",
    img: "produto4.png",
  },
  {
    nome: "Access Point Wi-Fi 6 de teto",
    sku: "AP-W6T",
    linha: "rede",
    preco: "780",
    desc: "Rede separada para visitantes e alimentação pelo cabo de rede (PoE).",
    img: "produto5.png",
  },
  {
    nome: "Roteador dual WAN com VLAN",
    sku: "RT-DWAN",
    linha: "rede",
    preco: "620",
    desc: "Dois links de internet com troca automática se um cair.",
    img: "produto6.png",
  },
  {
    nome: "Cabo CAT6, caixa com 305 m",
    sku: "CB-CAT6-305",
    linha: "rede",
    preco: "690",
    desc: "Par trançado para pontos de rede Gigabit, com capa antichama.",
    img: "produto7.png",
  },
  {
    nome: "NAS de 2 baias",
    sku: "NAS-2B",
    linha: "prot",
    preco: "2190",
    desc: "Compartilha arquivos e faz backup automático. Discos vendidos à parte.",
    img: "produto8.png",
  },
  {
    nome: "Nobreak senoidal 1500 VA",
    sku: "UPS-1500S",
    linha: "prot",
    preco: "2450",
    desc: "Energia limpa para servidor e switch, com proteção contra queima.",
    img: "produto9.png",
  },
  {
    nome: "SSD NVMe 1 TB",
    sku: "SSD-NV1T",
    linha: "prot",
    preco: "520",
    desc: "Troca o disco antigo e deixa o computador bem mais rápido.",
    img: "produto10.png",
  },
  {
    nome: "HD externo 2 TB, USB 3.0",
    sku: "HD-EXT2T",
    linha: "prot",
    preco: "489",
    desc: "Segunda mídia local para a cópia de segurança diária.",
    img: "produto11.png",
  },
  /* 13º Produto Extra — Ficha da Equipe (Seção 4) */
  {
    nome: "Firewall UTM Corporativo Gigabit, 5 portas",
    sku: "FW-UTM5G",
    linha: "rede",
    preco: "1890",
    desc: "Proteção de borda, VPN segura para filiais e bloqueio de ameaças em tempo real.",
    img: "produto12.png",
  },
];

const LINHAS_ROTULOS = {
  todas: "Todas as linhas",
  comp: "Computadores e notebooks",
  rede: "Redes e conectividade",
  prot: "Armazenamento e proteção",
};

const ORDENACAO_ROTULOS = {
  padrao: "Ordem padrão",
  "menor-preco": "Menor preço primeiro",
  "maior-preco": "Maior preço primeiro",
};

const ABAS_VALIDAS = ["empresa", "produtos", "contato", "faq"];
const CHAVE_ABA_STORAGE = "smartweb_aba_ativa";

/* --------------------------------------------------------------------------
   2. ESTADO DA APLICAÇÃO
   -------------------------------------------------------------------------- */
const estado = {
  abaAtual: "empresa",
  linhaAtual: "todas",
  termoBusca: "",
  ordenacaoPreco: "padrao",
  carrinho: [],
};

/* --------------------------------------------------------------------------
   3. UTILITÁRIOS E FORMATAÇÃO
   -------------------------------------------------------------------------- */
const formatadorBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatarMoeda(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    return formatadorBRL.format(0);
  }
  return formatadorBRL.format(numero);
}

function obterAbaInicial() {
  try {
    const salva = sessionStorage.getItem(CHAVE_ABA_STORAGE);
    if (salva && ABAS_VALIDAS.includes(salva)) {
      return salva;
    }
  } catch (_) {
    // Ignora caso sessionStorage esteja indisponível
  }
  return "empresa";
}

function salvarAbaAtual(idAba) {
  try {
    sessionStorage.setItem(CHAVE_ABA_STORAGE, idAba);
  } catch (_) {
    // Ignora falha de armazenamento em ambientes restritos
  }
}

/* --------------------------------------------------------------------------
   4. LÓGICA DE NEGÓCIO (Filtro, Busca, Ordenação de Preços e Pedido)
   -------------------------------------------------------------------------- */
function obterProdutosProcessados() {
  const termoNormalizado = estado.termoBusca.trim().toLowerCase();

  const filtrados = PRODUTOS.filter((produto) => {
    const correspondeLinha =
      estado.linhaAtual === "todas" || produto.linha === estado.linhaAtual;

    if (!correspondeLinha) {
      return false;
    }

    if (termoNormalizado === "") {
      return true;
    }

    const textoPesquisavel = [produto.nome, produto.desc, produto.sku]
      .join(" ")
      .toLowerCase();

    return textoPesquisavel.includes(termoNormalizado);
  });

  // Cria uma cópia para não mutar o catálogo original PRODUTOS durante o sort
  const copiaOrdenada = [...filtrados];

  if (estado.ordenacaoPreco === "menor-preco") {
    copiaOrdenada.sort((a, b) => Number(a.preco) - Number(b.preco));
  } else if (estado.ordenacaoPreco === "maior-preco") {
    copiaOrdenada.sort((a, b) => Number(b.preco) - Number(a.preco));
  }

  return copiaOrdenada;
}

function calcularResumoPedido() {
  return estado.carrinho.reduce(
    (acumulador, item) => {
      acumulador.totalItens += item.quantidade;
      acumulador.valorTotal += Number(item.preco) * item.quantidade;
      return acumulador;
    },
    { totalItens: 0, valorTotal: 0 }
  );
}

function adicionarAoPedido(sku) {
  const produto = PRODUTOS.find((item) => item.sku === sku);
  if (!produto) {
    return;
  }

  const itemExistente = estado.carrinho.find((item) => item.sku === sku);
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    estado.carrinho.push({
      sku: produto.sku,
      nome: produto.nome,
      preco: Number(produto.preco),
      quantidade: 1,
    });
  }

  renderizarPedido();
  atualizarFeedbackPedido(
    `"${produto.nome}" foi adicionado ao seu pedido.`,
    "sucesso"
  );
}

function removerDoPedido(sku) {
  const indice = estado.carrinho.findIndex((item) => item.sku === sku);
  if (indice === -1) {
    return;
  }

  const [removido] = estado.carrinho.splice(indice, 1);
  renderizarPedido();
  atualizarFeedbackPedido(
    `"${removido.nome}" foi removido do seu pedido.`,
    "info"
  );
}

function limparPedido() {
  estado.carrinho = [];
  renderizarPedido();
  atualizarFeedbackPedido(
    "Pedido limpo. Nenhum item selecionado no momento.",
    "info"
  );
}

function filtrarPorLinha(linha) {
  if (!Object.prototype.hasOwnProperty.call(LINHAS_ROTULOS, linha)) {
    return;
  }
  estado.linhaAtual = linha;
  atualizarBotoesFiltro();
  renderizarCatalogo();
}

function buscarProdutos(termo) {
  estado.termoBusca = typeof termo === "string" ? termo : "";
  renderizarCatalogo();
}

function ordenarPorPreco(criterio) {
  if (!Object.prototype.hasOwnProperty.call(ORDENACAO_ROTULOS, criterio)) {
    return;
  }
  estado.ordenacaoPreco = criterio;
  renderizarCatalogo();
}

/* --------------------------------------------------------------------------
   5. RENDERIZAÇÃO SEGURA DO DOM (Sem innerHTML com dados do usuário / Anti-XSS)
   -------------------------------------------------------------------------- */
function criarCardProduto(produto) {
  const card = document.createElement("article");
  card.className = "card";

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "card-img-wrapper";

  const img = document.createElement("img");
  img.className = "card-img img-responsiva";
  img.src = produto.img;
  img.alt = produto.nome;
  img.width = 240;
  img.height = 180;
  img.loading = "lazy";
  imgWrapper.appendChild(img);

  const corpo = document.createElement("div");
  corpo.className = "card-corpo";

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const skuSpan = document.createElement("span");
  skuSpan.className = "card-sku";
  skuSpan.textContent = produto.sku;

  const badgeLinha = document.createElement("span");
  badgeLinha.className = "card-badge-linha";
  badgeLinha.textContent = LINHAS_ROTULOS[produto.linha] || produto.linha;

  meta.appendChild(skuSpan);
  meta.appendChild(badgeLinha);

  const titulo = document.createElement("h3");
  titulo.className = "card-titulo";
  titulo.textContent = produto.nome;

  const desc = document.createElement("p");
  desc.className = "card-desc";
  desc.textContent = produto.desc;

  const preco = document.createElement("p");
  preco.className = "card-preco";
  preco.textContent = formatarMoeda(produto.preco);

  const btnAdicionar = document.createElement("button");
  btnAdicionar.type = "button";
  btnAdicionar.className = "botao botao-primario btn-adicionar";
  btnAdicionar.dataset.sku = produto.sku;
  btnAdicionar.textContent = "Adicionar ao pedido";

  corpo.appendChild(meta);
  corpo.appendChild(titulo);
  corpo.appendChild(desc);
  corpo.appendChild(preco);
  corpo.appendChild(btnAdicionar);

  card.appendChild(imgWrapper);
  card.appendChild(corpo);

  return card;
}

function atualizarResumoBusca(quantidade) {
  const resultadoBuscaEl = document.getElementById("resultadoBusca");
  if (!resultadoBuscaEl) {
    return;
  }

  const partes = [];
  const rotuloLinha = LINHAS_ROTULOS[estado.linhaAtual] || "Todas as linhas";
  const rotuloOrdem = ORDENACAO_ROTULOS[estado.ordenacaoPreco] || "Ordem padrão";
  const termoLimpo = estado.termoBusca.trim();

  if (quantidade === 0) {
    partes.push("Nenhum produto encontrado");
  } else if (quantidade === 1) {
    partes.push("1 produto exibido");
  } else {
    partes.push(`${quantidade} produtos exibidos`);
  }

  partes.push(`Linha: ${rotuloLinha}`);
  partes.push(`Ordenação: ${rotuloOrdem}`);

  if (termoLimpo !== "") {
    partes.push(`Busca: "${termoLimpo}"`);
  }

  // Uso estrito de textContent previne XSS quando o usuário digita HTML/scripts
  resultadoBuscaEl.textContent = partes.join(" | ");
}

function renderizarCatalogo() {
  const catalogoEl = document.getElementById("catalogo");
  if (!catalogoEl) {
    return;
  }

  const produtosExibidos = obterProdutosProcessados();
  catalogoEl.textContent = "";
  atualizarResumoBusca(produtosExibidos.length);

  if (produtosExibidos.length === 0) {
    const aviso = document.createElement("p");
    aviso.className = "catalogo-vazio";
    aviso.textContent =
      "Nenhum produto corresponde aos critérios informados. Tente outro termo de busca ou selecione 'Todas as linhas'.";
    catalogoEl.appendChild(aviso);
    return;
  }

  const fragmento = document.createDocumentFragment();
  produtosExibidos.forEach((produto) => {
    fragmento.appendChild(criarCardProduto(produto));
  });
  catalogoEl.appendChild(fragmento);
}

function atualizarBotoesFiltro() {
  const botoesFiltro = document.querySelectorAll(".filtro-btn[data-linha]");
  botoesFiltro.forEach((btn) => {
    const ativo = btn.dataset.linha === estado.linhaAtual;
    btn.classList.toggle("ativo", ativo);
    btn.setAttribute("aria-pressed", String(ativo));
  });
}

function renderizarPedido() {
  const { totalItens, valorTotal } = calcularResumoPedido();

  const qtdEl = document.getElementById("qtd");
  if (qtdEl) {
    qtdEl.textContent = String(totalItens);
  }

  const totalEl = document.getElementById("total");
  if (totalEl) {
    totalEl.textContent = formatarMoeda(valorTotal);
  }

  const listaPedidoEl = document.getElementById("lista-pedido");
  if (!listaPedidoEl) {
    return;
  }

  listaPedidoEl.textContent = "";

  if (estado.carrinho.length === 0) {
    const itemVazio = document.createElement("li");
    itemVazio.className = "pedido-vazio";
    itemVazio.textContent = "Nenhum item adicionado ao pedido até o momento.";
    listaPedidoEl.appendChild(itemVazio);
    return;
  }

  const fragmento = document.createDocumentFragment();
  estado.carrinho.forEach((item) => {
    const li = document.createElement("li");
    li.className = "item-pedido";

    const texto = document.createElement("span");
    texto.className = "item-pedido-info";
    texto.textContent = `${item.quantidade}x ${item.nome} (${item.sku}) — ${formatarMoeda(
      item.preco * item.quantidade
    )}`;

    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.className = "btn-remover-item";
    btnRemover.dataset.removerSku = item.sku;
    btnRemover.setAttribute("aria-label", `Remover ${item.nome} do pedido`);
    btnRemover.textContent = "Remover";

    li.appendChild(texto);
    li.appendChild(btnRemover);
    fragmento.appendChild(li);
  });

  listaPedidoEl.appendChild(fragmento);
}

function atualizarFeedbackPedido(mensagem, tipo) {
  const feedbackEl = document.getElementById("feedback-pedido");
  if (!feedbackEl) {
    return;
  }
  feedbackEl.textContent = mensagem;
  feedbackEl.classList.remove("feedback-sucesso", "feedback-info");
  if (tipo === "sucesso") {
    feedbackEl.classList.add("feedback-sucesso");
  } else {
    feedbackEl.classList.add("feedback-info");
  }
}

/* --------------------------------------------------------------------------
   6. NAVEGAÇÃO DE ABAS, FORMULÁRIO DE CONTATO, CÓPIA E FAQ
   -------------------------------------------------------------------------- */
function alternarAba(idAba) {
  if (!ABAS_VALIDAS.includes(idAba)) {
    return;
  }

  estado.abaAtual = idAba;
  salvarAbaAtual(idAba);

  const secoes = document.querySelectorAll(".secao-aba");
  secoes.forEach((secao) => {
    const ativa = secao.id === idAba;
    secao.hidden = !ativa;
    secao.classList.toggle("ativa", ativa);
  });

  const botoesAba = document.querySelectorAll(".aba[data-aba]");
  botoesAba.forEach((botao) => {
    const ativa = botao.dataset.aba === idAba;
    botao.classList.toggle("ativa", ativa);
    botao.setAttribute("aria-pressed", String(ativa));
    if (ativa) {
      botao.setAttribute("aria-current", "page");
    } else {
      botao.removeAttribute("aria-current");
    }
  });
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function limparErrosFormulario() {
  const campos = [
    { inputId: "nome", erroId: "erro-nome" },
    { inputId: "email", erroId: "erro-email" },
    { inputId: "msg", erroId: "erro-msg" },
  ];

  campos.forEach(({ inputId, erroId }) => {
    const input = document.getElementById(inputId);
    const erro = document.getElementById(erroId);
    if (input) {
      input.classList.remove("campo-invalido");
      input.removeAttribute("aria-invalid");
    }
    if (erro) {
      erro.textContent = "";
    }
  });
}

function exibirErroCampo(inputId, erroId, mensagem) {
  const input = document.getElementById(inputId);
  const erro = document.getElementById(erroId);
  if (input) {
    input.classList.add("campo-invalido");
    input.setAttribute("aria-invalid", "true");
  }
  if (erro) {
    erro.textContent = mensagem;
  }
}

function montarResumoContatoSeguro(dados) {
  const resultadoEl = document.getElementById("resultado");
  if (!resultadoEl) {
    return;
  }

  resultadoEl.textContent = "";
  resultadoEl.hidden = false;

  const titulo = document.createElement("h3");
  titulo.textContent = "Mensagem montada com sucesso";
  resultadoEl.appendChild(titulo);

  const lista = document.createElement("ul");
  lista.className = "lista-resumo-contato";

  const linhas = [
    `Nome: ${dados.nome}`,
    `E-mail: ${dados.email}`,
    `Assunto: ${dados.assunto}`,
    `Mensagem: ${dados.mensagem}`,
  ];

  linhas.forEach((textoLinha) => {
    const li = document.createElement("li");
    li.textContent = textoLinha;
    lista.appendChild(li);
  });

  if (estado.carrinho.length > 0) {
    const { valorTotal } = calcularResumoPedido();
    const resumoItens = estado.carrinho
      .map((item) => `${item.quantidade}x ${item.nome}`)
      .join(", ");
    const liPedido = document.createElement("li");
    liPedido.textContent = `Pedido anexado (${formatarMoeda(valorTotal)}): ${resumoItens}`;
    lista.appendChild(liPedido);
  }

  resultadoEl.appendChild(lista);
}

function processarFormularioContato(evento) {
  evento.preventDefault();
  limparErrosFormulario();

  const nomeEl = document.getElementById("nome");
  const emailEl = document.getElementById("email");
  const assuntoEl = document.getElementById("assunto");
  const msgEl = document.getElementById("msg");
  const resultadoEl = document.getElementById("resultado");

  const nome = nomeEl ? nomeEl.value.trim() : "";
  const email = emailEl ? emailEl.value.trim() : "";
  const assunto = assuntoEl ? assuntoEl.value.trim() : "";
  const mensagem = msgEl ? msgEl.value.trim() : "";

  let primeiroCampoInvalido = null;

  if (nome === "") {
    exibirErroCampo(
      "nome",
      "erro-nome",
      "Por favor, informe seu nome para continuarmos o atendimento."
    );
    primeiroCampoInvalido = primeiroCampoInvalido || nomeEl;
  }

  if (email === "") {
    exibirErroCampo(
      "email",
      "erro-email",
      "Por favor, informe seu e-mail de contato."
    );
    primeiroCampoInvalido = primeiroCampoInvalido || emailEl;
  } else if (!validarEmail(email)) {
    exibirErroCampo(
      "email",
      "erro-email",
      "Informe um e-mail válido contendo '@' e domínio (ex.: nome@empresa.com.br)."
    );
    primeiroCampoInvalido = primeiroCampoInvalido || emailEl;
  }

  if (mensagem === "") {
    exibirErroCampo(
      "msg",
      "erro-msg",
      "Descreva sua dúvida ou solicitação antes de montar a mensagem."
    );
    primeiroCampoInvalido = primeiroCampoInvalido || msgEl;
  }

  if (primeiroCampoInvalido) {
    if (resultadoEl) {
      resultadoEl.hidden = true;
      resultadoEl.textContent = "";
    }
    primeiroCampoInvalido.focus();
    return;
  }

  montarResumoContatoSeguro({ nome, email, assunto, mensagem });
}

function anunciarCopia(texto, botaoAcionado) {
  const feedbackCopiaEl = document.getElementById("feedback-copia");
  if (feedbackCopiaEl) {
    feedbackCopiaEl.textContent = `Contato copiado: ${texto}`;
  }

  if (botaoAcionado) {
    const rotuloOriginal = botaoAcionado.dataset.rotuloOriginal || botaoAcionado.textContent;
    botaoAcionado.dataset.rotuloOriginal = rotuloOriginal;
    botaoAcionado.textContent = "Copiado!";
    setTimeout(() => {
      botaoAcionado.textContent = rotuloOriginal;
    }, 2500);
  }
}

function copiarContato(idAlvo, botaoAcionado) {
  const alvo = document.getElementById(idAlvo);
  if (!alvo) {
    return;
  }

  const texto = alvo.textContent.trim();
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    navigator.clipboard
      .writeText(texto)
      .then(() => {
        anunciarCopia(texto, botaoAcionado);
      })
      .catch(() => {
        anunciarCopia(texto, botaoAcionado);
      });
    return;
  }

  anunciarCopia(texto, botaoAcionado);
}

function alternarFaq(botaoPergunta) {
  const expandido = botaoPergunta.getAttribute("aria-expanded") === "true";
  const novoEstado = !expandido;
  botaoPergunta.setAttribute("aria-expanded", String(novoEstado));

  const idPainel = botaoPergunta.getAttribute("aria-controls");
  if (!idPainel) {
    return;
  }

  const painel = document.getElementById(idPainel);
  if (painel) {
    painel.hidden = !novoEstado;
    painel.classList.toggle("aberta", novoEstado);
  }
}

function atualizarAnoRodape() {
  const anoEl = document.getElementById("ano-atual");
  if (anoEl) {
    anoEl.textContent = String(new Date().getFullYear());
  }
}

/* --------------------------------------------------------------------------
   7. REGISTRO DE EVENTOS E INICIALIZAÇÃO
   -------------------------------------------------------------------------- */
function registrarEventos() {
  // Delegação para botões que trocam de aba (menu, topo, hero e pedido)
  document.addEventListener("click", (evento) => {
    const botaoAba = evento.target.closest("[data-aba]");
    if (botaoAba) {
      alternarAba(botaoAba.dataset.aba);
      return;
    }

    const botaoFiltro = evento.target.closest(".filtro-btn[data-linha]");
    if (botaoFiltro) {
      filtrarPorLinha(botaoFiltro.dataset.linha);
      return;
    }

    const botaoAdicionar = evento.target.closest(".btn-adicionar[data-sku]");
    if (botaoAdicionar) {
      adicionarAoPedido(botaoAdicionar.dataset.sku);
      return;
    }

    const botaoRemover = evento.target.closest(".btn-remover-item[data-remover-sku]");
    if (botaoRemover) {
      removerDoPedido(botaoRemover.dataset.removerSku);
      return;
    }

    const botaoCopiar = evento.target.closest(".btn-copiar[data-copy-target]");
    if (botaoCopiar) {
      copiarContato(botaoCopiar.dataset.copyTarget, botaoCopiar);
      return;
    }

    const botaoFaq = evento.target.closest(".faq-pergunta");
    if (botaoFaq) {
      alternarFaq(botaoFaq);
    }
  });

  const campoBusca = document.getElementById("busca");
  if (campoBusca) {
    campoBusca.addEventListener("input", (evento) => {
      buscarProdutos(evento.target.value);
    });
  }

  const seletorOrdenacao = document.getElementById("ordenacao-preco");
  if (seletorOrdenacao) {
    seletorOrdenacao.addEventListener("change", (evento) => {
      ordenarPorPreco(evento.target.value);
    });
  }

  const btnLimpar = document.getElementById("btn-limpar-pedido");
  if (btnLimpar) {
    btnLimpar.addEventListener("click", limparPedido);
  }

  const formContato = document.getElementById("form-contato");
  if (formContato) {
    formContato.addEventListener("submit", processarFormularioContato);
  }
}

function inicializarAplicacao() {
  atualizarAnoRodape();
  alternarAba(obterAbaInicial());
  atualizarBotoesFiltro();
  renderizarCatalogo();
  renderizarPedido();
  registrarEventos();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", inicializarAplicacao);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PRODUTOS,
    LINHAS_ROTULOS,
    ORDENACAO_ROTULOS,
    estado,
    formatarMoeda,
    obterProdutosProcessados,
    filtrarPorLinha,
    buscarProdutos,
    ordenarPorPreco,
    adicionarAoPedido,
    removerDoPedido,
    limparPedido,
    calcularResumoPedido,
    validarEmail,
    alternarAba,
    alternarFaq,
    processarFormularioContato,
    copiarContato,
    inicializarAplicacao,
  };
}
