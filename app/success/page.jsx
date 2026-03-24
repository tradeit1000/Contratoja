"use client";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function SuccessPage() {
  const [contract, setContract] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("key");
    if (key) {
      const saved = sessionStorage.getItem(key);
      if (saved) setContract(saved);
    }
    setReady(true);
  }, []);

  if (!ready) return <div style={{ background: "#0d1117", minHeight: "100vh" }} />;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "Georgia, serif", color: "#e8e0d0", padding: "40px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ color: "#4ade80", marginBottom: 12, fontSize: 13 }}>✓ PAGAMENTO CONFIRMADO</div>
            <h1 style={{ fontSize: 28 }}>O teu contrato está pronto</h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => navigator.clipboard.writeText(contract)} style={{ background: "linear-gradient(135deg,#c9a84c,#e8c96a)", color: "#0d1117", border: "none", padding: "13px 32px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>📋 Copiar</button>
            <button onClick={() => window.print()} style={{ background: "linear-gradient(135deg,#c9a84c,#e8c96a)", color: "#0d1117", border: "none", padding: "13px 32px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>🖨️ Imprimir</button>
            <button onClick={() => window.location.href = "/"} style={{ background: "transparent", color: "#8a7f6e", border: "1px solid #2a2a2a", padding: "11px 28px", cursor: "pointer" }}>+ Novo</button>
          </div>
        </div>
        <div style={{ background: "#0f1419", border: "1px solid #1e1e1e", padding: "48px 52px" }}>
          <pre style={{ fontFamily: "Georgia, serif", fontSize: 15, lineHeight: 1.9, color: "#d0c8b8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {contract || "A carregar contrato..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
