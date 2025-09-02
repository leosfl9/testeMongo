import { put } from "@vercel/blob";
import { MongoClient } from "mongodb";

// cria conexao com o banco de dados através da url dele (armazenada no arquivo .env.local)
const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function POST(req) {
  try {
    // se o banco de dados nao estiver "armazenado" na variavel db, se conecta com ele. Essa é a mesma função que está na rota de images, seria ideal fazer um módulo dela em outra pasta e só importar aqui e usar, evitando repetição
    if (!db) {
      await client.connect();
      db = client.db(); // pega o banco definido na connection string
    }

    // armazena o body da requisicao e transforma em array
    const body = await req.json();
    const { file } = body;

    // faz upload para o blob 
    const blob = await put(`uploads/${Date.now()}.png`, Buffer.from(file, "base64"), {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // salvar a url da imagem no mongodb
    const result = await db.collection("images").insertOne({
      url: blob.url,
      createdAt: new Date(),
    });

    // retorna uma resposta para o frontend, com a url de cada imagem e seu id
    return new Response(
      JSON.stringify({ url: blob.url, id: result.insertedId }),
      { status: 200 }
    );
  } catch (err) {
    // se algo der errado, dá erro
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro no upload" }), { status: 500 });
  }
}
