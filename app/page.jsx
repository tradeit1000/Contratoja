
"use client";
import { useState, useEffect } from "react";

const CONTRACT_TYPES = [
  { id: "arrendamento", label: "Arrendamento", icon: "🏠", desc: "Habitacional ou comercial" },
  { id: "prestacao", label: "Prestação de Serviços", icon: "💼", desc: "Freelancer / consultoria" },
  { id: "nda", label: "Confidencialidade", icon: "🔒", desc: "NDA entre partes" },
  { id: "compra_venda", label: "Compra e Venda", icon: "🤝", desc: "Bens móveis ou imóveis" },
  { id: "parceria", label: "Parceria Comercial", icon: "🏢", desc: "Joint venture / colaboração" },
  { id: "trabalho", label: "Contrato de Trabalho", icon: "📋", desc: "Vínculo laboral" },
];

const FIELDS = {
  arrendamento: [
    { key: "senhorio", label: "Nome do Senhorio", placeholder: "João Silva" },
    { key: "arrendatario", label: "Nome do Arrendatário", placeholder: "Maria Santos" },
    { key: "morada", label: "Morada do Imóvel", placeholder: "Rua das Flores, 12, Lisboa" },
    { key: "renda", label: "Renda Mensal (€)", placeholder: "850" },
    { key: "duracao", label: "Duração do Contrato", placeholder: "1 ano" },
    { key: "inicio", label: "Data de Início", placeholder: "01/04/2026" },
  ],
  prestacao: [
    { key: "prestador", label: "Nome do Prestador", placeholder: "Ana Costa" },
    { key: "cliente", label: "Nome do Cliente/Empresa", placeholder: "Empresa X, Lda" },
    { key: "servico", label: "Descrição do Serviço", placeholder: "Desenvolvimento de website" },
    { key: "valor", label: "Valor Total (€)", placeholder: "2500" },
    { key: "prazo", label: "Prazo de Entrega", placeholder: "30 dias" },
    { key: "pagamento", label: "Forma de Pagamento", placeholder: "50% início, 50% entrega" },
  ],
  nda: [
    { key: "parte_a", label: "Parte A (Divulgante)", placeholder: "Empresa Alpha, SA" },
    { key: "parte_b", label: "Parte B (Receptora)", placeholder: "Empresa Beta, Lda" },
    { key: "objeto", label: "Objeto da Confidencialidade", placeholder: "Estratégia de produto e dados comerciais" },
    { key: "duracao", label: "Duração", placeholder: "2 anos" },
  ],
  compra_venda: [
    { key: "vendedor", label: "Nome do Vendedor", placeholder: "Carlos Mendes" },
    { key: "comprador", label: "Nome do Comprador", placeholder: "Sofia Rodrigues" },
    { key: "bem", label: "Descrição do Bem", placeholder: "Automóvel marca X, matrícula XX-XX-XX" },
    { key: "preco", label: "Preço de Venda (€)", placeholder: "12000" },
    { key: "pagamento", label: "Forma de Pagamento", placeholder: "Transferência bancária" },
  ],
  parceria: [
    { key: "empresa_a", label: "Empresa A", placeholder: "Alpha Solutions, Lda" },
    { key: "empresa_b", label: "Empresa B", placeholder: "Beta Group, SA" },
    { key: "objeto", label: "Objeto da Parceria", placeholder: "Desenvolvimento e comercialização de software" },
    { key: "partilha", label: "Partilha de Resultados", placeholder: "50% para cada parte" },
    { key: "duracao", label: "Duração", placeholder: "2 anos, renovável" },
  ],
  trabalho: [
    { key: "empregador", label: "Entidade Empregadora", placeholder: "Empresa Y, SA" },
    { key: "trabalhador", label: "Nome do Trabalhador", placeholder: "Rui Fernandes" },
    { key: "funcao", label: "Função / Cargo", placeholder: "Desenvolvedor Frontend" },
    { key: "salario", label: "Salário Mensal Bruto (€)", placeholder: "1800" },
    { key: "inicio", label: "Data de Início", placeholder: "01/04/2026" },
    { key: "horario", label: "Horário de Trabalho", placeholder: "40h semanais" },
  ],
};

