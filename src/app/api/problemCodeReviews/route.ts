import { NextResponse } from 'next/server';
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
// const uri = "mongodb+srv://dkgkejdrb:Vkdnjf8710@cluster0.zjhaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function POST(request: Request) {
    const content = await request.json();
    // console.log(content);
    const user_id = content.user_id;
    const problem_id = content.problem_id;
    const code = content.code;
    const code_review = content.code_review;
    const submitted_at = new Date();

    async function run() {
        try {
            await client.connect();

            const db = client.db("codeTutor");
            const collection = db.collection("user_code_reviews");
            const result = await collection.insertOne(
                { 
                    user_id: user_id, 
                    problem_id: problem_id,
                    code: code,
                    code_review: code_review,
                    submitted_at: submitted_at
                }
              );

        return NextResponse.json({ type: 'success', data: result });
    } catch (err: any) {
      return NextResponse.json({ type: 'error', message: 'error', error: err.message }, { status: 500 });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  // `await`를 사용하여 `run` 함수의 반환 값을 기다립니다.
  return await run()
}