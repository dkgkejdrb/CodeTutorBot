"use client";

// import Image from "next/image";
// import styles from "./page.module.css";

import Editor from "@monaco-editor/react";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Button, Tree } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import { Input } from 'antd';
const { TextArea } = Input;

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;
const { DirectoryTree } = Tree;
const treeData: TreeDataNode[] = [
    {
        title: '자료형',
        key: '0-0',
        children: [
            {
                title: '입출력하기',
                key: '0-0-0',
                children: [
                    { title: '4번', key: '1173', isLeaf: true },
                    { title: '6번', key: '1175', isLeaf: true },
                    { title: '8번', key: '1177', isLeaf: true },
                    { title: '9번', key: '1178', isLeaf: true },
                ]
            },
            {
                title: '문자열 포매팅',
                key: '0-0-1',
                children: [
                    { title: '3번', key: '1213', isLeaf: true },
                    { title: '6번', key: '1216', isLeaf: true },

                ]
            },

        ],
    },
    {
        title: '조건문',
        key: '0-1',
        children: [
            {
                title: '산술 연산자',
                key: '0-1-0',
                children: [
                    { title: '4번', key: '1221', isLeaf: true },
                    { title: '5번', key: '1222', isLeaf: true },
                    { title: '7번', key: '1269', isLeaf: true },
                    { title: '11번', key: '1291', isLeaf: true },
                    { title: '13번', key: '1293', isLeaf: true },
                ]
            },
            {
                title: '문자열',
                key: '0-1-1',
                children: [
                    { title: '8번', key: '1332', isLeaf: true },
                ]
            },
            {
                title: '리스트',
                key: '0-1-2',
                children: [
                    { title: '2번', key: '1334', isLeaf: true },
                    { title: '3번', key: '1335', isLeaf: true },
                ]
            },
            {
                title: '복합 대입 연산자',
                key: '0-1-3',
                children: [
                    { title: '1번', key: '1376', isLeaf: true },
                ]
            },
            {
                title: '조건문',
                key: '0-1-4',
                children: [
                    { title: '1번', key: '1382', isLeaf: true },
                    { title: '4번', key: '1385', isLeaf: true },
                ]
            },
            {
                title: '튜플',
                key: '0-1-5',
                children: [
                    { title: '1번', key: '1400', isLeaf: true },
                    { title: '2번', key: '1401', isLeaf: true },
                ]
            },
        ],
    },
    {
        title: '반복문',
        key: '0-2',
        children: [
            {
                title: 'while',
                key: '0-2-0',
                children: [
                    { title: '4번', key: '1422', isLeaf: true },
                    { title: '12번', key: '1430', isLeaf: true },
                ]
            },
            {
                title: 'for',
                key: '0-2-1',
                children: [
                    { title: '1번', key: '1460', isLeaf: true },
                    { title: '2번', key: '1461', isLeaf: true },
                    { title: '3번', key: '1462', isLeaf: true },
                    { title: '6번', key: '1465', isLeaf: true },
                    { title: '7번', key: '1466', isLeaf: true },
                    { title: '8번', key: '1467', isLeaf: true },
                    { title: '11번', key: '1470', isLeaf: true },
                ]
            },
        ],
    },
    {
        title: '함수',
        key: '0-3',
        children: [
            {
                title: '둘 다 없는 함수',
                key: '0-3-0',
                children: [
                    { title: '2번', key: '1187', isLeaf: true },
                    { title: '4번', key: '1189', isLeaf: true },
                    { title: '9번', key: '1226', isLeaf: true },
                    { title: '12번', key: '1229', isLeaf: true },
                ]
            },
        ],
    },
];

