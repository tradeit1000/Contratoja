import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { plan, docId } = await req.json();
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const isSubscription = plan === "monthly";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: isSubscription ? "subscription" : "payment",
      locale: "pt",
      line_items: [
        isSubscription
          ? { price: process.env.STRIPE_MONTHLY_PRICE_ID, quantity: 1 }
          : { price_data: { currency: "eur", product_data: { name: "ContratoJá — Documento Único" }, unit_amount: 299 }, quantity: 1 }
      ],
      // Pass docId in metadata so we can retrieve it after payment
      metadata: { docId: docId || "" },
      success_url: `${origin}/success?docId=${docId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=true`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erro ao criar sessão de pagamento." }, { status: 500 });
  }
}
