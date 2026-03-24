# ⚖️ ContratoJá

Gerador de contratos profissionais em português europeu, powered by IA (Anthropic Claude).

## Stack
- **Next.js 14** (App Router)
- **Anthropic SDK** — geração de contratos
- **Stripe** — pagamentos (2,99€ por doc / 7,99€/mês)
- **Vercel** — deploy grátis

---

## 🚀 Deploy em 4 passos

### 1. Clona e instala
```bash
git clone https://github.com/SEU_USER/contratoja.git
cd contratoja
npm install
```

### 2. Configura as variáveis de ambiente
```bash
cp .env.example .env.local
# Edita .env.local com as tuas chaves
```

### 3. Testa localmente
```bash
npm run dev
# Abre http://localhost:3000
```

### 4. Deploy no Vercel
1. Push para GitHub
2. Vai a vercel.com → New Project → importa o repo
3. Adiciona as variáveis de ambiente no painel do Vercel
4. Clica Deploy ✅

---

## 💡 Onde obter as chaves

| Variável | Onde obter |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API Keys |
| `STRIPE_MONTHLY_PRICE_ID` | Stripe → Products → cria produto 7,99€/mês → copia o Price ID |

---

## 📁 Estrutura

```
contratoja/
├── app/
│   ├── page.jsx              # UI principal
│   ├── success/page.jsx      # Página pós-pagamento
│   ├── api/
│   │   ├── generate/route.js # Chama Anthropic API
│   │   └── checkout/route.js # Cria sessão Stripe
│   └── globals.css
├── .env.example
└── package.json
```

---

## 💰 Modelo de negócio

- **Freemium**: gera e mostra preview do contrato grátis
- **Paywall**: desbloqueia o documento completo por 2,99€
- **Subscripção**: 7,99€/mês para contratos ilimitados
- **Custo por geração**: ~0,01€ (API Anthropic)
- **Margem**: ~99%
