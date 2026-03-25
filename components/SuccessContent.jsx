"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessContent() {
  const router = useRouter();
  const [contract, setContract] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const docId = params.get("docId");
    const sessionId = params.get("session_id");
    if (!docId || !sessionId) { setError("Parâmetros inválidos."); setLoading(false); return; }
    fetch(`/api/document?docId=${docId}&session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => { if (data.contract) setContract(data.contract); else setError(data.error || "Erro ao carregar."); })
      .catch(() => setError("Erro de ligação."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#0d1117", fontFamily:"Georgia,serif", color:"#e8e0d0", padding:"40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:wght@300;400;500&display=swap');
        .btn-gold{background:linear-gradient(135deg,#c9a84c,#e8c96a);color:#0d1117;border:none;padding:13px 32px;font-family:'Playfair Display',serif;font-weight:600;font-size:15px;cursor:pointer;transition:all .2s;}
        .btn-gold:hover{transform:translateY(-1px);box-shadow:0 8px 32px rgba(201,168,76,.4);}
        .btn-ghost{background:transparent;color:#8a7f6e;border:1px solid #2a2a2a;padding:11px 28px;font-family:'Crimson Pro',serif;cursor:pointer;transition:all .2s;}
        .btn-ghost:hover{color:#e8e0d0;border-color:#555;}
        @media print{.no-print{display:none!important}body{background:white;color:black}}
        @keyframes spin{to{transform:rotate(360deg)}}.spin{display:inline-block;animation:spin 2s linear infinite;}
      `}</style>
      <div style={{ maxWidth:780, margin:"0 auto" }}>
        {loading ? (
          <div style={{ textAlign:"center", paddingTop:100 }}>
            <div className="spin" style={{ fontSize:48, marginBottom:24, display:"block" }}>⚖️</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26 }}>A carregar o teu documento...</h2>
          </div>
        ) : error ? (
          <div style={{ textAlign:"center", paddingTop:100 }}>
            <div style={{ fontSize:48, marginBottom:24 }}>❌</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:16 }}>{error}</h2>
            <button className="btn-ghost" onClick={() => router.push("/")}>← Voltar ao início</button>
          </div>
        ) : (
          <>
            <div className="no-print" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:40, flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ display:"inline-block", background:"rgba(34,197,94,.1)", border:"1px solid rgba(34,197,94,.3)", color:"#4ade80", padding:"4px 14px", fontSize:12, letterSpacing:1.5, fontFamily:"'Crimson Pro',serif", marginBottom:12 }}>✓ PAGAMENTO CONFIRMADO</div>
                <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28 }}>O teu documento está pronto</h1>
              </div>
              <div className="no-print" style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button className="btn-gold" onClick={() => navigator.clipboard.writeText(contract)}>📋 Copiar</button>
                <button className="btn-gold" onClick={() => window.print()}>🖨️ Imprimir</button>
                <button className="btn-ghost" onClick={() => router.push("/")}>+ Novo</button>
              </div>
            </div>
            <div style={{ background:"#0f1419", border:"1px solid #1e1e1e", padding:"48px 52px" }}>
              <pre style={{ fontFamily:"'Crimson Pro',serif", fontSize:15, lineHeight:1.9, color:"#d0c8b8", whiteSpace:"pre-wrap", wordBreak:"break-word" }}>{contract}</pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
