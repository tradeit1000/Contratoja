import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TYPE_NAMES = {
  arrendamento: "Contrato de Arrendamento",
  prestacao: "Contrato de Prestação de Serviços",
  nda: "Acordo de Confidencialidade (NDA)",
  compra_venda: "Contrato de Compra e Venda",
  parceria: "Contrato de Parceria Comercial",
  trabalho: "Contrato de Trabalho",
};

const LEGAL_QUERIES = {
  arrendamento: "legislação arrendamento urbano Portugal NRAU 2024 atualização",
  prestacao: "contrato prestação serviços legislação Portugal 2024 código civil",
  nda: "acordo confidencialidade NDA lei Portugal segredos comerciais 2024",
  compra_venda: "contrato compra venda bens móveis legislação Portugal código civil 2024",
  parceria: "contrato parceria comercial sociedades Portugal legislação 2024",
  trabalho: "código trabalho Portugal 2024 atualização contrato trabalho",
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
        content: `Pesquisa na web: "${legalQuery}". Resume em 3-5 pontos as regras legais mais importantes e actuais em Portugal para este tipo de contrato. Sê conciso e preciso.`
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
        content: `Tens acesso à seguinte informação legal actualizada sobre ${typeName} em Portugal:\n\n${legalContext}\n\n---\n\nCom base nesta informação legal actualizada, gera um ${typeName} profissional e juridicamente correto em português europeu (Portugal), com os seguintes dados:\n\n${fieldText}\n\nO contrato deve:\n- Respeitar a legislação portuguesa mais recente\n- Incluir todas as cláusulas essenciais, numeradas\n- Ter formato legal adequado\n- Incluir data em Lisboa e espaços para assinatura\n- Ser completo, formal e pronto a assinar\n\nResponde apenas com o texto do contrato, sem introdução nem explicações.`
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
