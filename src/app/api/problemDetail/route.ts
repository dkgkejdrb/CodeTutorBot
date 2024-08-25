import { NextResponse } from 'next/server';
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = process.env.MONGODB_URI;
const uri = "mongodb+srv://dkgkejdrb:Vkdnjf8710@cluster0.zjhaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function POST(request: Request) {
  const content = await request.json();
//   console.log(content);

  async function run() {
    try {
      await client.connect();

      const db = client.db("codeTutor");
      const collection = db.collection("problems");
      const user = await collection.findOne({ _id: new ObjectId(content._id) });
    //   console.log(user);

      return NextResponse.json({ type: 'success', ...user });
    } catch (err: any) {
      return NextResponse.json({ type: 'error', message: 'error', error: err.message }, { status: 500 });
    } finally {
      await client.close();
    }
  }


  // `await`를 사용하여 `run` 함수의 반환 값을 기다립니다.
  return await run()
}