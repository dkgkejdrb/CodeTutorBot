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

    try {
        const messages = await PythonShell.runString(content.code);
        return NextResponse.json({ type: 'success', messages });
    } catch (err: any) {
        return NextResponse.json({ type: 'error', messages: 'Python script execution failed', error: err.message });
    }
}