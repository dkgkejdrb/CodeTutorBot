import { NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const KEY = process.env.OPENAI_API_KEY;

// problem_description: 'Write a program that takes height (cm) and weight (kg) as input and outputs the BMI value as shown in the "Output Example."\n' +        
// '\n' +
// '<BMI formula> bmi = weight (kg) / (height (m) * height (m))',
// stdin: [ '75\n183' ],
// expected_output: [ '22.4' ],
// source_code: 'w=int(input())\r\nh=int(input())\r\nh=h*0.01\r\nprint("%.1f" %(w/(h*h)))'

export async function POST(request: Request) {

    const content = await request.json();
    // console.log(content);

    try {
        // RNP 모델 셋팅
        const RNP_Model = new ChatOpenAI({
            openAIApiKey: KEY,
            // model: "gpt-4o-mini",
            model: "gpt-4o",
            temperature: 0.2, // 변경 전 1
            maxTokens: 50, // 변경 전 520
            topP: 0.1, // 변경 전 1
            frequencyPenalty: 0,
            presencePenalty: 0,
        });

        // RNP 프롬프트 생성
        const RNP_Prompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a answer checker"],
            ["user",
                `
                Task: The [Submitted Code] submitted by the student for the [Python Problem] has passed all test cases.
                However, test cases alone are not sufficient for a rigorous validation of the correct code.
                If the [Submitted Code] meets any of the following four criteria, respond only with the corresponding items.

                1. Unnecessary Code: Code that is not essential for solving the problem has been added 
                2. Requirement not met: When the submitted code ignores a specified requirement and is solved differently 
                3. Hard Coding: When the result is coded hard using the input/output example as is without proper logic 
                4. Computation Error: Calculation errors caused by complex logic 
                
                Python Problem: {pythonProblem}
                Submitted Code: {submittedCode}
                Solution: {solution}
                `
            ]
        ]);

        // RNP 체인 생성, outputparser 응답 결과만 추출
        const RNP_chain = RNP_Prompt.pipe(RNP_Model).pipe(new StringOutputParser());

        // console.log(RNP_chain);

        // RNP 체인 invoke
        const RNP_response = await RNP_chain.invoke({
            pythonProblem: content.pythonProblem + content.stdin + content.expected_output,
            submittedCode: content.source_code,
            solution: content.solution
        })

        console.log(RNP_response);

        return NextResponse.json({ message: "" })
    }
    catch {
        return NextResponse.json({ error: "Failed to evaluate necessity" });
    }
}