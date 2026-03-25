"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";

// ── TRANSLATIONS ──────────────────────────────────────────────
const T = {
  pt: {
    tagline: "Contratos Profissionais",
    tagline2: "em 30 segundos.",
    sub: "Gera contratos juridicamente sólidos para Portugal com IA. Sempre actualizados com a legislação em vigor. Sem advogados. Sem complicações.",
    cta: "Criar Documento →",
    price: "2,99€/doc · 7,99€/mês ilimitado",
    stat1: "Tipos de Documento", stat2: "Tempo de Geração", stat3: "Lei Portuguesa",
    aiBanner: "Contratos que acompanham a lei",
    aiBannerText: "Antes de gerar cada documento, a nossa IA pesquisa automaticamente a legislação portuguesa mais recente — NRAU, Código do Trabalho, Código Civil — garantindo que o teu contrato reflecte sempre as regras em vigor. Não usamos modelos estáticos.",
    f1t: "Juridicamente sólido", f1d: "Todas as cláusulas essenciais incluídas automaticamente.",
    f2t: "Sempre actualizado", f2d: "A IA verifica a legislação actual antes de cada geração.",
    f3t: "Pronto em 30 segundos", f3d: "Preenches os dados, a IA redige o documento completo.",
    f4t: "A partir de 2,99€", f4d: "O que um advogado cobra 200€, aqui custa 2,99€.",
    chooseDoc: "Que documento precisas?",
    chooseSub: "Escolhe o tipo e nós tratamos do resto.",
    groups: ["Arrendamento", "Trabalho", "Empresa", "Documentos"],
    aiBadge: "🧠 IA PESQUISA LEGISLAÇÃO ACTUAL ANTES DE GERAR",
    fillData: "Preenche os dados e a IA gera o documento completo.",
    generateBtn: "✨ Gerar Documento com IA",
    back: "← Voltar",
    generating: "A pesquisar legislação e a redigir...",
    generatingSub: "A IA está a verificar a lei em vigor e a construir todas as cláusulas.",
    generated: "✓ DOCUMENTO GERADO · LEGISLAÇÃO VERIFICADA",
    unlock: "Desbloquear Documento Completo",
    unlockSub: "O teu documento está pronto. Desbloqueia para copiar e guardar.",
    unlockBtn: "Desbloquear — 2,99€",
    monthly: "7,99€/mês · Documentos Ilimitados",
    newDoc: "← Criar outro documento",
    footer: "Os documentos gerados são para referência. Consulta um advogado para situações complexas.",
    errGen: "Erro ao gerar. Tenta novamente.",
    errConn: "Erro de ligação. Tenta novamente.",
    errPay: "Erro ao processar pagamento.",
    redirecting: "A redirecionar...",
    poweredBy: "POWERED BY INTELIGÊNCIA ARTIFICIAL",
  },
  en: {
    tagline: "Professional Contracts",
    tagline2: "in 30 seconds.",
    sub: "Generate legally sound contracts for Portugal with AI. Always updated with current legislation. No lawyers. No hassle.",
    cta: "Create Document →",
    price: "€2.99/doc · €7.99/month unlimited",
    stat1: "Document Types", stat2: "Generation Time", stat3: "Portuguese Law",
    aiBanner: "Contracts that keep up with the law",
    aiBannerText: "Before generating each document, our AI automatically searches the latest Portuguese legislation — NRAU, Labour Code, Civil Code — ensuring your contract always reflects current rules. No static templates.",
    f1t: "Legally sound", f1d: "All essential clauses included automatically.",
    f2t: "Always updated", f2d: "AI verifies current legislation before each generation.",
    f3t: "Ready in 30 seconds", f3d: "Fill in your details, the AI drafts the complete document.",
    f4t: "From €2.99", f4d: "What a lawyer charges €200 for, here it costs €2.99.",
    chooseDoc: "What document do you need?",
    chooseSub: "Choose the type and we'll handle the rest.",
    groups: ["Rental", "Work", "Business", "Documents"],
    aiBadge: "🧠 AI SEARCHES CURRENT LEGISLATION BEFORE GENERATING",
    fillData: "Fill in your details and the AI generates the complete document.",
    generateBtn: "✨ Generate Document with AI",
    back: "← Back",
    generating: "Searching legislation and drafting...",
    generatingSub: "The AI is verifying current law and building all the clauses.",
    generated: "✓ DOCUMENT GENERATED · LEGISLATION VERIFIED",
    unlock: "Unlock Complete Document",
    unlockSub: "Your document is ready. Unlock to copy and save.",
    unlockBtn: "Unlock — €2.99",
    monthly: "€7.99/month · Unlimited Documents",
    newDoc: "← Create another document",
    footer: "Generated documents are for reference only. Consult a lawyer for complex situations.",
    errGen: "Error generating. Please try again.",
    errConn: "Connection error. Please try again.",
    errPay: "Payment processing error.",
    redirecting: "Redirecting...",
    poweredBy: "POWERED BY ARTIFICIAL INTELLIGENCE",
  }
};

