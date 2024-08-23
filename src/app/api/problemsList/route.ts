import { NextResponse } from 'next/server';
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    // 나중에 JWT Token에서 ID를 추출하는 코드가 들어올 것

    // 페이지 번호와 페이지당 항목 수를 받아옴
    const page = content.page || 1;  // 클라이언트가 페이지 번호를 전달하지 않으면 기본값으로 1을 사용
    const pageSize = content.pageSize || 1;  // 페이지당 항목 수를 정의

    const skip = (page - 1) * pageSize;  // 건너뛸 문서 수를 계산
    const limit = pageSize;  // 반환할 문서 수를 설정

    async function run() {
        try {
            await client.connect();

            const db = client.db("codeTutor");
            const collection = db.collection("problems");
            const problems = await collection.aggregate([
                {
                    $project: {
                        title: 1,
                        difficulty: 1,
                        isCorrect: "NaN", // 나중에 구현
                        totalSubmissions: "NaN", // 나중에 구현
                        accuracyRate: "NaN" // 나중에 구현
                    }
                },
                { $skip: skip },   // 특정 수만큼의 문서를 건너뜁니다.
                { $limit: limit }  // 페이지 크기만큼의 문서만 반환합니다.
            ]).toArray();

    return NextResponse.json({ type: 'error', data: problems });
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