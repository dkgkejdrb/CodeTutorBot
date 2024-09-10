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
    scriptPath: './src/app/scripts/',
    pythonOptions: ['-u'],
    args: ['value1', 'value2']
}

export async function POST(request: Request) {

    const scriptPath = path.join(options.scriptPath, 'test.py');
    const newContent = await request.json();

    // Step 1: Modify the content of test.py
    fs.writeFileSync(scriptPath, newContent.code, 'utf8');

    return new Promise((resolve, reject) => {
        let shell = new PythonShell('test.py', options);
        // shell.send(2);

        shell.on('message', function (messages) {
            resolve(NextResponse.json({ type: 'success', messages: messages }));
        });


        shell.end(function (err, code, signal) {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
            console.log('finished');
        });
    });
}
