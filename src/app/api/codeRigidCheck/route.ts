import { NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const KEY = process.env.OPENAI_API_KEY;

const SCP_instruction = `
Analyze the [SubmittedCode] provided by the student for the [PythonProblem]. 
Although it passed all test cases, ensure rigorous validation beyond the test cases. 
If the [SubmittedCode] matches any of the following criteria, respond only with the corresponding criteria items' name.
If not, respond with "No issues found".
`
const SCP_criteria = `
Unnecessary Code: Code contains elements not essential for solving the problem.

Requirement not met: The solution ignores a specified requirement and solves the problem differently. 

Hard Coding: The solution uses hard-coded input/output examples instead of general logic. 

Computation Error: Errors occur due to overly complex or incorrect logic. 
`

export async function POST(request: Request) {

    const content = await request.json();
    // console.log(content);

    try {
        // RNP 모델 셋팅
        const SCP_Model = new ChatOpenAI({
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
        const SCP_Prompt = ChatPromptTemplate.fromMessages([
            // ["system", "You are a answer checker"],
            ["system", "You are a teacher who provides a code review submitted by students"],
            ["user",
                SCP_instruction + SCP_criteria +
                `
                PythonProblem: {pythonProblem}
                SubmittedCode: {submittedCode}
                Solution: {solution}
                `
            ]
        ]);
        // console.log(RNP_Prompt.promptMessages);

        // RNP 체인 생성, outputparser 응답 결과만 추출
        const RNP_chain = SCP_Prompt.pipe(SCP_Model).pipe(new StringOutputParser());

        // console.log(RNP_chain);

        // RNP 체인 invoke
        const RNP_response = await RNP_chain.invoke({
            pythonProblem: content.pythonProblem + content.stdin + content.expected_output,
            submittedCode: content.source_code,
            solution: content.solution
        })

        // console.log(RNP_response);

        return NextResponse.json({ message: RNP_response });
    }
    catch {
        return NextResponse.json({ error: "Failed to evaluate necessity" });
    }
}