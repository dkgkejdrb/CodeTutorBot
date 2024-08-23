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
  const createdDate = new Date();
  // console.log(_content)

  // console.log(uri);

  async function run() {
    try {
      await client.connect();

      const db = client.db("codeTutor");
      const collection = db.collection("users");

      // data.id로 collection에서 해당 id가 있는지 확인
      // console.log({ id: _content.id })
      const existingUser = await collection.findOne({ user_id: content.user_id });
      // console.log(existingUser);
      if (existingUser) {
        return NextResponse.json({ type: 'error', message: '이미 등록된 아이디입니다. 다른 아이디를 입력해주세요.' });
      }
      const result = await collection.insertOne({ ...content, createdDate: createdDate })
      // console.log("저장 완료", result);

      return NextResponse.json({ type: 'success', message: '환영합니다! 회원가입에 성공하셨습니다. 로그인 창으로 이동합니다.', modalOpen: true, result });
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