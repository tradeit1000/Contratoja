"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SuccessPage() {
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

  const handleCopy = () => navigator.clipboard.writeText(contract);
  const handlePrint = () => window.print();

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'Georgia', serif", color: "#e8e0d0", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:wght@300;400;500&display=swap');
        @media print { .no-print { display: none !important; } body { background: white; color: black; } }
        .btn-gold { background: linear-gradient(135deg, #c9a84c, #e8c96a); color: #0d1117; border: none; padding: 13px 32px; font-family: 'Playfair Display', serif; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.2s; }
        .btn-ghost { background: transparent; color: #8a7f6e; border: 1px solid #2a2a2a; padding: 11px 28px; font-family: 'Crimson Pro', serif; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { color: #e8e0d0; border-color: #555; }
      `}</style>

      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", padding: "4px 14px", fontSize: 12, letterSpacing: 1.5, fontFamily: "'Crimson Pro', serif", marginBottom: 12 }}>
              ✓ PAGAMENTO CONFIRMADO
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>O teu contrato está pronto</h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-gold" onClick={handleCopy}>📋 Copiar</button>
            <button className="btn-gold" onClick={handlePrint}>🖨️ Imprimir</button>
            <button className="btn-ghost" onClick={() => router.push("/")}>+ Novo</button>
          </div>
        </div>

        <div style={{ background: "#0f1419", border: "1px solid #1e1e1e", padding: "48px 52px" }}>
          <pre style={{ fontFamily: "'Crimson Pro', serif", fontSize: 15, lineHeight: 1.9, color: "#d0c8b8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {contract || "A carregar contrato..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