const CONTRACT_TYPES = {
  pt: [
    { id: "arrendamento", label: "Arrendamento Habitacional", icon: "🏠", desc: "Residencial longa duração", group: "Arrendamento" },
    { id: "arrendamento_curta", label: "Arrendamento Curta Duração", icon: "🏖️", desc: "Alojamento local / turismo", group: "Arrendamento" },
    { id: "arrendamento_loja", label: "Arrendamento de Loja", icon: "🏪", desc: "Espaço comercial", group: "Arrendamento" },
    { id: "arrendamento_escritorio", label: "Arrendamento de Escritório", icon: "🏢", desc: "Escritório ou cowork", group: "Arrendamento" },
    { id: "arrendamento_armazem", label: "Arrendamento de Armazém", icon: "🏭", desc: "Espaço industrial", group: "Arrendamento" },
    { id: "arrendamento_estacionamento", label: "Arrendamento de Estacionamento", icon: "🅿️", desc: "Garagem ou lugar", group: "Arrendamento" },
    { id: "prestacao", label: "Prestação de Serviços", icon: "💼", desc: "Freelancer / consultoria", group: "Trabalho" },
    { id: "trabalho", label: "Contrato de Trabalho", icon: "📋", desc: "Vínculo laboral", group: "Trabalho" },
    { id: "nda", label: "Confidencialidade (NDA)", icon: "🔒", desc: "Protege as tuas ideias", group: "Empresa" },
    { id: "compra_venda", label: "Compra e Venda", icon: "🤝", desc: "Bens móveis ou imóveis", group: "Empresa" },
    { id: "parceria", label: "Parceria Comercial", icon: "🏗️", desc: "Joint venture / colaboração", group: "Empresa" },
    { id: "recibo_renda", label: "Recibo de Arrendamento", icon: "🧾", desc: "Recibo mensal de renda", group: "Documentos" },
    { id: "recibo_caucao", label: "Recibo de Caução", icon: "💰", desc: "Comprovativo de caução", group: "Documentos" },
    { id: "declaracao_entrada", label: "Declaração de Entrada", icon: "🔑", desc: "Entrada do inquilino", group: "Documentos" },
    { id: "declaracao_saida", label: "Declaração de Saída", icon: "🚪", desc: "Saída do inquilino", group: "Documentos" },
    { id: "resolucao_contrato", label: "Resolução de Contrato", icon: "📝", desc: "Terminar arrendamento", group: "Documentos" },
    { id: "pedido_caucao", label: "Pedido Devolução Caução", icon: "💸", desc: "Reclamar caução", group: "Documentos" },
  ],
  en: [
    { id: "arrendamento", label: "Residential Rental", icon: "🏠", desc: "Long-term residential", group: "Rental" },
    { id: "arrendamento_curta", label: "Short-term Rental", icon: "🏖️", desc: "Holiday / local accommodation", group: "Rental" },
    { id: "arrendamento_loja", label: "Shop Rental", icon: "🏪", desc: "Commercial space", group: "Rental" },
    { id: "arrendamento_escritorio", label: "Office Rental", icon: "🏢", desc: "Office or coworking", group: "Rental" },
    { id: "arrendamento_armazem", label: "Warehouse Rental", icon: "🏭", desc: "Industrial space", group: "Rental" },
    { id: "arrendamento_estacionamento", label: "Parking Space Rental", icon: "🅿️", desc: "Garage or parking spot", group: "Rental" },
    { id: "prestacao", label: "Service Agreement", icon: "💼", desc: "Freelancer / consulting", group: "Work" },
    { id: "trabalho", label: "Employment Contract", icon: "📋", desc: "Employment relationship", group: "Work" },
    { id: "nda", label: "Confidentiality (NDA)", icon: "🔒", desc: "Protect your ideas", group: "Business" },
    { id: "compra_venda", label: "Sale Agreement", icon: "🤝", desc: "Movable or immovable goods", group: "Business" },
    { id: "parceria", label: "Partnership Agreement", icon: "🏗️", desc: "Joint venture / collaboration", group: "Business" },
    { id: "recibo_renda", label: "Rent Receipt", icon: "🧾", desc: "Monthly rent receipt", group: "Documents" },
    { id: "recibo_caucao", label: "Deposit Receipt", icon: "💰", desc: "Security deposit proof", group: "Documents" },
    { id: "declaracao_entrada", label: "Move-in Declaration", icon: "🔑", desc: "Tenant check-in", group: "Documents" },
    { id: "declaracao_saida", label: "Move-out Declaration", icon: "🚪", desc: "Tenant check-out", group: "Documents" },
    { id: "resolucao_contrato", label: "Contract Termination", icon: "📝", desc: "End rental agreement", group: "Documents" },
    { id: "pedido_caucao", label: "Deposit Refund Request", icon: "💸", desc: "Claim deposit back", group: "Documents" },
  ]
};

