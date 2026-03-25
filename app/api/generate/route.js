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

const LEGAL_QUERIES = {
  arrendamento: "legislação arrendamento urbano habitacional Portugal NRAU 2024",
  arrendamento_curta: "arrendamento curta duração alojamento local Portugal lei 2024",
  arrendamento_loja: "arrendamento comercial loja Portugal legislação 2024",
  arrendamento_escritorio: "arrendamento escritório espaço comercial Portugal lei 2024",
  arrendamento_armazem: "arrendamento armazém espaço industrial Portugal legislação 2024",
  arrendamento_estacionamento: "arrendamento estacionamento garagem Portugal lei 2024",
  prestacao: "contrato prestação serviços Portugal código civil 2024",
  nda: "acordo confidencialidade NDA segredos comerciais Portugal 2024",
  compra_venda: "contrato compra venda Portugal código civil 2024",
  parceria: "contrato parceria comercial sociedades Portugal 2024",
  trabalho: "código trabalho Portugal 2024 contrato trabalho",
  recibo_renda: "recibo arrendamento requisitos legais Portugal 2024",
  recibo_caucao: "caução arrendamento Portugal regras legais 2024",
  declaracao_entrada: "declaração entrada inquilino arrendamento Portugal 2024",
  declaracao_saida: "declaração saída inquilino arrendamento Portugal 2024",
  resolucao_contrato: "resolução contrato arrendamento Portugal lei requisitos 2024",
  pedido_caucao: "devolução caução arrendamento Portugal prazo lei 2024",
};

export async function POST(req) {
  try {
    const { type, fields, lang = "pt" } = await req.json();
    const typeName = TYPE_NAMES[lang]?.[type] || TYPE_NAMES.pt[type] || type;
    const fieldText = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");
    const legalQuery = LEGAL_QUERIES[type] || `legislação ${type} Portugal 2024`;

    // Step 1 — search for current legislation (always in Portuguese)
    const searchResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: `Pesquisa na web: "${legalQuery}". Resume em 3-5 pontos as regras legais mais importantes e actuais em Portugal para este tipo de documento. Sê conciso e preciso.` }]
    });

    const legalContext = searchResponse.content
      .filter(b => b.type === "text").map(b => b.text).join("\n");

    // Step 2 — generate contract in chosen language
    const langInstruction = lang === "en"
      ? `Generate the document in English. The document must comply with Portuguese law but be written entirely in English, as it is intended for expats living in Portugal.`
      : `Gera o documento em português europeu (Portugal).`;

    const contractResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: `You have access to the following updated legal information about ${typeName} in Portugal:\n\n${legalContext}\n\n---\n\nBased on this legal information, generate a professional and legally correct ${typeName}.\n\n${langInstruction}\n\nData provided:\n${fieldText}\n\nThe document must:\n- Comply with the most recent Portuguese legislation\n- Include all essential clauses, numbered\n- Have proper legal format\n- Include date in Lisbon and signature spaces\n- Be complete, formal and ready to use\n\nRespond only with the document text, no introduction or explanations.` }]
    });

    const fullContract = contractResponse.content
      .filter(b => b.type === "text").map(b => b.text).join("\n");

    // Step 3 — store in Redis (24h TTL)
    const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await redis.set(docId, fullContract, { ex: 86400 });

    // Step 4 — return preview only
    const lines = fullContract.split("\n");
    const cutoff = Math.max(4, Math.floor(lines.length * 0.35));
    const preview = lines.slice(0, cutoff).join("\n");

    return Response.json({ preview, docId });
  } catch (err) {
    console.error(err);
    if (err?.status === 529) {
      return Response.json({ error: lang === "en" ? "Service temporarily overloaded. Please try again in 30 seconds." : "Serviço temporariamente sobrecarregado. Tenta novamente em 30 segundos." }, { status: 503 });
    }
    return Response.json({ error: lang === "en" ? "Error generating document." : "Erro ao gerar documento." }, { status: 500 });
  }
}
