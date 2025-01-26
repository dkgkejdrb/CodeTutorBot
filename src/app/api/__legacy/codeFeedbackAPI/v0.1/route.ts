import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const URL: any = process.env.POST_URL; // URL은 사용하지 않는듯
const KEY: any = process.env.OPENAI_API_KEY;


export async function GET() {
    return NextResponse.json({
        hello: "world",
    });
}

export async function POST(request: Request) {
    const _content = await request.json();
    // console.log(`클라에서 넘어온것: ${_content.data}`);

    const openai = new OpenAI({
        // apiKey: KEY, // 키
        apiKey: "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"
    });

    const response = await openai.chat.completions.create({
        // model: "gpt-3.5-turbo",
        model: "gpt-4",
        messages: [
            {
                "role": "user",
                "content": _content.data // 학생이 클라에서 넘길 오류코드 + 프롬프트
            }
        ],
        // 코드 튜터 도움받기에서 사용하는 api
        temperature: 1, // 변경 전 1
        max_tokens: 520, // 변경 전 480
        top_p: 1, // 변경 전 1
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    return NextResponse.json({
        response // 응답결과는 여기에 표시
    });
}

