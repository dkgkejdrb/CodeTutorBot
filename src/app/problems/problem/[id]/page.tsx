/*
TO-DO: ★ 나중에 정답, 오답 모달 기능 구현 해야함
*/

'use client'

import Editor from "@monaco-editor/react";
import './page.css';
import Breadcrumb from './Breadcrumb';
import { ItemType } from '@/app/components/Breadcrumb';
import { useRef, useEffect, useState, createContext } from 'react';
import axios from "axios";
import { RobotOutlined } from '@ant-design/icons';
import { Button, Input, Modal } from "antd";

const { TextArea } = Input;

type Props = {
    params: {
        id: string;
    }
}

const items: ItemType[] = [
    {
        href: '/',
        title: (<>
            홈
        </>)
    },
    {
        href: '/problems',
        title: (<>
            전체 문제
        </>),
    }
]

interface problemDetailType {
    title: string;
    description: string;
    stdin: string[];
    stdout: string[];
    cpu_time_limit: number;
    memory_limit: number;
    solution: string;
    hint: string;
    difficulty: string;
}

export default function Home({ params }: Props) {
    // Submit Code 용 로딩
    const [loading1, setLoading1] = useState(false);

    // Code Tutor 용 로딩
    const [loading2, setLoading2] = useState(false);

    const [problemDetail, setProblemDetail] = useState<problemDetailType>();
    useEffect(() => {
        setLoading1(true);
        axios.post('/api/problemDetail', { _id: params.id })
            // 로그인 성공
            .then(response => {
                // console.log(response.data);
                setLoading1(false);

                setProblemDetail(response.data);
                // console.log('응답 데이터', response.data);
            })
            .catch(error => {
                setLoading1(false);
                // console.error('에러 발생:', error);
            });
    }, [])


    // 코드 피드백이 필요 없는 경우 출력하는 메시지들
    const cheeringMessages: string[] = [
        "Great job! Your code is clean and accurate. Well done! 🎉👍",
        "Excellent work! You’ve clearly improved a lot. 🌟👏",
        "Impressive! Your logic is clear and easy to follow. 💡✨",
        "You solved it perfectly! Keep up the good work! 💪🎯",
        "Fantastic effort! Your dedication really shows. 🌈🙌",
        "Perfect solution! You’re doing amazing! 🏆🎊"
    ]
    const [RCGP_response, RCGPT_setResponse] = useState<any>();
    const [extractedComment, setExtractedComment] = useState<string>();
    useEffect(() => {
        if (RCGP_response) {
            // 코드 피드백이 필요 없는 경우
            if (RCGP_response == "no") {
                const randomIndex = Math.floor(Math.random() * cheeringMessages.length);
                setExtractedComment(cheeringMessages[randomIndex]);
                return
            }
            const startTag_code = "[RC]";
            const endTag_code = "[/RC]";

            const startIndex_code = RCGP_response.indexOf(startTag_code) + startTag_code.length;
            const endIndex_code = RCGP_response.indexOf(endTag_code);
            const extractedCode = RCGP_response.substring(startIndex_code, endIndex_code).trim();
            setCode(extractedCode);


            const startTag_comment = "[R]";
            const endTag_comment = "[/R]";

            const startIndex_comment = RCGP_response.indexOf(startTag_comment) + startTag_comment.length;
            const endIndex_comment = RCGP_response.indexOf(endTag_comment);
            setExtractedComment(RCGP_response.substring(startIndex_comment, endIndex_comment).trim());
        }
    }, [loading2])



    // 학생이 제출한 코드 유효성 검사
    function codeValidation(code: string) {
        // 주석과 공백을 제거한 뒤 남은 코드가 있는지 확인
        const cleanedCode = code
            .split('\n') // 줄 단위로 분리
            .filter(line => {
                const trimmedLine = line.trim();
                // 라인에서 주석이나 공백이 아닌 내용이 있는지 확인
                return trimmedLine && !trimmedLine.startsWith('#');
            })
            .join('');

        // 남은 내용이 없다면 코드가 비어있거나 동작하지 않는 것으로 간주
        return cleanedCode.length === 0;
    }


    const [code, setCode] = useState<string | undefined>("");

    // 정답 결과
    const [answerCheckData, setAnswerCheckData] = useState<string>("# Execution results will be displayed here.");
    // 정답 결과 모달 팝업
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>();

    const codeAnswerCheck = () => {
        setLoading1(true);
        axios.post('/api/codeExecution', {
            source_code: code,
            stdin: problemDetail?.stdin,
            expected_output: problemDetail?.stdout,
            cpu_time_limit: problemDetail?.cpu_time_limit,
            memory_limit: problemDetail?.memory_limit
        })
            .then(response => {
                setLoading1(false);
                // 각 Testcase 실행결과 표시
                const _answerCheckData = response.data.submissions.map((submission: any, index: any) =>
                    `Test case #${index + 1} result: ${submission.status.description} (${submission.time} sec)`
                ).join('\n');

                // console.log(response.data.submissions[0].source_code);


                // "Accepted"의 개수를 계산
                const acceptedCount = response.data.submissions.filter((submission: any) => submission.status.description === "Accepted").length;

                // 결과 추가
                const __answerCheckData =
                    _answerCheckData +
                    `\n\nOverall result: ` +
                    (acceptedCount === response.data.submissions.length ? "Correct 👍" : "Wrong 😅");

                setAnswerCheckData(__answerCheckData);

                // 만약 전부 정답이라면 AI로 한번더 엄격한 채점 요청
                if (acceptedCount === response.data.submissions.length) {

                    axios.post('/api/codeRigidCheck', {
                        pythonProblem: problemDetail?.description,
                        stdin: problemDetail?.stdin,
                        expected_output: problemDetail?.stdout,
                        solution: problemDetail?.solution,
                        source_code: code,
                    })
                        .then(response => {

                        })
                        .catch(error => {
                            console.error('에러 발생:', error);
                        });
                }
            })
            .catch(error => {
                setLoading1(false);
                console.error('에러 발생:', error);
            });
    }


    // 에디터가 마운트되면 수행할 작업
    const editorRef = useRef<any>();
    function hadleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor;
    }

    const codeReviewRequest = () => {
        setLoading2(true);
        // ★ 나중에 실제 작성한 코드와 솔루션으로 변경되게 바꿔야 함
        axios.post('/api/codeFeedback', { pythonProblem: problemDetail?.description, code: code, solution: problemDetail?.solution })
            .then(response => {
                setLoading2(false);
                const codeReview = response.data.message;
                // 코드 피드백이 필요 없는 경우
                RCGPT_setResponse(codeReview);
                // console.log(codeReview);
            })
            .catch(error => {
                setLoading2(false);
                console.error('에러 발생:', error);
            });
    }

    // 모달 관련
    const [modal, contextHolder] = Modal.useModal();

    const ReachableContext = createContext<string | null>(null);

    const configSucces = {
        title: '정답',
        content: (
            <>
                훌륭합니다!
            </>
        ),
    };

    const configFail = {
        title: '오답',
        content: (
            <>
                다시 한번 도전해보세요!
            </>
        ),
    };

    const configError = {
        title: '오류',
        content: (
            <>
                코드를 제출해주세요.
            </>
        ),
    };
    // .. 모달 관련



    return (
        <div className='problemPage'>
            <>
                <ReachableContext.Provider value="Light">
                    {contextHolder}
                </ReachableContext.Provider>
            </>
            {

                // !loading && problemDetail ?
                problemDetail ?
                    <div className='_problemPage'>
                        <Breadcrumb items={items} afterItem={problemDetail.title} />
                        <div className='container_'>
                            <div className='_container'>
                                {/* {params.id} */}
                                <div className='left' style={{ overflow: "auto" }}>
                                    {
                                        problemDetail.description &&
                                        <div className='__container'>
                                            <div className='title'>[Instruction]</div>
                                            <p>
                                                {problemDetail.description}
                                            </p>
                                        </div>
                                    }
                                    {
                                        Array.isArray(problemDetail.stdin) && problemDetail.stdin[0] &&
                                        <div className='__container' style={{ marginTop: 16 }}>
                                            <div className='title'>Input Example #1</div>
                                            <TextArea
                                                style={{ resize: "none", height: "100%" }}
                                                value={problemDetail.stdin[0]}
                                                readOnly
                                            />
                                        </div>
                                    }
                                    {
                                        Array.isArray(problemDetail.stdin) && problemDetail.stdin[1] &&
                                        <div className='__container' style={{ marginTop: 16 }}>
                                            <div className='title'>Input Example #2</div>
                                            <TextArea
                                                style={{ resize: "none", height: "100%" }}
                                                value={problemDetail.stdin[1]}
                                                readOnly
                                            />
                                        </div>
                                    }
                                    {
                                        Array.isArray(problemDetail.stdout) && problemDetail.stdout[0] &&
                                        <div className='__container' style={{ marginTop: 16 }}>
                                            <div className='title'>Output Example #1</div>
                                            <TextArea
                                                style={{ resize: "none", height: "100%" }}
                                                value={problemDetail.stdout[0]}
                                                readOnly
                                            />
                                        </div>
                                    }
                                    {
                                        Array.isArray(problemDetail.stdout) && problemDetail.stdout[1] &&
                                        <div className='__container' style={{ marginTop: 16 }}>
                                            <div className='title'>Output Example #2</div>
                                            <TextArea
                                                style={{ resize: "none", height: "100%" }}
                                                value={problemDetail.stdout[1]}
                                                readOnly
                                            />
                                        </div>
                                    }
                                    {
                                        problemDetail.hint &&
                                        <div className='__container bottom' style={{ marginTop: 16 }}>
                                            <div className='title'>힌트</div>
                                            <p>
                                                {problemDetail.hint}
                                            </p>
                                        </div>
                                    }
                                    {
                                        problemDetail.cpu_time_limit &&
                                        <div className='__container bottom' style={{ marginTop: 16 }}>
                                            <div className='title'>Time Limit</div>
                                            <p>
                                                {problemDetail.cpu_time_limit} sec
                                            </p>
                                        </div>
                                    }
                                    {
                                        problemDetail.memory_limit &&
                                        <div className='__container bottom' style={{ marginTop: 16 }}>
                                            <div className='title'>Memory Limit</div>
                                            <p>
                                                {problemDetail.memory_limit} byte
                                            </p>
                                        </div>
                                    }
                                </div>
                                <div className='right'>
                                    <div className='__container' style={{ marginLeft: 12 }}>
                                        <div className='title' style={{ paddingBottom: 12 }}>Your Code</div>
                                    </div>
                                    <div className="editorWrapper">
                                        <Editor
                                            // width="480px"
                                            height="100%"
                                            language="python"
                                            defaultValue="# Code Here"
                                            value={code}
                                            // onMount={hadleEditorDidMount}
                                            options={{
                                                minimap: { enabled: false },
                                                // readOnly: true
                                            }}
                                            onChange={(e) => { setCode(e); }}
                                            onMount={hadleEditorDidMount}
                                        />
                                    </div>
                                    <div style={{ paddingLeft: 12, backgroundColor: "#FBFBFD", display: "flex", justifyContent: "space-between", width: "100%", height: "calc(45% - 52px)" }}>
                                        <div style={{ borderTop: "solid 2px #eee", width: "100%", display: "flex" }}>
                                            <div style={{ display: "flex", width: "calc(50% - 6px)", height: "100%" }}>
                                                <div style={{ width: "100%", height: "100%", paddingTop: 12 }}>
                                                    <div className='title' style={{ paddingBottom: 12, borderBottom: "solid 2px #eee" }}>Results</div>
                                                    <div className='resFromShell' style={{ paddingTop: 12, height: "calc(100% - 12px - 32px - 12px)", fontSize: 14 }}>
                                                        {/* # 체점 결과가 여기에 표시됩니다. */}
                                                        <TextArea
                                                            style={{ resize: "none", height: "100%" }}
                                                            // value={resFromShell}
                                                            value={answerCheckData}
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="devider" style={{ paddingTop: 6, width: 12, height: "100%", display: "flex", justifyContent: "center" }}>
                                                <div style={{ width: 2, height: "99%", backgroundColor: "#eee" }}></div>
                                            </div>
                                            <div style={{ display: "flex", width: "calc(50% - 12px)", height: "100%" }}>
                                                <div style={{ width: "100%", height: "100%", paddingTop: 12 }}>
                                                    <div className='title' style={{ paddingBottom: 12, borderBottom: "solid 2px #eee", display: "flex" }}>
                                                        <RobotOutlined />
                                                        <div style={{ marginLeft: 8 }}>Code Tutor</div>
                                                    </div>
                                                    {
                                                        !extractedComment ?
                                                            <div style={{ paddingTop: 12, height: "calc(100% - 12px - 32px - 12px)", fontSize: 14 }}>
                                                                # Code tutor's assistance will be displayed here.
                                                            </div>
                                                            :
                                                            <div style={{ paddingTop: 12, height: "calc(100% - 12px - 32px - 12px)", fontSize: 14 }}>
                                                                <TextArea
                                                                    style={{ resize: "none", height: "100%" }}
                                                                    value={extractedComment}
                                                                    readOnly
                                                                />
                                                            </div>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bottom' style={{ width: "100%", marginTop: 12, height: 58, borderTop: "solid 2px #eee", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button style={{ backgroundColor: "#D7E2EB", fontWeight: 700 }}>Reset</Button>
                                <Button
                                    onClick={() => {
                                        setLoading1(true);
                                        const code = editorRef.current.getValue();
                                        if (codeValidation(code) === true) {
                                            modal.warning(configError);
                                            setLoading1(false);
                                            return
                                        }
                                        if (codeValidation(code) === false) {

                                            codeAnswerCheck();
                                        }

                                    }}
                                    type="primary" style={{ marginLeft: 6, fontWeight: 700 }}>Submit Code</Button>
                                <Button type="primary" style={{ marginLeft: 6, fontWeight: 700 }}
                                    onClick={codeReviewRequest}
                                >
                                    Ask Code Tutor
                                </Button>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }

        </div>
    )
}