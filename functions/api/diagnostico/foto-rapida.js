import OpenAI from 'openai';
import { MongoClient, ObjectId } from 'mongodb';

// Cliente global para reutilizar la conexión en Cloudflare Edge
let cachedClient = null;

async function getMongoCollection(uri) {
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  const db = cachedClient.db("gokulab_platform");
  return db.collection("diagnosticos");
}

const deepseek = new OpenAI({
  apiKey: null,
  baseURL: "https://api.deepseek.com"
});

export async function onRequestPost(context) {
  try {
    const DEEPSEEK_KEY = context.env.DEEPSEEK_API_KEY;
    const MONGO_URI = context.env.MONGODB_URI;

    deepseek.apiKey = DEEPSEEK_KEY;

    const { narrativa, diagnosticoId } = await context.request.json();

    // 1. Llamada analítica a DeepSeek
    const aiResponse = await deepseek.chat.completions.create({
      model: "deepseek-v4-pro",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Eres el consultor analítico del libro 'Querer, Poder y Saber Emprender'. 
          Analiza la narrativa para extraer la 'Foto Rápida'. Devuelve un JSON estructurado.`
        },
        { role: "user", content: narrativa }
      ],
      reasoning_effort: "high"
    });

    const analisisIA = JSON.parse(aiResponse.choices[0].message.content);

    // 2. Persistencia directa en MongoDB Atlas usando el Driver Oficial
    const collection = await getMongoCollection(MONGO_URI);
    
    await collection.updateOne(
      { _id: new ObjectId(diagnosticoId) },
      {
        $set: {
          "estado_progreso": "bloque_1_completado",
          "bloque_1_foto_rapida": {
            "narrativa_usuario": narrativa,
            "analisis_ia": analisisIA
          },
          "ultima_actualizacion": new Date().toISOString()
        }
      },
      { upsert: true }
    );

    return new Response(JSON.stringify(analisisIA), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}