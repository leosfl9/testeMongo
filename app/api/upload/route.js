import { put } from "@vercel/blob";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function POST(req) {
  try {
    if (!db) {
      await client.connect();
      db = client.db(); // pega o banco definido na connection string
    }

    const body = await req.json();
    const { file } = body;

    // Upload para o Blob
    const blob = await put(`uploads/${Date.now()}.png`, Buffer.from(file, "base64"), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Salvar a URL no MongoDB
    const result = await db.collection("images").insertOne({
      url: blob.url,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ url: blob.url, id: result.insertedId }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro no upload" }), { status: 500 });
  }
}