const FIELDS = {
  arrendamento: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Arrendatário", placeholder: "Maria Santos" },
      { key: "morada", label: "Morada do Imóvel", placeholder: "Rua das Flores, 12, Lisboa" },
      { key: "renda", label: "Renda Mensal (€)", placeholder: "850" },
      { key: "duracao", label: "Duração do Contrato", placeholder: "1 ano" },
      { key: "inicio", label: "Data de Início", placeholder: "01/04/2026" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant Name", placeholder: "Maria Santos" },
      { key: "morada", label: "Property Address", placeholder: "Rua das Flores, 12, Lisbon" },
      { key: "renda", label: "Monthly Rent (€)", placeholder: "850" },
      { key: "duracao", label: "Contract Duration", placeholder: "1 year" },
      { key: "inicio", label: "Start Date", placeholder: "01/04/2026" },
    ]
  },
  arrendamento_curta: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Arrendatário", placeholder: "Maria Santos" },
      { key: "morada", label: "Morada do Imóvel", placeholder: "Rua das Flores, 12, Lisboa" },
      { key: "renda", label: "Valor Total (€)", placeholder: "500" },
      { key: "inicio", label: "Data de Início", placeholder: "01/06/2026" },
      { key: "fim", label: "Data de Fim", placeholder: "15/06/2026" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant Name", placeholder: "Maria Santos" },
      { key: "morada", label: "Property Address", placeholder: "Rua das Flores, 12, Lisbon" },
      { key: "renda", label: "Total Amount (€)", placeholder: "500" },
      { key: "inicio", label: "Start Date", placeholder: "01/06/2026" },
      { key: "fim", label: "End Date", placeholder: "15/06/2026" },
    ]
  },
  prestacao: {
    pt: [
      { key: "prestador", label: "Nome do Prestador", placeholder: "Ana Costa" },
      { key: "cliente", label: "Nome do Cliente/Empresa", placeholder: "Empresa X, Lda" },
      { key: "servico", label: "Descrição do Serviço", placeholder: "Desenvolvimento de website" },
      { key: "valor", label: "Valor Total (€)", placeholder: "2500" },
      { key: "prazo", label: "Prazo de Entrega", placeholder: "30 dias" },
      { key: "pagamento", label: "Forma de Pagamento", placeholder: "50% início, 50% entrega" },
    ],
    en: [
      { key: "prestador", label: "Service Provider Name", placeholder: "Ana Costa" },
      { key: "cliente", label: "Client/Company Name", placeholder: "Company X, Lda" },
      { key: "servico", label: "Service Description", placeholder: "Website development" },
      { key: "valor", label: "Total Amount (€)", placeholder: "2500" },
      { key: "prazo", label: "Delivery Deadline", placeholder: "30 days" },
      { key: "pagamento", label: "Payment Terms", placeholder: "50% upfront, 50% on delivery" },
    ]
  },
  nda: {
    pt: [
      { key: "parte_a", label: "Parte A (Divulgante)", placeholder: "Empresa Alpha, SA" },
      { key: "parte_b", label: "Parte B (Receptora)", placeholder: "Empresa Beta, Lda" },
      { key: "objeto", label: "Objeto da Confidencialidade", placeholder: "Estratégia de produto e dados comerciais" },
      { key: "duracao", label: "Duração", placeholder: "2 anos" },
    ],
    en: [
      { key: "parte_a", label: "Party A (Disclosing)", placeholder: "Alpha Company, SA" },
      { key: "parte_b", label: "Party B (Receiving)", placeholder: "Beta Company, Lda" },
      { key: "objeto", label: "Subject of Confidentiality", placeholder: "Product strategy and commercial data" },
      { key: "duracao", label: "Duration", placeholder: "2 years" },
    ]
  },
  compra_venda: {
    pt: [
      { key: "vendedor", label: "Nome do Vendedor", placeholder: "Carlos Mendes" },
      { key: "comprador", label: "Nome do Comprador", placeholder: "Sofia Rodrigues" },
      { key: "bem", label: "Descrição do Bem", placeholder: "Automóvel marca X, matrícula XX-XX-XX" },
      { key: "preco", label: "Preço de Venda (€)", placeholder: "12000" },
      { key: "pagamento", label: "Forma de Pagamento", placeholder: "Transferência bancária" },
    ],
    en: [
      { key: "vendedor", label: "Seller Name", placeholder: "Carlos Mendes" },
      { key: "comprador", label: "Buyer Name", placeholder: "Sofia Rodrigues" },
      { key: "bem", label: "Item Description", placeholder: "Vehicle brand X, plate XX-XX-XX" },
      { key: "preco", label: "Sale Price (€)", placeholder: "12000" },
      { key: "pagamento", label: "Payment Method", placeholder: "Bank transfer" },
    ]
  },
  parceria: {
    pt: [
      { key: "empresa_a", label: "Empresa A", placeholder: "Alpha Solutions, Lda" },
      { key: "empresa_b", label: "Empresa B", placeholder: "Beta Group, SA" },
      { key: "objeto", label: "Objeto da Parceria", placeholder: "Desenvolvimento e comercialização de software" },
      { key: "partilha", label: "Partilha de Resultados", placeholder: "50% para cada parte" },
      { key: "duracao", label: "Duração", placeholder: "2 anos, renovável" },
    ],
    en: [
      { key: "empresa_a", label: "Company A", placeholder: "Alpha Solutions, Lda" },
      { key: "empresa_b", label: "Company B", placeholder: "Beta Group, SA" },
      { key: "objeto", label: "Partnership Purpose", placeholder: "Software development and commercialisation" },
      { key: "partilha", label: "Revenue Sharing", placeholder: "50% each party" },
      { key: "duracao", label: "Duration", placeholder: "2 years, renewable" },
    ]
  },
  trabalho: {
    pt: [
      { key: "empregador", label: "Entidade Empregadora", placeholder: "Empresa Y, SA" },
      { key: "trabalhador", label: "Nome do Trabalhador", placeholder: "Rui Fernandes" },
      { key: "funcao", label: "Função / Cargo", placeholder: "Desenvolvedor Frontend" },
      { key: "salario", label: "Salário Mensal Bruto (€)", placeholder: "1800" },
      { key: "inicio", label: "Data de Início", placeholder: "01/04/2026" },
      { key: "horario", label: "Horário de Trabalho", placeholder: "40h semanais" },
    ],
    en: [
      { key: "empregador", label: "Employer", placeholder: "Company Y, SA" },
      { key: "trabalhador", label: "Employee Name", placeholder: "Rui Fernandes" },
      { key: "funcao", label: "Role / Position", placeholder: "Frontend Developer" },
      { key: "salario", label: "Gross Monthly Salary (€)", placeholder: "1800" },
      { key: "inicio", label: "Start Date", placeholder: "01/04/2026" },
      { key: "horario", label: "Working Hours", placeholder: "40h per week" },
    ]
  },
  recibo_renda: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Inquilino", placeholder: "Maria Santos" },
      { key: "morada", label: "Morada do Imóvel", placeholder: "Rua das Flores, 12, Lisboa" },
      { key: "valor", label: "Valor da Renda (€)", placeholder: "850" },
      { key: "mes", label: "Mês Referente", placeholder: "Abril 2026" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant Name", placeholder: "Maria Santos" },
      { key: "morada", label: "Property Address", placeholder: "Rua das Flores, 12, Lisbon" },
      { key: "valor", label: "Rent Amount (€)", placeholder: "850" },
      { key: "mes", label: "Reference Month", placeholder: "April 2026" },
    ]
  },
  recibo_caucao: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Inquilino", placeholder: "Maria Santos" },
      { key: "morada", label: "Morada do Imóvel", placeholder: "Rua das Flores, 12, Lisboa" },
      { key: "valor", label: "Valor da Caução (€)", placeholder: "1700" },
      { key: "data", label: "Data de Pagamento", placeholder: "01/04/2026" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant Name", placeholder: "Maria Santos" },
      { key: "morada", label: "Property Address", placeholder: "Rua das Flores, 12, Lisbon" },
      { key: "valor", label: "Deposit Amount (€)", placeholder: "1700" },
      { key: "data", label: "Payment Date", placeholder: "01/04/2026" },
    ]
  },
  declaracao_entrada: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Inquilino", placeholder: "Maria Santos" },
      { key: "morada", label: "Morada do Imóvel", placeholder: "Rua das Flores, 12, Lisboa" },
      { key: "data", label: "Data de Entrada", placeholder: "01/04/2026" },
      { key: "estado", label: "Estado do Imóvel", placeholder: "Bom estado geral, sem danos visíveis" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant Name", placeholder: "Maria Santos" },
      { key: "morada", label: "Property Address", placeholder: "Rua das Flores, 12, Lisbon" },
      { key: "data", label: "Move-in Date", placeholder: "01/04/2026" },
      { key: "estado", label: "Property Condition", placeholder: "Good overall condition, no visible damage" },
    ]
  },
  declaracao_saida: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Inquilino", placeholder: "Maria Santos" },
      { key: "morada", label: "Morada do Imóvel", placeholder: "Rua das Flores, 12, Lisboa" },
      { key: "data", label: "Data de Saída", placeholder: "31/03/2027" },
      { key: "estado", label: "Estado do Imóvel à Saída", placeholder: "Bom estado, sem danos" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant Name", placeholder: "Maria Santos" },
      { key: "morada", label: "Property Address", placeholder: "Rua das Flores, 12, Lisbon" },
      { key: "data", label: "Move-out Date", placeholder: "31/03/2027" },
      { key: "estado", label: "Property Condition at Departure", placeholder: "Good condition, no damage" },
    ]
  },
  resolucao_contrato: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Inquilino", placeholder: "Maria Santos" },
      { key: "morada", label: "Morada do Imóvel", placeholder: "Rua das Flores, 12, Lisboa" },
      { key: "motivo", label: "Motivo da Resolução", placeholder: "Fim do contrato por mútuo acordo" },
      { key: "data_saida", label: "Data de Saída", placeholder: "31/03/2027" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant Name", placeholder: "Maria Santos" },
      { key: "morada", label: "Property Address", placeholder: "Rua das Flores, 12, Lisbon" },
      { key: "motivo", label: "Reason for Termination", placeholder: "End of contract by mutual agreement" },
      { key: "data_saida", label: "Move-out Date", placeholder: "31/03/2027" },
    ]
  },
  pedido_caucao: {
    pt: [
      { key: "arrendatario", label: "Nome do Inquilino", placeholder: "Maria Santos" },
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "morada", label: "Morada do Imóvel", placeholder: "Rua das Flores, 12, Lisboa" },
      { key: "valor", label: "Valor da Caução (€)", placeholder: "1700" },
      { key: "data_saida", label: "Data de Saída", placeholder: "31/03/2027" },
      { key: "iban", label: "IBAN para Transferência", placeholder: "PT50 0000 0000 0000 0000 0000 0" },
    ],
    en: [
      { key: "arrendatario", label: "Tenant Name", placeholder: "Maria Santos" },
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "morada", label: "Property Address", placeholder: "Rua das Flores, 12, Lisbon" },
      { key: "valor", label: "Deposit Amount (€)", placeholder: "1700" },
      { key: "data_saida", label: "Move-out Date", placeholder: "31/03/2027" },
      { key: "iban", label: "IBAN for Transfer", placeholder: "PT50 0000 0000 0000 0000 0000 0" },
    ]
  },
  arrendamento_loja: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Arrendatário/Empresa", placeholder: "Empresa X, Lda" },
      { key: "morada", label: "Morada do Espaço", placeholder: "Rua do Comércio, 5, Porto" },
      { key: "renda", label: "Renda Mensal (€)", placeholder: "1200" },
      { key: "duracao", label: "Duração do Contrato", placeholder: "3 anos" },
      { key: "inicio", label: "Data de Início", placeholder: "01/04/2026" },
      { key: "atividade", label: "Actividade Comercial", placeholder: "Restauração" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant/Company Name", placeholder: "Company X, Lda" },
      { key: "morada", label: "Property Address", placeholder: "Rua do Comércio, 5, Porto" },
      { key: "renda", label: "Monthly Rent (€)", placeholder: "1200" },
      { key: "duracao", label: "Contract Duration", placeholder: "3 years" },
      { key: "inicio", label: "Start Date", placeholder: "01/04/2026" },
      { key: "atividade", label: "Business Activity", placeholder: "Restaurant" },
    ]
  },
  arrendamento_escritorio: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Arrendatário/Empresa", placeholder: "Empresa Y, SA" },
      { key: "morada", label: "Morada do Escritório", placeholder: "Av. da Liberdade, 10, Lisboa" },
      { key: "renda", label: "Renda Mensal (€)", placeholder: "900" },
      { key: "duracao", label: "Duração do Contrato", placeholder: "2 anos" },
      { key: "inicio", label: "Data de Início", placeholder: "01/04/2026" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant/Company Name", placeholder: "Company Y, SA" },
      { key: "morada", label: "Office Address", placeholder: "Av. da Liberdade, 10, Lisbon" },
      { key: "renda", label: "Monthly Rent (€)", placeholder: "900" },
      { key: "duracao", label: "Contract Duration", placeholder: "2 years" },
      { key: "inicio", label: "Start Date", placeholder: "01/04/2026" },
    ]
  },
  arrendamento_armazem: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Arrendatário/Empresa", placeholder: "Logística Z, Lda" },
      { key: "morada", label: "Morada do Armazém", placeholder: "Zona Industrial, Lote 5, Setúbal" },
      { key: "area", label: "Área (m²)", placeholder: "500" },
      { key: "renda", label: "Renda Mensal (€)", placeholder: "2000" },
      { key: "duracao", label: "Duração", placeholder: "2 anos" },
      { key: "inicio", label: "Data de Início", placeholder: "01/04/2026" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant/Company Name", placeholder: "Logistics Z, Lda" },
      { key: "morada", label: "Warehouse Address", placeholder: "Industrial Zone, Plot 5, Setúbal" },
      { key: "area", label: "Area (m²)", placeholder: "500" },
      { key: "renda", label: "Monthly Rent (€)", placeholder: "2000" },
      { key: "duracao", label: "Duration", placeholder: "2 years" },
      { key: "inicio", label: "Start Date", placeholder: "01/04/2026" },
    ]
  },
  arrendamento_estacionamento: {
    pt: [
      { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
      { key: "arrendatario", label: "Nome do Arrendatário", placeholder: "Maria Santos" },
      { key: "morada", label: "Localização do Lugar", placeholder: "Garagem do Edifício X, Lugar 12, Lisboa" },
      { key: "renda", label: "Renda Mensal (€)", placeholder: "80" },
      { key: "duracao", label: "Duração", placeholder: "1 ano" },
      { key: "inicio", label: "Data de Início", placeholder: "01/04/2026" },
    ],
    en: [
      { key: "senhorio", label: "Landlord Name", placeholder: "João Silva" },
      { key: "arrendatario", label: "Tenant Name", placeholder: "Maria Santos" },
      { key: "morada", label: "Parking Location", placeholder: "Building X Garage, Space 12, Lisbon" },
      { key: "renda", label: "Monthly Rent (€)", placeholder: "80" },
      { key: "duracao", label: "Duration", placeholder: "1 year" },
      { key: "inicio", label: "Start Date", placeholder: "01/04/2026" },
    ]
  },
};

