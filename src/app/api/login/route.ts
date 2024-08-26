import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
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

// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_SECRET_KEY = "Vkdnjf8710";

  export async function POST(request: Request) {
    const content = await request.json();
    console.log(content)
  
    async function run() {
      try {
        await client.connect();
  
        const db = client.db("codeTutor");
        const collection = db.collection("users");
  
        // content.id와 content.password_1이 coolection에 있는 id와 
        const user = await collection.findOne({ user_id: content.id });

        if (!user) {
          return NextResponse.json({ type: 'error', message: '아이디에 해당하는 유저가 없습니다.' });
        }

        // 비밀번호 비교
        const isMatch = await content.password_1 === user.password_1;
        if (!isMatch) {
          return NextResponse.json({ type: 'error', message: '비밀번호가 틀렸습니다.' });
        }

        // 토큰에는 유저 정보(id) 등이 보관
        const token = jwt.sign(
          { id: user.id },
          JWT_SECRET_KEY,
          { expiresIn: '1h' }
        );

        // 성공 시, 토큰과 user.id 반환
        return NextResponse.json({ type: 'success', message: '로그인 성공', id: user.id, token });
      } catch (err: any) {
        return NextResponse.json({ type: 'error', message: 'error', error: err.message }, { status: 500 });
      } finally {

        await client.close();
      }
    }
  
  
    // `await`를 사용하여 `run` 함수의 반환 값을 기다립니다.
    return await run()
    
    

    // async function run() {
    //   try {
    //     await client.connect();
  
    //     const db = client.db("user");
    //     const collection = db.collection("users");
  
    //     // data.id로 collection에서 해당 id가 있는지 확인
    //     // console.log({ id: _content.id })
    //     const existingUser = await collection.findOne({ id: content.id });
    //     // console.log(existingUser);
    //     if (existingUser) {
    //       return NextResponse.json({ type: 'error', message: '이미 등록된 아이디입니다. 다른 아이디를 입력해주세요.' });
    //     }
    //     const result = await collection.insertOne({ ...content, createdDate: createdDate })
    //     // console.log("저장 완료", result);
  
    //     return NextResponse.json({ type: 'success', message: '환영합니다! 회원가입에 성공하셨습니다. 로그인 창으로 이동합니다.', modalOpen: true, result });
    //   } catch (err: any) {
    //     return NextResponse.json({ type: 'error', message: 'error', error: err.message }, { status: 500 });
    //   } finally {
    //     // Ensures that the client will close when you finish/error
    //     await client.close();
    //   }
    // }
  
  
    // // `await`를 사용하여 `run` 함수의 반환 값을 기다립니다.
    // return await run()
  }