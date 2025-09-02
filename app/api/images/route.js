import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function GET() {
  try {
    if (!db) {
      await client.connect();
      db = client.db();
    }

    const images = await db.collection("images").find({}).toArray();

    // commit
    return new Response(JSON.stringify(images), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao buscar imagens" }), { status: 500 });
  }
}
