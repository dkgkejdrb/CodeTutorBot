import { PythonShell } from 'python-shell';
import { NextResponse } from 'next/server';
import { Options } from 'python-shell';
import fs from 'fs';
import path from 'path';
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://dkgkejdrb:Vkdnjf8710@cluster0.zjhaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const options: Options = {
    mode: 'text',
    scriptPath: './src/app/scripts/',
    pythonOptions: ['-u'],
    args: [
        'TCInput1-1', 'TCInput1-2', 'TCInput1-3', 
        'TCInput2-1', 'TCInput2-2', 'TCInput2-3', 
        'TCInput3-1', 'TCInput3-2', 'TCInput3-3', 
        'TCInput4-1', 'TCInput4-2', 'TCInput4-3', 
    ]
}

// 할 것1: 다음에 할 것, 각 테스트케이스에 대한 실행결과 확인
// 할 것2: 무한루프 제한, 특정 시간 이상은 실행되지 않게
export async function POST(request: Request): Promise<Response> {
    const scriptPath = path.join(options.scriptPath!, 'test.py'); // '!'를 사용하여 undefined가 아님을 단언
    const newContent = await request.json();
    const TCInput = newContent.tc_input;

    // Step 1: Modify the content of test.py
    fs.writeFileSync(scriptPath, newContent.code, 'utf8');


    return new Promise((resolve, reject) => {
        let shell = new PythonShell('test.py', options);
        let messagesArray:string[] = [];
        // TCInput1-1~3만 넣어보기
        shell.send(TCInput[0][0]);
        shell.send(TCInput[0][1]);
        shell.send(TCInput[0][2]);

        // Store all messages
        shell.on('message', message => {
            messagesArray.push(message);
        });

        shell.on('pythonError', error => {
            resolve(NextResponse.json({ type: 'syntaxError', messages: error.traceback }));
        });

        shell.end((err) => {
            if (err) {
                reject(NextResponse.json({ type: 'error', messages: err }));
            } else {
                resolve(NextResponse.json({ type: 'success', messages: messagesArray }));
            }
        });
    });
}