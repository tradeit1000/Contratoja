import Anthropic from "@anthropic-ai/sdk";
import { Redis } from "@upstash/redis";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const redis = Redis.fromEnv();

const TYPE_NAMES = {
  pt: {
    arrendamento: "Contrato de Arrendamento Habitacional",
    arrendamento_curta: "Contrato de Arrendamento de Curta Duração",
    arrendamento_loja: "Contrato de Arrendamento de Loja",
    arrendamento_escritorio: "Contrato de Arrendamento de Escritório",
    arrendamento_armazem: "Contrato de Arrendamento de Armazém",
    arrendamento_estacionamento: "Contrato de Arrendamento de Estacionamento",
    prestacao: "Contrato de Prestação de Serviços",
    nda: "Acordo de Confidencialidade (NDA)",
    compra_venda: "Contrato de Compra e Venda",
    parceria: "Contrato de Parceria Comercial",
    trabalho: "Contrato de Trabalho",
    recibo_renda: "Recibo de Arrendamento",
    recibo_caucao: "Recibo de Caução",
    declaracao_entrada: "Declaração de Entrada de Inquilino",
    declaracao_saida: "Declaração de Saída de Inquilino",
    resolucao_contrato: "Resolução de Contrato de Arrendamento",
    pedido_caucao: "Pedido de Devolução de Caução",
  },
  en: {
    arrendamento: "Residential Rental Agreement",
    arrendamento_curta: "Short-term Rental Agreement",
    arrendamento_loja: "Commercial Shop Rental Agreement",
    arrendamento_escritorio: "Office Rental Agreement",
    arrendamento_armazem: "Warehouse Rental Agreement",
    arrendamento_estacionamento: "Parking Space Rental Agreement",
    prestacao: "Service Agreement",
    nda: "Non-Disclosure Agreement (NDA)",
    compra_venda: "Sale and Purchase Agreement",
    parceria: "Partnership Agreement",
    trabalho: "Employment Contract",
    recibo_renda: "Rent Receipt",
    recibo_caucao: "Security Deposit Receipt",
    declaracao_entrada: "Move-in Declaration",
    declaracao_saida: "Move-out Declaration",
    resolucao_contrato: "Rental Contract Termination",
    pedido_caucao: "Security Deposit Refund Request",
  }
};

