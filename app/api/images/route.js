import { MongoClient } from "mongodb";

// cria conexao com o banco de dados através da url dele (armazenada no arquivo .env.local)
const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function GET() {
  try {
    // se o banco de dados nao estiver "armazenado" na variavel db, se conecta com ele
    if (!db) {
      await client.connect();
      db = client.db();
    }

    // armazena as imagens encontradas no banco em um array
    const images = await db.collection("images").find({}).toArray();

    // retorna as imagens em json
    return new Response(JSON.stringify(images), { status: 200 });
  } catch (err) {
    // retorna erro se der errado
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro ao buscar imagens" }), { status: 500 });
  }
}
