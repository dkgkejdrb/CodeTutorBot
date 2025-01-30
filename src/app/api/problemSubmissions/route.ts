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
    const is_correct = content.is_correct;
    const submitted_at = new Date();

    async function run() {
        try {
            await client.connect();

            const db = client.db("codeTutor");
            const collection = db.collection("user_problems");
            const result = await collection.updateOne(
                { user_id: user_id, problem_id: problem_id },
                {
                  $set: {
                    code: code,
                    is_correct: is_correct,
                    submitted_at: submitted_at
                  }
                },
                { upsert: true }
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

export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const user_id = searchParams.get("user_id");
      const problem_id = searchParams.get("problem_id");

      if (!user_id || !problem_id) {
          return NextResponse.json({ type: 'error', message: 'Missing user_id or problem_id' }, { status: 400 });
      }

      await client.connect();

      const db = client.db("codeTutor");
      const collection = db.collection("user_problems");

      const result = await collection.findOne({ user_id: user_id, problem_id: problem_id });

      if (!result) {
          return NextResponse.json({ type: 'error', message: 'Document not found' }, { status: 404 });
      }

      return NextResponse.json({ type: 'success', data: result });

  } catch (err: any) {
      return NextResponse.json({ type: 'error', message: 'Database query failed', error: err.message }, { status: 500 });
  } finally {
      await client.close();
  }
}