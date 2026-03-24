import "./globals.css";

export const metadata = {
  title: "ContratoJá — Contratos Profissionais em 30 segundos",
  description: "Gera contratos juridicamente sólidos para Portugal com Inteligência Artificial. Sem advogados. Sem complicações.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Crimson+Pro:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
