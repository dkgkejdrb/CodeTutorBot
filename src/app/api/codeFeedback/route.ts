import { NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
    const content = await request.json();
    // console.log("------------------")
    // console.log(content);
    // console.log("------------------")

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
            ["system", "You are a code reviewer who evaluates whether a review is necessary."],
            ["user",
                // `
                // Before reviewing the [SubmittedCode], determine whether it is meaningful.
                // Based on the [PythonProblem], [SubmittedCode] and [Solution], respond with 'yes' if a code review is needed or 'no' if not.
                // PythonProblem: {pythonProblem}
                // Submitted Code: {submittedCode}
                // Solution: {solution}
                // `
                `
                Before reviewing the [SubmittedCode], determine whether a review is necessary.
                
                - Respond 'yes' if the [SubmittedCode] contains mistakes or improvements are needed.
                - Respond 'no_correct' if the [SubmittedCode] is already correct and matches the [Solution], meaning no review is needed.
                - Respond 'no_meaningless' if the [SubmittedCode] is too simple (e.g., 'print()', single numbers, random characters) and does not attempt to solve the [PythonProblem], meaning no review is needed.
        
                Respond with only one of the three options: 'yes', 'no_correct', or 'no_meaningless'.
        
                PythonProblem: {pythonProblem}
                Submitted Code: {submittedCode}
                Solution: {solution}
                `
            ]
        ]);

        // RNP 체인 생성, outputparser 응답 결과만 추출
        const RNP_chain = RNP_Prompt.pipe(RNP_Model).pipe(new StringOutputParser());

        // RNP 체인 invoke
        const RNP_response = await RNP_chain.invoke({
            pythonProblem: content.pythonProblem,
            submittedCode: content.code,
            solution: content.solution
        })
        // console.log(RNP_response);

        // RNP 응답 결과에 따라 RCGP 체인 실행
        if (RNP_response == "no_meaningless" || RNP_response == "No_meaningless"
            || RNP_response == "no_correct" || RNP_response == "No_correct"
        ) return NextResponse.json({ message: RNP_response, secrets: process.env.OPENAI_API_KEY });
        else if (RNP_response == "Yes" || RNP_response == "yes") {

            // RCGP 모델 셋팅
            const RCGP_Model = new ChatOpenAI({
                openAIApiKey: KEY,
                model: "gpt-4o",
                temperature: 0.2, // 변경 전 1
                maxTokens: 320, // 변경 전 480
                topP: 0.8, // 변경 전 1
                frequencyPenalty: 0,
                presencePenalty: 0
            });

            const RCGP_styleTone = `Review with vocabulary difficulty level that primary and secondary school students can understand.`;
            const RCGP_instruction =
            `
            As in the example shown in [Example], [RC][/RC] and [R][/R] must be included in the response. 
            In [SubmittedCode], add ‘Code to fix’ comment to the end of incorrect code lines.
            Reply to [RC][/RC] with commented [SubmittedCode] as is.
            Respond to code reviews with [R][/R] in a ‘polite tone’ and within three sentences and emoji.
            `
            const RCGP_restriction = `
            Must never present the fixed code and [Solution] to [RC][/RC] and [R][/R].
            Do not include code fences such as \`\`\`python or any similar syntax in your response.
            `;
            const RCGP_example =
            `
            [RC]
            length = 42.195
            print("Marathon’s distence %.fkm" %length) # Code to fix
            print("Marathon’s distance is %.2fkm" %length)
            [/RC]

            [R]
            There is a typo in the print function in the first line. The correct expression is ‘distance’ instead of ‘distence’. Check for typos with a little more attention!
            [/R]
            `

            // RCGP 프롬프트
            const RCGP_Prompt = ChatPromptTemplate.fromMessages([
                ["system", "You are a teacher who provides a code review submitted by students"],
                ["user",
                    RCGP_styleTone + RCGP_instruction + RCGP_restriction +
                    `
                    PythonProblem: {pythonProblem}
                    SubmittedCode: {submittedCode}
                    Solution: {solution}
                    Example: {example}
                    `
                ]
            ])
            // console.log(RCGP_Prompt);
            //console.log(RCGP_Prompt.promptMessages);

            // RCGP 체인 생성
            const RCGP_chain = RCGP_Prompt.pipe(RCGP_Model).pipe(new StringOutputParser());
            // console.log(RCGP_chain);

            // RCGP 체인 invoke
            const RCGP_response = await RCGP_chain.invoke({
                // ★ submittedCode, Solution 나중에 변경해야 함
                pythonProblem: content.pythonProblem,
                submittedCode: content.code,
                solution: content.solution,
                example: RCGP_example
            })
            // console.log(RCGP_response);

            return NextResponse.json({ message: RCGP_response });
        }
    }
    catch {
        return NextResponse.json({ error: "Failed to evaluate necessity", secrets: process.env.OPENAI_API_KEY });
    }
}