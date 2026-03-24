"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [contract, setContract] = useState("");

  useEffect(() => {
    const key = params.get("key");
    if (key) {
      const saved = sessionStorage.getItem(key);
      if (saved) setContract(saved);
    }
  }, [params]);

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "Georgia, serif", color: "#e8e0d0", padding: "40px 24px" }}>
      <style>{`
        .btn-gold { background: linear-gradient(135deg, #c9a84c, #e8c96a); color: #0d1117; border: none; padding: 13px 32px; font-weight: 600; font-size: 15px; cursor: pointer; }
        .btn-ghost { background: transparent; color: #8a7f6e; border: 1px solid #2a2a2a; padding: 11px 28px; cursor: pointer; }
        .btn-ghost:hover { color: #e8e0d0; }
        @media print { .no-print { display: none !important; } }
      `}</style>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ color: "#4ade80", marginBottom: 12, fontSize: 13 }}>✓ PAGAMENTO CONFIRMADO</div>
            <h1 style={{ fontSize: 28 }}>O teu contrato está pronto</h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-gold" onClick={() => navigator.clipboard.writeText(contract)}>📋 Copiar</button>
            <button className="btn-gold" onClick={() => window.print()}>🖨️ Imprimir</button>
            <button className="btn-ghost" onClick={() => router.push("/")}>+ Novo</button>
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
