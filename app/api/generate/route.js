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

export async function POST(req) {
  try {
    const { type, fields } = await req.json();
    const typeName = TYPE_NAMES[type] || type;
    const fieldText = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: `Gera um ${typeName} profissional e juridicamente correto em português europeu (Portugal), com base nos seguintes dados:\n\n${fieldText}\n\nO contrato deve incluir todas as cláusulas essenciais, numeradas, com formato legal adequado. Inclui data em Lisboa e espaços para assinatura. Deve ser completo, formal e pronto a assinar. Responde apenas com o texto do contrato, sem introdução nem explicações.`
      }]
    });

    return Response.json({ contract: message.content[0].text });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erro ao gerar contrato." }, { status: 500 });
  }
}
