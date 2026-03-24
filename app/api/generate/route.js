import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TYPE_NAMES = {
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
    const { type, fields } = await req.json();
    const typeName = TYPE_NAMES[type] || type;
    const fieldText = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");
    const legalQuery = LEGAL_QUERIES[type] || `legislação ${typeName} Portugal 2024`;

    const searchResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `Pesquisa na web: "${legalQuery}". Resume em 3-5 pontos as regras legais mais importantes e actuais em Portugal para este tipo de documento. Sê conciso e preciso.`
      }]
    });

    const legalContext = searchResponse.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n");

    const contractResponse = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `Tens acesso à seguinte informação legal actualizada sobre ${typeName} em Portugal:\n\n${legalContext}\n\n---\n\nCom base nesta informação legal actualizada, gera um ${typeName} profissional e juridicamente correto em português europeu (Portugal), com os seguintes dados:\n\n${fieldText}\n\nO documento deve:\n- Respeitar a legislação portuguesa mais recente\n- Incluir todas as cláusulas essenciais, numeradas\n- Ter formato legal adequado\n- Incluir data em Lisboa e espaços para assinatura\n- Ser completo, formal e pronto a usar\n\nResponde apenas com o texto do documento, sem introdução nem explicações.`
      }]
    });

    const contract = contractResponse.content
      .filter(block => block.type === "text")
      .map(block => block.text)
      .join("\n");

    return Response.json({ contract });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erro ao gerar contrato." }, { status: 500 });
  }
}