export default function Home() {
  const [step, setStep] = useState("home");
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const [contract, setContract] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [storageKey, setStorageKey] = useState(null);

  const fields = selectedType ? FIELDS[selectedType] || [] : [];
  const allFilled = fields.every(f => formData[f.key]?.trim());

  const previewLines = contract.split("\n");
  const cutoff = Math.floor(previewLines.length * 0.38);
  const visibleLines = previewLines.slice(0, cutoff);
  const hiddenLines = previewLines.slice(cutoff);

  const handleGenerate = async () => {
    setLoading(true);
    setStep("result");
    setContract("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, fields: formData }),
      });
      const data = await res.json();
      if (data.contract) {
        setContract(data.contract);
        const key = `cj_${Date.now()}`;
        sessionStorage.setItem(key, data.contract);
        setStorageKey(key);
      } else {
        setContract("Erro ao gerar contrato. Tenta novamente.");
      }
    } catch {
      setContract("Erro de ligação. Tenta novamente.");
    }
    setLoading(false);
  };

  const handleCheckout = async (plan) => {
    if (!storageKey) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, storageKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Erro ao processar pagamento. Tenta novamente.");
    }
    setCheckoutLoading(false);
  };

  const reset = () => {
    setStep("home"); setSelectedType(null);
    setFormData({}); setContract(""); setStorageKey(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'Georgia', 'Times New Roman', serif", color: "#e8e0d0" }}>
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
        input { width:100%; background:#161b22; border:1px solid #2a2a2a; color:#e8e0d0; padding:12px 16px; font-family:'Crimson Pro',serif; font-size:16px; outline:none; transition:border-color .2s; }
        input:focus { border-color:#c9a84c; }
        input::placeholder { color:#3a3a3a; }
        .blur-wrap { position:relative; }
        .blurred { filter:blur(5px); user-select:none; pointer-events:none; opacity:.45; }
        .paywall { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); text-align:center; background:rgba(13,17,23,.97); border:1px solid #c9a84c; padding:36px 40px; z-index:10; width:min(360px,90vw); }
        @keyframes spin2 { to { transform:rotate(360deg); } }
        .spin { display:inline-block; animation:spin2 2s linear infinite; }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #1a1a1a", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={reset} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span style={{ fontSize: 22 }}>⚖️</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600 }}>
            Contrato<span style={{ color: "#c9a84c" }}>Já</span>
          </span>
        </div>
        {step !== "home" && (
          <div style={{ display: "flex", gap: 6 }}>
            {["type","form","result"].map((s, i) => (
              <div key={s} style={{ width: 8, height: 8, borderRadius: "50%", background: ["type","form","result"].indexOf(step) >= i ? "#c9a84c" : "#2a2a2a", transition: "background .3s" }} />
            ))}
          </div>
        )}
      </header>

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* HOME */}
        {step === "home" && (
          <div className="fade-in" style={{ textAlign: "center", paddingTop: 80 }}>
            <div style={{ display: "inline-block", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.3)", padding: "6px 18px", fontSize: 12, letterSpacing: 2, color: "#c9a84c", fontFamily: "'Crimson Pro',serif", marginBottom: 32 }}>
              POWERED BY INTELIGÊNCIA ARTIFICIAL
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,6vw,60px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 24 }}>
              Contratos Profissionais<br />
              <span style={{ color: "#c9a84c" }}>em 30 segundos.</span>
            </h1>
            <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 20, color: "#8a7f6e", maxWidth: 500, margin: "0 auto 48px", lineHeight: 1.7 }}>
              Gera contratos juridicamente sólidos para Portugal com IA. Sem advogados. Sem complicações.
            </p>
            <button className="btn-gold" onClick={() => setStep("type")} style={{ fontSize: 16, padding: "16px 48px", marginBottom: 16 }}>
              Criar Contrato Grátis →
            </button>
            <p style={{ fontSize: 13, color: "#aaa", fontFamily: "'Crimson Pro',serif" }}>
              1 contrato grátis · depois 2,99€/doc ou 7,99€/mês ilimitado
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 64, flexWrap: "wrap" }}>
              {[["6", "Tipos de Contrato"], ["30s", "Tempo de Geração"], ["100%", "Português Europeu"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, color: "#c9a84c", fontWeight: 700 }}>{v}</div>
                  <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 14, color: "#444", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPE SELECTION */}
        {step === "type" && (
          <div className="fade-in" style={{ paddingTop: 60 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, marginBottom: 8 }}>Que contrato precisas?</h2>
            <p style={{ fontFamily: "'Crimson Pro',serif", color: "#555", marginBottom: 40, fontSize: 18 }}>Escolhe o tipo e nós tratamos do resto.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
              {CONTRACT_TYPES.map(ct => (
                <div key={ct.id} className="card" onClick={() => { setSelectedType(ct.id); setFormData({}); setStep("form"); }}
                  style={{ background: "#161b22", border: "1px solid #1e1e1e", padding: "24px 20px" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{ct.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, marginBottom: 4 }}>{ct.label}</div>
                  <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 14, color: "#555" }}>{ct.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FORM */}
        {step === "form" && selectedType && (
          <div className="fade-in" style={{ paddingTop: 60 }}>
            <button className="btn-ghost" onClick={() => setStep("type")} style={{ marginBottom: 32, fontSize: 14 }}>← Voltar</button>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, marginBottom: 8 }}>
              {CONTRACT_TYPES.find(c => c.id === selectedType)?.icon}{" "}
              {CONTRACT_TYPES.find(c => c.id === selectedType)?.label}
            </h2>
            <p style={{ fontFamily: "'Crimson Pro',serif", color: "#555", marginBottom: 40, fontSize: 18 }}>
              Preenche os dados e a IA gera o contrato completo.
            </p>
            <div style={{ display: "grid", gap: 20, marginBottom: 40 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "#8a7f6e", letterSpacing: 1.2, marginBottom: 8, textTransform: "uppercase" }}>
                    {f.label}
                  </label>
                  <input value={formData[f.key] || ""} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                </div>
              ))}
            </div>
            <button className="btn-gold" onClick={handleGenerate} disabled={!allFilled} style={{ width: "100%", fontSize: 16 }}>
              ✨ Gerar Contrato com IA
            </button>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && (
          <div className="fade-in" style={{ paddingTop: 60 }}>
            {loading ? (
              <div style={{ textAlign: "center", paddingTop: 80 }}>
                <div className="spin" style={{ fontSize: 48, marginBottom: 24, display: "block" }}>⚖️</div>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 12 }}>A redigir o teu contrato...</h2>
                <p style={{ fontFamily: "'Crimson Pro',serif", color: "#555", fontSize: 18 }}>A IA está a construir todas as cláusulas.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ display: "inline-block", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", color: "#4ade80", padding: "4px 14px", fontSize: 12, letterSpacing: 1.5, fontFamily: "'Crimson Pro',serif", marginBottom: 12 }}>
                      ✓ CONTRATO GERADO
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28 }}>
                      {CONTRACT_TYPES.find(c => c.id === selectedType)?.label}
                    </h2>
                  </div>
                </div>

                <div style={{ background: "#0f1419", border: "1px solid #1e1e1e", padding: "40px 44px" }}>
                  <pre style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, lineHeight: 1.9, color: "#d0c8b8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {visibleLines.join("\n")}
                  </pre>

                  {hiddenLines.length > 0 && (
                    <div className="blur-wrap" style={{ marginTop: 16 }}>
                      <pre className="blurred" style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, lineHeight: 1.9, color: "#d0c8b8", whiteSpace: "pre-wrap" }}>
                        {hiddenLines.join("\n")}
                      </pre>
                      <div className="paywall">
                        <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
                        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, marginBottom: 8 }}>
                          Desbloquear Contrato Completo
                        </h3>
                        <p style={{ fontFamily: "'Crimson Pro',serif", color: "#8a7f6e", fontSize: 15, marginBottom: 24, lineHeight: 1.5 }}>
                          O teu contrato está pronto. Desbloqueia para copiar e guardar.
                        </p>
                        <button className="btn-gold" onClick={() => handleCheckout("single")} disabled={checkoutLoading}
                          style={{ width: "100%", marginBottom: 10, fontSize: 15 }}>
                          {checkoutLoading ? "A redirecionar..." : "Desbloquear — 2,99€"}
                        </button>
                        <button className="btn-ghost" onClick={() => handleCheckout("monthly")} disabled={checkoutLoading}
                          style={{ width: "100%", fontSize: 14 }}>
                          7,99€/mês · Contratos Ilimitados
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 20, textAlign: "center" }}>
                  <button className="btn-ghost" onClick={reset} style={{ fontSize: 14 }}>← Criar outro contrato</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #1a1a1a", padding: "24px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 13, color: "#aaa" }}>
          ContratoJá © 2026 · geral@contratoja.pt · Os contratos gerados são para referência. Consulta um advogado para situações complexas.
        </p>
      </footer>
    </div>
  );
}
