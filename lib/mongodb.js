import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function saveBlogText(url, text) {
  try {
    await client.connect();
    const db = client.db('blog_summariser');
    const collection = db.collection('blogs');
    
    await collection.insertOne({ url, text, created_at: new Date() });
  } catch (error) {
    throw new Error(`MongoDB save failed: ${error.message}`);
  } finally {
    await client.close();
  }
}