// Legal sources per contract type
const LEGAL_SOURCES = {
  arrendamento: {
    dre: "arrendamento urbano habitacional NRAU lei 6/2006",
    dgsi: "acórdão arrendamento habitacional NRAU inquilino senhorio",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  arrendamento_curta: {
    dre: "alojamento local decreto lei 128/2014 arrendamento turístico",
    dgsi: "acórdão alojamento local arrendamento turístico",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=2082&tabela=leis",
  },
  arrendamento_loja: {
    dre: "arrendamento comercial não habitacional NRAU lei 6/2006",
    dgsi: "acórdão arrendamento comercial loja estabelecimento",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  arrendamento_escritorio: {
    dre: "arrendamento não habitacional escritório NRAU",
    dgsi: "acórdão arrendamento escritório não habitacional",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  arrendamento_armazem: {
    dre: "arrendamento industrial armazém não habitacional",
    dgsi: "acórdão arrendamento armazém industrial",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  arrendamento_estacionamento: {
    dre: "arrendamento garagem estacionamento lugar",
    dgsi: "acórdão arrendamento garagem estacionamento",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  prestacao: {
    dre: "prestação serviços código civil artigo 1154",
    dgsi: "acórdão prestação serviços contrato independente",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=775&tabela=leis&ficha=1154",
  },
  nda: {
    dre: "segredo negócio lei 99/2018 confidencialidade informação",
    dgsi: "acórdão segredo negócio confidencialidade empresa",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=3169&tabela=leis",
  },
  compra_venda: {
    dre: "compra venda código civil artigo 874 contrato",
    dgsi: "acórdão compra venda bens móveis código civil",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=775&tabela=leis&ficha=874",
  },
  parceria: {
    dre: "contrato sociedade parceria código civil código comercial",
    dgsi: "acórdão parceria comercial sociedade irregular",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=524&tabela=leis",
  },
  trabalho: {
    dre: "código trabalho lei 7/2009 contrato trabalho",
    dgsi: "acórdão contrato trabalho código trabalho 2024",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1047&tabela=leis",
  },
  recibo_renda: {
    dre: "recibo renda arrendamento IRS categoria F",
    dgsi: "acórdão recibo renda arrendamento obrigação",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  recibo_caucao: {
    dre: "caução arrendamento NRAU depósito garantia",
    dgsi: "acórdão caução arrendamento devolução prazo",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  declaracao_entrada: {
    dre: "estado conservação imóvel arrendamento entrega chaves",
    dgsi: "acórdão estado imóvel arrendamento entrega",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  declaracao_saida: {
    dre: "restituição imóvel arrendamento saída inquilino",
    dgsi: "acórdão restituição imóvel arrendamento cessação",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  resolucao_contrato: {
    dre: "resolução contrato arrendamento cessação NRAU denúncia",
    dgsi: "acórdão resolução cessação arrendamento prazo aviso",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
  pedido_caucao: {
    dre: "devolução caução arrendamento prazo 30 dias NRAU",
    dgsi: "acórdão devolução caução arrendamento prazo",
    pgd: "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1698&tabela=leis",
  },
};

async function searchLegalSources(type, typeName) {
  const sources = LEGAL_SOURCES[type] || {
    dre: `${typeName} legislação Portugal`,
    dgsi: `acórdão ${typeName} Portugal`,
    pgd: null,
  };

  const tools = [{ type: "web_search_20250305", name: "web_search" }];
  const results = {};

  // Search 1 — DRE (official legislation)
  try {
    const dreRes = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      tools,
      messages: [{
        role: "user",
        content: `Pesquisa no site dre.pt: "${sources.dre}". Encontra a legislação portuguesa mais recente e relevante. Resume os artigos e diplomas mais importantes, incluindo números de lei e datas. Sê preciso e conciso.`
      }]
    });
    results.legislation = dreRes.content.filter(b => b.type === "text").map(b => b.text).join("\n");
  } catch (e) {
    results.legislation = "";
  }

  // Search 2 — DGSI (jurisprudence)
  try {
    const dgsiRes = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      tools,
      messages: [{
        role: "user",
        content: `Pesquisa no site dgsi.pt: "${sources.dgsi}". Encontra acórdãos recentes relevantes dos tribunais portugueses. Resume as decisões mais importantes e os princípios jurídicos estabelecidos. Inclui referências dos acórdãos se possível.`
      }]
    });
    results.jurisprudence = dgsiRes.content.filter(b => b.type === "text").map(b => b.text).join("\n");
  } catch (e) {
    results.jurisprudence = "";
  }

  // Search 3 — PGD Lisboa (legal text)
  if (sources.pgd) {
    try {
      const pgdRes = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        tools,
        messages: [{
          role: "user",
          content: `Pesquisa em pgdlisboa.pt os artigos legais mais relevantes para ${typeName}. Resume os artigos chave e os seus requisitos legais essenciais.`
        }]
      });
      results.legalText = pgdRes.content.filter(b => b.type === "text").map(b => b.text).join("\n");
    } catch (e) {
      results.legalText = "";
    }
  }

  return results;
}

export async function POST(req) {
  try {
    const { type, fields, lang = "pt" } = await req.json();
    const typeName = TYPE_NAMES[lang]?.[type] || TYPE_NAMES.pt[type] || type;
    const typeNamePt = TYPE_NAMES.pt[type] || type;
    const fieldText = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");

    // Search legal sources in parallel
    const legalSources = await searchLegalSources(type, typeNamePt);

    const legalContext = `
=== LEGISLAÇÃO OFICIAL (DRE.PT) ===
${legalSources.legislation || "Não disponível"}

=== JURISPRUDÊNCIA (DGSI.PT - TRIBUNAIS PORTUGUESES) ===
${legalSources.jurisprudence || "Não disponível"}

=== ARTIGOS LEGAIS (PGDLISBOA.PT) ===
${legalSources.legalText || "Não disponível"}
    `.trim();

    const langInstruction = lang === "en"
      ? `Generate the document in English. The document must comply with Portuguese law but be written entirely in English for expats living in Portugal. Include a references section at the end citing the Portuguese legal sources consulted.`
      : `Gera o documento em português europeu (Portugal). Inclui no final do documento uma secção "Referências Legais" com as fontes consultadas (legislação e jurisprudência relevante encontrada).`;

    const contractResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2500,
      messages: [{
        role: "user",
        content: `Tens acesso às seguintes fontes jurídicas oficiais portuguesas consultadas especificamente para este documento:

${legalContext}

---

Com base nestas fontes jurídicas oficiais, gera um ${typeNamePt} profissional e juridicamente rigoroso.

${langInstruction}

Dados fornecidos:
${fieldText}

O documento deve:
- Basear-se EXPLICITAMENTE na legislação e jurisprudência consultada acima
- Incluir todas as cláusulas essenciais, numeradas
- Ter formato legal adequado
- Incluir data em Lisboa e espaços para assinatura
- Ser completo, formal e pronto a usar
- Terminar com uma secção "Referências Legais" que cita os diplomas e acórdãos consultados

Responde apenas com o texto do documento.`
      }]
    });

    const fullContract = contractResponse.content
      .filter(b => b.type === "text").map(b => b.text).join("\n");

    // Store in Redis (24h TTL)
    const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await redis.set(docId, fullContract, { ex: 86400 });

    // Return preview only (first 35%)
    const lines = fullContract.split("\n");
    const cutoff = Math.max(4, Math.floor(lines.length * 0.35));
    const preview = lines.slice(0, cutoff).join("\n");

    return Response.json({ preview, docId });
  } catch (err) {
    console.error(err);
    if (err?.status === 529) {
      return Response.json({ error: "Serviço temporariamente sobrecarregado. Tenta novamente em 30 segundos." }, { status: 503 });
    }
    return Response.json({ error: "Erro ao gerar documento." }, { status: 500 });
  }
}
