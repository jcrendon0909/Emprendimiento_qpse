import { MongoClient } from 'mongodb';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    if (!env.MONGODB_URI) {
      throw new Error('Falta la variable de entorno MONGODB_URI');
    }

    const client = new MongoClient(env.MONGODB_URI);
    await client.connect();

    const db = client.db('qpse_db');
    const collection = db.collection('registros');

    const resultado = await collection.insertOne(body);
    await client.close();

    return new Response(
      JSON.stringify({ success: true, id: resultado.insertedId }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}