export default function Home() {
    const editorRef = useRef<any>();

    // 에디터가 마운트되면 수행할 작업
    function hadleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor;
    }

    const roleSettingPrompt =
        `
        역할: 선생님
        작업: 학생이 제출한 [코드]에 대한 코드 리뷰 제공
        목적: [파이썬 문제] 해결 돕기
    `

    const reviewNecessityPredictionPrompt =
        `
    코드 리뷰가 필요한 경우, '예' 또는 '아니오'로 [RNP][/RNP]에 응답. '아니오'라면, 응답 종료.
    `

    const reviewCommentGenerationPrompt_styleTone =
        `
    초등학교 5학년이 이해할 수 있는 어휘 난이도로 리뷰.
    `

    const reviewCommentGenerationPrompt_instruction =
        `
        [코드]에서 잘못된 코드 라인의 맨 끝에 '수정 필요' 주석 추가. 주석이 추가된 [코드]를 [RC][/RC]에 응답. 코드 리뷰를 [R][/R]에 응답.
    `

    const reviewCommentGenerationPrompt_restriction =
        `
        [RC][/RC]와 [R][/R]에 코드를 직접 수정하거나 수정된 코드를 직접 제시하지 않음.
    `

    // 나중에 문제 선택 기능 추가(임시)
    const tmp_exercise =
        `
    아래 '요구 사항'을 만족하는 프로그램을 작성하여, "출력 예시"와 같이 출력되게 해봅시다.
    <요구 사항>
    1. 'New York', 'Bangkok', 'Tokyo', 'London'을 원소로 갖는 리스트 city를 선언 
    2. 리스트 asia를 빈리스트로 선언
    3. 리스트 city에 'Seoul'과 'Beijing'을 추가
    4. 인덱싱과 슬라이싱으로 리스트 asia에 아시아 도시들만 저장하여 출력
     
    [테스트]
    입력 예시: 
    없음
     
    출력 예시:
    ['Bangkok', 'Tokyo', 'Seoul', 'Beijing']
    `


    const reviewCommentGenerationPrompt_exercise =
        "\n\n[파이썬 문제]\n" + tmp_exercise + "\n[파이썬 문제]"


    // 6. 프롬프트에 예시 추가
    const reviewCommentGenerationPrompt_example =
        `[RNP]\n예\n[/RNP]\n\n[RC]\nprint(input(\"씨큐브\")) #수정 필요\n[/RC]\n\n[R]\n입력받는 부분은 잘 작성하셨어요! 저장한 값을 출력하는 print 부분이 조금 잘못되었어요.\n\n지금 print(input(\"씨큐브\"))는 '씨큐블'이라는 문자열을 입력하는 것이 아니라, input()이 '씨큐브'라는 문자열을 출력하고 사용자로부터 값 입력 받는 함수입니다.\n\n이를 '이름을 입력해주세요'라는 안내문으로 수정하면 사용자가 이름을 기입하는데 도움이 될 것 같아요!\n[/R]
    `


    const [response, setResponse] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [extractedCode, setExtractedCode] = useState<string>();
    const [extractedComment, setExtractedComment] = useState<string>();
    useEffect(() => {
        if (response) {
            const startTag_result = "[RNP]";
            const endTag_result = "[/RNP]";
            const startIndex_result = response.indexOf(startTag_result) + startTag_result.length;
            const endIndex_result = response.indexOf(endTag_result);
            const result = response.substring(startIndex_result, endIndex_result).trim();
            if (result == "예") {
                const startTag_code = "[RC]";
                const endTag_code = "[/RC]";

                const startIndex_code = response.indexOf(startTag_code) + startTag_code.length;
                const endIndex_code = response.indexOf(endTag_code);
                const extractedCode = response.substring(startIndex_code, endIndex_code).trim();
                setExtractedCode(extractedCode);


                const startTag_comment = "[R]";
                const endTag_comment = "[/R]";

                const startIndex_comment = response.indexOf(startTag_comment) + startTag_comment.length;
                const endIndex_comment = response.indexOf(endTag_comment);
                setExtractedComment(response.substring(startIndex_comment, endIndex_comment).trim());
            }
        }
    }, [loading])


    const [quiz, setQuiz] = useState<string>();
    const onSelect: DirectoryTreeProps['onSelect'] = (keys: any, info) => {
        // console.log('Trigger Select', keys, info);
        // console.log(keys[0]);
        const quizList: any = {
            1173: `print() 함수와 sep, end 옵션을 이용하여 "출력 예시"와 같이 출력해 봅시다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            '코로나 블루', 극복하기!`,
            1175: `input() 함수를 이용해서 이름을 입력하면, 출력하는 프로그램을 작성하시오.

            [테스트]
            입력 예시: 
            씨큐브
            
            출력 예시:
            씨큐브`,
            1177: `이스케이프 시퀀스를 이용하여 "출력 예시"와 같이 출력되는 프로그램을 작성하시오.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            물냉면
            
                비빔냉면`,
            1178: `다음과 같이 출력되는 프로그램을 작성하시오. 단, print() 함수는 한 개만 사용합니다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            1
            
            2
            
            3
            
            4
            
            5`,
            1213: `변수를 하나만 사용하여 "출력 예시"와 같이 카운트값이 출력되는 프로그램을 작성하시오.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            1 2 3 4 5`,
            1216: `변수 length와 포맷코드 %f를 이용하여 "출력 예시"와 같이 출력해 봅시다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            마라톤의 거리는 42.195000km
            마라톤의 거리는 42.20km`,
            1221: `어떤 과일의 무게를 그램(g)단위로 입력받은 후 kg과 톤(ton) 단위로 "출력 예시"와 같이 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            1000
            
            출력 예시:
            1000
            1.0
            0.001`,
            1222: `사각형의 가로와 세로를 mm 단위로 입력받고 "출력 예시"와 같이 넓이와 둘레를 cm 단위로 출력해 봅시다.

            [테스트]
            입력 예시: 
            100
            200
            
            출력 예시:
            200.0
            60.0`,
            1269: `세 자리 자연수를 분리하여 각 자리 수의 합을 출력하는 프로그램을 만들어 봅시다.

            [테스트]
            입력 예시: 
            123
            
            출력 예시:
            6`,
            1291: `정수를 입력하면 짝수면 0을 출력하고 홀수면 1을 출력하게 해봅시다.

            [테스트]
            입력 예시: 
            2
            3
            
            출력 예시:
            0
            1`,
            1293: `키(cm)와 몸무게(kg)을 입력하면 "출력 예시"와 같이 bmi 수치를 출력하도록 해봅시다.
            <bmi 계산식>
            bmi = 몸무게(kg) / (키(m) * 키(m))
            
            [테스트]
            입력 예시: 
            75
            183
            
            출력 예시:
            22.4`,
            1332: `아래 변수 anna에 있는 노래 가사를 문자열 내장 함수를 활용하여, "출력 설명"을 만족하며 "출력 예시"와 같이 출력되는 프로그램으로 작성해봅시다.
            anna = """ELSA?
            Do you want to build a snowman?
            Come on, let's go and play!
            I never see you anymore
            Come out the door
            It's like you've gone away
            We used to be best buddies
            And now we're not
            I wish you would tell me why!
            Do you want to build a snowman?
            It doesn't have to be a snowman
            Go away, ANNA
            Okay, bye"""
            첫째줄, 'snowman'의 갯수
            둘째줄, 'ANNNA'의 인덱스 값
            셋째줄, 'a snowman'을 'Olaf'로 변경하여, 변수 anna 전체 출력
            
            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            3
            283
            ELSA?
            Do you want to build a snowman?
            Come on, let's go and play!
            I never see you anymore
            Come out the door
            It's like you've gone away
            We used to be best buddies
            And now we're not
            I wish you would tell me why!
            Do you want to build a snowman?
            It doesn't have to be a snowman
            Go away, ANNA
            Okay, bye`,
            1334: `아래 '요구 사항'을 만족하는 프로그램을 작성하여, "출력 예시"와 같이 출력되게 해봅시다.
            <요구 사항>
            1. 'New York', 'Bangkok', 'Tokyo', 'London'을 원소로 갖는 리스트 city를 선언 
            2. 리스트 asia를 빈리스트로 선언
            3. 리스트 city에 'Seoul'과 'Beijing'을 추가
            4. 인덱싱과 슬라이싱으로 리스트 asia에 아시아 도시들만 저장하여 출력
            
            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            ['Bangkok', 'Tokyo', 'Seoul', 'Beijing']`,
            1335: `빈 리스트 subject를 선언하여 "입력 예시"와 같이 3개의 과목을 입력받아, "출력 예시"와 같이 오름차순으로 과목이 출력되게 해봅시다.

            [테스트]
            입력 예시: 
            코딩
            영어
            수학
            
            출력 예시:
            ['수학', '영어', '코딩']`,
            1376: `아래의 복합 대입 연산자를 갖는 프로그램을 작성하여 실행해봅시다.

            [테스트]
            입력 예시: 
            10
            3
            
            출력 예시:
            13
            10
            30
            10.0`,
            1382: `아래의 조건문이 참이면 '1'을 출력하고, 거짓이면 '0'이 출력되는 프로그램을 작성하여 실행해봅시다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            1
            0`,
            1385: `변수 a를 입력받아 음수인지 양수인지 "출력 예시"와 같이 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            1
            -1
            0
            
            출력 예시:
            양수
            음수
            0`,
            1400: `튜플을 활용하여 봄에 해당하는 달을 저장한 코드입니다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            ('March', 'April', 'May')
            ['March', 'April', 'May']`,
            1401: `튜플을 만들어 순서대로 1, 2, 3을 저장합니다.
            그리고 "출력 예시"와 같이 출력되는 프로그램을 작성하여 실행해봅시다.
            
            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            (1, 3, 2)`,
            1422: `반복문(while)을 이용하여 "출력 예시"와 같이 '1~10까지 자연수' 중 짝수이면 X를 출력하고, 홀수이면 O를 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            O X O X O X O X O X `,
            1430: `"출력 예시"와 같이 출력되도록 프로그램을 작성해봅시다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            1 -2 3 -4 5 -6 7 -8 9 -10 `,
            1460: `반복문(for)을 이용하여 "출력 예시"와 같이 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            0 1 2 3 4 
            1 2 3 4 5 
            1 3 5 7 9 
            5 4 3 2 1 `,
            1461: `n을 입력 받아 "출력 예시"와 같이 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            5
            
            출력 예시:
            * * * * * `,
            1462: `다섯 과목의 점수(89.5, 99.2, 88, 75.6, 66)를 갖는 리스트 score의 총합과 평균을 "출력 예시"와 같이 출력되게 해봅시다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            418.3 83.7`,
            1465: `n을 입력받아, 1~n까지 짝수를 "출력 예시"와 같이 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            6
            
            출력 예시:
            2 4 6 `,
            1466: `"출력 예시"와 같이 구구단이 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            2X1=2 2X2=4 2X3=6 2X4=8 2X5=10 2X6=12 2X7=14 2X8=16 2X9=18 
            3X1=3 3X2=6 3X3=9 3X4=12 3X5=15 3X6=18 3X7=21 3X8=24 3X9=27 
            4X1=4 4X2=8 4X3=12 4X4=16 4X5=20 4X6=24 4X7=28 4X8=32 4X9=36 
            5X1=5 5X2=10 5X3=15 5X4=20 5X5=25 5X6=30 5X7=35 5X8=40 5X9=45 
            6X1=6 6X2=12 6X3=18 6X4=24 6X5=30 6X6=36 6X7=42 6X8=48 6X9=54 
            7X1=7 7X2=14 7X3=21 7X4=28 7X5=35 7X6=42 7X7=49 7X8=56 7X9=63 
            8X1=8 8X2=16 8X3=24 8X4=32 8X5=40 8X6=48 8X7=56 8X8=64 8X9=72 
            9X1=9 9X2=18 9X3=27 9X4=36 9X5=45 9X6=54 9X7=63 9X8=72 9X9=81 `,
            1467: `n을 입력받아 "출력 예시"와 같이 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            5
            
            출력 예시:
            *
            **
            ***
            ****
            *****`,
            1470: `4개의 단어를 갖는 리스트 ['scramble, 'freindly', 'do', 'learn']에 있는 모든 요소의 글자 앞에 'un'을 붙여 "출력예시"와 같이 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            없음
            
            출력 예시:
            ['unscramble', 'unfreindly', 'undo', 'unlearn']`,
            1187: `네 수를 입력하면  합을 반환하는 함수를 정의하고 그 값을 출력하시오.

            [테스트]
            입력 예시: 
            1
            2
            3
            4
            
            출력 예시:
            10`,
            1189: `한개의 정수를 입력하면, 그 갯수만큼 별(*)이 출력되게 함수를 정의하고 호출하시오.

            [테스트]
            입력 예시: 
            5
            
            출력 예시:
            * * * * * `,
            1226: `매개변수로 월(m)과 일(d)을 전달받아 "출력 예시"와 같이 출력되도록 해봅시다.

            [테스트]
            입력 예시: 
            10
            16
            
            출력 예시:
            My Birthday is 10/16`,
            1229: `함수 sum()은 매개변수로 3개의 정수를 전달받아 총합을 반환하고,
            함수 avg()는 매개변수로 3개의 정수를 전달받아 평균을 반환하는 함수입니다.
            함수 sum()과 avg()를 각각 호출하여 출력해봅시다.
            
            [테스트]
            입력 예시: 
            10
            20
            30
            
            출력 예시:
            60
            20.0`
        }
        // 클릭하면 문제 표시
        // console.log(quizList[keys[0]])
        setQuiz(quizList[keys[0]]);

    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
        // console.log('Trigger Expand', keys, info);
    };

    return (
        <main>
            <div style={{ display: "flex" }}>
                <div className="left" style={{ width: 300 }}>
                    <DirectoryTree
                        multiple
                        defaultExpandAll
                        onSelect={onSelect}
                        onExpand={onExpand}
                        treeData={treeData}
                    />
                </div>
                <div className="middle" style={{ width: 300 }}>
                    <TextArea value={quiz} rows={20} style={{ resize: 'none' }} />
                </div>
                <div className="right">
                    {
                        loading ?
                            <Button loading>실행</Button>
                            :
                            <Button
                                onClick={() => {
                                    setLoading(true);
                                    setExtractedCode(""); // 코멘트 영역 초기화
                                    axios.post('/api', {
                                        data:
                                            roleSettingPrompt
                                            + reviewNecessityPredictionPrompt
                                            + reviewCommentGenerationPrompt_styleTone
                                            + reviewCommentGenerationPrompt_instruction
                                            + reviewCommentGenerationPrompt_restriction
                                            // + reviewCommentGenerationPrompt_exercise
                                            + "\n\n[파이썬 문제]\n" + quiz + "\n[파이썬 문제]"
                                            + "\n\n[코드]\n" + editorRef.current.getValue() + "\n[코드]" // reviewCommentGenerationPrompt_code
                                            // 프롬프트 예시 추가
                                            + reviewCommentGenerationPrompt_example
                                    })
                                        .then(response => {
                                            console.log('응답 데이터', response.data);
                                            setResponse(response.data.response.choices[0].message.content);
                                            setLoading(false);
                                        })
                                        .catch(error => {
                                            console.error('에러 발생:', error);
                                            setLoading(false);
                                        });
                                }}
                                style={{
                                    marginBottom: "16px"
                                }}
                            >실행</Button>
                    }
                    <Editor
                        width="800px"
                        height="200px"
                        language="python"
                        theme="vs-dark"
                        defaultValue="# 코드를 제출해주세요."
                        value={extractedCode}
                        onMount={hadleEditorDidMount}
                    />
                    <div
                        style={{
                            marginTop: "16px",
                            width: "800px"
                        }}>
                        {extractedComment}
                    </div>
                </div>
            </div>
        </main>
    );
}