export default function Home() {
  const [lang, setLang] = useState("pt");
  const [step, setStep] = useState("home");
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const [contract, setContract] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [docId, setDocId] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  const t = T[lang];
  const types = CONTRACT_TYPES[lang];
  const groups = t.groups;

  const currentGroup = activeGroup || groups[0];
  const fields = selectedType ? (FIELDS[selectedType]?.[lang] || []) : [];
  const allFilled = fields.every(f => formData[f.key]?.trim());
  const previewLines = contract.split("\n");
  const cutoff = Math.max(4, Math.floor(previewLines.length * 0.35));
  const visibleLines = previewLines.slice(0, cutoff);
  const hiddenLines = previewLines.slice(cutoff);

  const switchLang = (l) => {
    setLang(l);
    setActiveGroup(null);
    if (step === "type") setStep("type");
  };

  const handleGenerate = async () => {
    setLoading(true); setStep("result"); setContract(""); setDocId(null);
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: selectedType, fields: formData, lang }) });
      const data = await res.json();
      if (data.preview) { setContract(data.preview); setDocId(data.docId); }
      else setContract(t.errGen);
    } catch { setContract(t.errConn); }
    setLoading(false);
  };

  const handleCheckout = async (plan) => {
    if (!docId) return; setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan, docId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert(t.errPay); }
    setCheckoutLoading(false);
  };

  const reset = () => { setStep("home"); setSelectedType(null); setFormData({}); setContract(""); setDocId(null); setActiveGroup(null); };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'Georgia','Times New Roman',serif", color: "#e8e0d0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .fade-in { animation: fs 0.45s ease both; }
        @keyframes fs { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .card { transition: all 0.2s ease; cursor: pointer; }
        .card:hover { border-color: #c9a84c !important; transform: translateY(-2px); background: rgba(201,168,76,0.06) !important; }
        .btn-gold { background: linear-gradient(135deg,#c9a84c,#e8c96a); color: #0d1117; border: none; padding: 14px 36px; font-family: 'Playfair Display',serif; font-weight: 600; font-size: 15px; cursor: pointer; letter-spacing:.5px; transition:all .2s; }
        .btn-gold:hover { transform:translateY(-1px); box-shadow:0 8px 32px rgba(201,168,76,.4); }
        .btn-gold:disabled { opacity:.4; cursor:not-allowed; transform:none; box-shadow:none; }
        .btn-ghost { background:transparent; color:#8a7f6e; border:1px solid #2a2a2a; padding:10px 24px; font-family:'Crimson Pro',serif; cursor:pointer; transition:all .2s; }
        .btn-ghost:hover { color:#e8e0d0; border-color:#555; }
        .tab { background:transparent; color:#555; border:1px solid #1e1e1e; padding:8px 20px; font-family:'Crimson Pro',serif; font-size:14px; cursor:pointer; transition:all .2s; }
        .tab.active { color:#c9a84c; border-color:#c9a84c; background:rgba(201,168,76,0.06); }
        .lang-btn { background:transparent; border:1px solid #2a2a2a; padding:6px 14px; font-family:'Crimson Pro',serif; font-size:13px; cursor:pointer; transition:all .2s; color:#555; }
        .lang-btn.active { color:#c9a84c; border-color:#c9a84c; }
        input { width:100%; background:#161b22; border:1px solid #2a2a2a; color:#e8e0d0; padding:12px 16px; font-family:'Crimson Pro',serif; font-size:16px; outline:none; transition:border-color .2s; }
        input:focus { border-color:#c9a84c; }
        input::placeholder { color:#3a3a3a; }
        .blur-wrap { position:relative; }
        .blurred { filter:blur(5px); user-select:none; pointer-events:none; opacity:.45; }
        .paywall { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; background:rgba(13,17,23,.97); border:1px solid #c9a84c; padding:36px 40px; z-index:10; width:min(360px,90vw); }
        @keyframes spin2 { to { transform:rotate(360deg); } }
        .spin { display:inline-block; animation:spin2 2s linear infinite; }
        .feature-card { background:#0f1419; border:1px solid #1e1e1e; padding:28px 24px; transition: border-color 0.2s; }
        .feature-card:hover { border-color: rgba(201,168,76,0.3); }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={reset} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span style={{ fontSize: 22 }}>⚖️</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600 }}>Contrato<span style={{ color: "#c9a84c" }}>Já</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {step !== "home" && (
            <div style={{ display: "flex", gap: 6, marginRight: 16 }}>
              {["type","form","result"].map((s, i) => (
                <div key={s} style={{ width: 8, height: 8, borderRadius: "50%", background: ["type","form","result"].indexOf(step) >= i ? "#c9a84c" : "#2a2a2a", transition: "background .3s" }} />
              ))}
            </div>
          )}
          <button className={`lang-btn ${lang === "pt" ? "active" : ""}`} onClick={() => switchLang("pt")}>PT</button>
          <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => switchLang("en")}>EN</button>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* HOME */}
        {step === "home" && (
          <div className="fade-in">
            <div style={{ textAlign: "center", paddingTop: 80, paddingBottom: 64 }}>
              <div style={{ display: "inline-block", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.3)", padding: "6px 18px", fontSize: 12, letterSpacing: 2, color: "#c9a84c", fontFamily: "'Crimson Pro',serif", marginBottom: 32 }}>{t.poweredBy}</div>
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,60px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 24 }}>
                {t.tagline}<br /><span style={{ color: "#c9a84c" }}>{t.tagline2}</span>
              </h1>
              <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 20, color: "#8a7f6e", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.7 }}>{t.sub}</p>
              <button className="btn-gold" onClick={() => setStep("type")} style={{ fontSize: 16, padding: "16px 48px", marginBottom: 16 }}>{t.cta}</button>
              <p style={{ fontSize: 13, color: "#aaa", fontFamily: "'Crimson Pro',serif" }}>{t.price}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 64, flexWrap: "wrap" }}>
                {[["17", t.stat1], ["30s", t.stat2], ["100%", t.stat3]].map(([v, l]) => (
                  <div key={l}><div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: "#c9a84c", fontWeight: 700 }}>{v}</div><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 14, color: "#555", marginTop: 4 }}>{l}</div></div>
                ))}
              </div>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))", border: "1px solid rgba(201,168,76,0.25)", padding: "36px 40px", marginBottom: 64 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ fontSize: 36 }}>🧠</div>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 10, color: "#c9a84c" }}>{t.aiBanner}</h3>
                  <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 17, color: "#8a7f6e", lineHeight: 1.7, margin: 0 }}>{t.aiBannerText}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 64 }}>
              {[[t.f1t, t.f1d, "⚖️"], [t.f2t, t.f2d, "🔄"], [t.f3t, t.f3d, "⚡"], [t.f4t, t.f4d, "💶"]].map(([title, desc, icon]) => (
                <div key={title} className="feature-card">
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, marginBottom: 8 }}>{title}</div>
                  <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, color: "#555", lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPE SELECTION */}
        {step === "type" && (
          <div className="fade-in" style={{ paddingTop: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, marginBottom: 8 }}>{t.chooseDoc}</h2>
            <p style={{ fontFamily: "'Crimson Pro',serif", color: "#555", marginBottom: 32, fontSize: 18 }}>{t.chooseSub}</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
              {groups.map(g => (<button key={g} className={`tab ${currentGroup === g ? "active" : ""}`} onClick={() => setActiveGroup(g)}>{g}</button>))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 12 }}>
              {types.filter(ct => ct.group === currentGroup).map(ct => (
                <div key={ct.id} className="card" onClick={() => { setSelectedType(ct.id); setFormData({}); setStep("form"); }}
                  style={{ background: "#161b22", border: "1px solid #1e1e1e", padding: "22px 18px" }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{ct.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, marginBottom: 4 }}>{ct.label}</div>
                  <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 13, color: "#555" }}>{ct.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORM */}
        {step === "form" && selectedType && (
          <div className="fade-in" style={{ paddingTop: 60 }}>
            <button className="btn-ghost" onClick={() => setStep("type")} style={{ marginBottom: 32, fontSize: 14 }}>{t.back}</button>
            <div style={{ display: "inline-block", background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)", padding: "4px 14px", fontSize: 11, letterSpacing: 1.5, color: "#c9a84c", fontFamily: "'Crimson Pro',serif", marginBottom: 16 }}>{t.aiBadge}</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, marginBottom: 8 }}>
              {types.find(c => c.id === selectedType)?.icon}{" "}{types.find(c => c.id === selectedType)?.label}
            </h2>
            <p style={{ fontFamily: "'Crimson Pro',serif", color: "#555", marginBottom: 40, fontSize: 17 }}>{t.fillData}</p>
            <div style={{ display: "grid", gap: 20, marginBottom: 40 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "#8a7f6e", letterSpacing: 1.2, marginBottom: 8, textTransform: "uppercase" }}>{f.label}</label>
                  <input value={formData[f.key] || ""} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                </div>
              ))}
            </div>
            <button className="btn-gold" onClick={handleGenerate} disabled={!allFilled} style={{ width: "100%", fontSize: 16 }}>{t.generateBtn}</button>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && (
          <div className="fade-in" style={{ paddingTop: 60 }}>
            {loading ? (
              <div style={{ textAlign: "center", paddingTop: 80 }}>
                <div className="spin" style={{ fontSize: 48, marginBottom: 24, display: "block" }}>⚖️</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 12 }}>{t.generating}</h2>
                <p style={{ fontFamily: "'Crimson Pro',serif", color: "#555", fontSize: 17 }}>{t.generatingSub}</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "inline-block", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", color: "#4ade80", padding: "4px 14px", fontSize: 12, letterSpacing: 1.5, fontFamily: "'Crimson Pro',serif", marginBottom: 12 }}>{t.generated}</div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26 }}>{types.find(c => c.id === selectedType)?.label}</h2>
                </div>
                <div style={{ background: "#0f1419", border: "1px solid #1e1e1e", padding: "40px 44px" }}>
                  <pre style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, lineHeight: 1.9, color: "#d0c8b8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{visibleLines.join("\n")}</pre>
                  {hiddenLines.length > 0 && (
                    <div className="blur-wrap" style={{ marginTop: 16 }}>
                      <pre className="blurred" style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, lineHeight: 1.9, color: "#d0c8b8", whiteSpace: "pre-wrap" }}>{hiddenLines.join("\n")}</pre>
                      <div className="paywall">
                        <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
                        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 8 }}>{t.unlock}</h3>
                        <p style={{ fontFamily: "'Crimson Pro',serif", color: "#8a7f6e", fontSize: 15, marginBottom: 24, lineHeight: 1.5 }}>{t.unlockSub}</p>
                        <button className="btn-gold" onClick={() => handleCheckout("single")} disabled={checkoutLoading} style={{ width: "100%", marginBottom: 10, fontSize: 15 }}>{checkoutLoading ? t.redirecting : t.unlockBtn}</button>
                        <button className="btn-ghost" onClick={() => handleCheckout("monthly")} disabled={checkoutLoading} style={{ width: "100%", fontSize: 14 }}>{t.monthly}</button>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 20, textAlign: "center" }}>
                  <button className="btn-ghost" onClick={reset} style={{ fontSize: 14 }}>{t.newDoc}</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "24px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 13, color: "#aaa" }}>
          ContratoJá © 2026 · geral@contratoja.pt · <a href="https://instagram.com/contratoja.pt" target="_blank" style={{color:"#c9a84c", textDecoration:"none"}}>@contratoja.pt</a> · {t.footer}
        </p>
      </footer>
    </div>
  );
}
