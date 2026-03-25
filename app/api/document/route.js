import { Redis } from "@upstash/redis";
import Stripe from "stripe";

const redis = Redis.fromEnv();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const docId = searchParams.get("docId");
    const sessionId = searchParams.get("session_id");

    if (!docId || !sessionId) {
      return Response.json({ error: "Parâmetros inválidos." }, { status: 400 });
    }

    // Verify payment was actually completed
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return Response.json({ error: "Pagamento não confirmado." }, { status: 402 });
    }

    // Retrieve full document from Redis
    const contract = await redis.get(docId);
    if (!contract) {
      return Response.json({ error: "Documento expirado. Por favor gera um novo." }, { status: 404 });
    }

    // Delete from Redis after retrieval (one-time use)
    await redis.del(docId);

    return Response.json({ contract });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erro ao recuperar documento." }, { status: 500 });
  }
}
