import { PythonShell } from 'python-shell';
// let pyshell = new PythonShell('@/pyshell/my_script.py');

import { NextResponse } from 'next/server';
const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = process.env.MONGODB_URI;
const uri = "mongodb+srv://dkgkejdrb:Vkdnjf8710@cluster0.zjhaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

interface messages {
    traceback: string,
    executable: string,
    script: string,
    args: null,
    exitCode: number,
    logs: []
}

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

    // run some simple code
    PythonShell.runString('x=1;printc(x)').then((messages: any) => {
        // script finished
        console.log(messages.traceback);
    });

    // async function run() {
    //     try {

    //         return NextResponse.json({ type: 'success', message: '환영합니다! 회원가입에 성공하셨습니다. 로그인 창으로 이동합니다.', modalOpen: true, result });
    //     } catch (err: any) {
    //         return NextResponse.json({ type: 'error', message: 'error', error: err.message }, { status: 500 });
    //     } finally {
    //         // Ensures that the client will close when you finish/error
    //         await client.close();
    //     }
    // }


    // // `await`를 사용하여 `run` 함수의 반환 값을 기다립니다.
    // return await run()
}