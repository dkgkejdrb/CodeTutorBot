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
import { Button, Input, Modal, Spin } from "antd";
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

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
            Home
        </>)
    },
    {
        href: '/problems',
        title: (<>
            Python Problems
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
    // 페이지 진입 시, isLogin이 false라면 Home으로 이동
    const router = useRouter();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    useEffect(() => {
        if (!isLogin) {
            router.push('/login');
            return;
        }
    }, [isLogin]);

    // 로그인한 ID
    const user_id = useSelector((state: RootState) => state.auth.id);

    // Submit Code 용 로딩
    const [loading1, setLoading1] = useState(false);

    // Code Tutor 용 로딩
    const [loading2, setLoading2] = useState(false);

    // 문제 세부사항 가져오기
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

                //  로그인한 ID와 문제 ID를 키로하여, 코드 체점 결과, 현재 작성한 코드 DB에 저장
                axios.get('/api/problemSubmissions', {
                    params: {
                        user_id: user_id,
                        problem_id: params.id,
                    }
                })
                .then(response3 => {
                    // console.log(response3.data);
                    setCode(response3.data.data.code);
                    // console.log(response3.data.data.code);
                })
                .catch(error => {
                    console.error('에러 발생:', error);
                });
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
    const [extractedComment, setExtractedComment] = useState<string>("# Code tutor's assistance will be displayed here.");
    useEffect(() => {
        // console.log(RCGP_response);
        if (RCGP_response) {
            // 정답을 맞춰서 코드 피드백이 필요 없는 경우
            if (RCGP_response == "no_correct" || RCGP_response == "No_correct") {
                const randomIndex = Math.floor(Math.random() * cheeringMessages.length);
                setExtractedComment(cheeringMessages[randomIndex]);
            }
            // 파이썬 문제를 해결하려는 의도가 없는 경우 (e.g., 'print()', single numbers, random characters)
            else if (RCGP_response == "no_meaningless" || RCGP_response == "No_meaningless") {
                setExtractedComment("Your submitted code appears to be incomplete or unclear. Please provide a more detailed attempt so I can help! 😊");
            }
            
            else
            {
                if (loading2 === false) {
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
            }
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

    // useEffect(() => {
    //     console.log(code)

    // }, [code]);

    
    // useEffect(() => {
    //     console.log(loading1);
    //  },[loading1])

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
            .then(response1 => {
                // 각 Testcase 실행결과 표시
                const _answerCheckData = response1.data.submissions.map((submission: any, index: any) =>
                    `Test case #${index + 1} result: ${submission.status.description} (${submission.time} sec)`
                ).join('\n');

                // console.log(response.data.submissions[0].source_code);


                // "Accepted"의 개수를 계산
                const acceptedCount = response1.data.submissions.filter((submission: any) => submission.status.description === "Accepted").length;

                // 만약 전부 정답이라면 AI로 한번더 엄격한 채점 요청
                if (acceptedCount === response1.data.submissions.length) {

                    axios.post('/api/codeRigidCheck', {
                        pythonProblem: problemDetail?.description,
                        stdin: problemDetail?.stdin,
                        expected_output: problemDetail?.stdout,
                        solution: problemDetail?.solution,
                        source_code: code,
                    })
                        .then(response2 => {
                        // 결과 추가
                        const __answerCheckData =
                            _answerCheckData 
                            +
                            (response2.data.message ? `\n\nCode Tutor Check 👩🏻‍🏫 : ` + response2.data.message : "")
                            +
                            `\n===\n\nOverall result: `
                            +
                            (acceptedCount === response1.data.submissions.length ? "Correct 👍" : "Wrong 😅") ;
                            // console.log(response2.data.message);


                            // 전체 정답 결과가 Correct => True, 그렇지 않으면 => False
                            if (acceptedCount === response1.data.submissions.length) {
                                setIsCorrectAnswer(true);
                            } else {
                                setIsCorrectAnswer(false);
                            }

                            // 결과 반환
                            setAnswerCheckData(__answerCheckData);
                        })
                        .catch(error => {
                            console.error('에러 발생:', error);
                        });
                }
                // 만약 오답이라면 TEST CASE만 그대로 반환
                else {
                    const __answerCheckData =
                    _answerCheckData +
                    `\n===\n\nOverall result: ` +
                    (acceptedCount === response1.data.submissions.length ? "Correct 👍" : "Wrong 😅");

                    // 전체 정답 결과가 Correct => True, 그렇지 않으면 => False
                    if (acceptedCount === response1.data.submissions.length) {
                        setIsCorrectAnswer(true);
                    } else {
                        setIsCorrectAnswer(false);
                    }
                
                    setAnswerCheckData(__answerCheckData);
                }
                
                // 로그인한 ID와 문제 ID를 키로하여, 코드 체점 결과, 현재 작성한 코드 DB에 저장
                axios.post('/api/problemSubmissions', {
                    user_id: user_id,
                    problem_id: params.id,
                    code: code,
                    is_correct: acceptedCount === response1.data.submissions.length ? "Correct" : "Incorrect",
                })
                .then(response3 => {
                    // console.log(response3.data);
                })
                .catch(error => {
                    console.error('에러 발생:', error);
                });
                setLoading1(false);
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
                
                // 로그인한 ID와 문제 ID를 키로하여, 현재 작성한 코드와 코드리뷰를 DB에 저장
                axios.post('/api/problemCodeReviews', {
                    user_id: user_id,
                    problem_id: params.id,
                    code: code,
                    code_review: codeReview,
                })
                .then(response3 => {
                    // console.log(response3.data);
                })
                .catch(error => {
                    console.error('에러 발생:', error);
                });
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
        title: 'Correct',
        content: (
            <>
                Great!
            </>
        ),
    };

    const configFail = {
        title: 'Wrong',
        content: (
            <>
                Try again!
            </>
        ),
    };

    const configError = {
        title: 'Error',
        content: (
            <>
                Submit your code.
            </>
        ),
    };
    // .. 모달 관련

    // 모달 useEffect
    useEffect(()=>{
        if (isCorrectAnswer === true) {
            modal.success(configSucces);
        } else if (isCorrectAnswer === false) {
            modal.error(configFail);
        }
    }, [isCorrectAnswer])

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
                                <div className='left' style={{ overflow: "auto" }}>
                                {
                                    problemDetail.description && (
                                        <div className="__container">
                                            <div className="title">[Instruction]</div>
                                            <p>{problemDetail.description}</p>
                                        </div>
                                    )
                                }

                                {Array.isArray(problemDetail.stdin) &&
                                    problemDetail.stdin.map((input, index) => (
                                        <div className="__container" style={{ marginTop: 16 }} key={`input-${index}`}>
                                            <div className="title">{`Input Example #${index + 1}`}</div>
                                            <div className="resFromShell">
                                                <TextArea
                                                    rows={3}
                                                    style={{ resize: "none", height: "100%" }}
                                                    value={input}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    ))
                                }

                                {Array.isArray(problemDetail.stdout) &&
                                    problemDetail.stdout.map((output, index) => (
                                        <div className="__container" style={{ marginTop: 16 }} key={`output-${index}`}>
                                            <div className="title">{`[Output Example #${index + 1}]`}</div>
                                            <div className="resFromShell">
                                                <TextArea
                                                    rows={3}
                                                    style={{ marginTop: 16, resize: "none", height: "100%" }}
                                                    value={output}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    ))
                                }
                                    {
                                        problemDetail.hint &&
                                        <div className='__container bottom' style={{ marginTop: 16 }}>
                                            <div className='title'>[Hint]</div>
                                            <p>
                                                {problemDetail.hint}
                                            </p>
                                        </div>
                                    }
                                    {
                                        problemDetail.cpu_time_limit &&
                                        <div className='__container bottom' style={{ marginTop: 16 }}>
                                            <div className='title'>[Time Limit]</div>
                                            <p>
                                                {problemDetail.cpu_time_limit} sec
                                            </p>
                                        </div>
                                    }
                                    {
                                        problemDetail.memory_limit &&
                                        <div className='__container bottom' style={{ marginTop: 16 }}>
                                            <div className='title'>[Memory Limit]</div>
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
                                                        {
                                                            !loading1?
                                                                <TextArea
                                                                    className="fade-in"
                                                                    style={{ resize: "none", height: "100%" }}
                                                                    // value={resFromShell}
                                                                    value={answerCheckData}
                                                                    readOnly
                                                                />
                                                            :
                                                            <Spin style={{ height: "100%", width: "100%", textAlign: "center", background: "rgba(0,0,0,0.05)", display: "flex", justifyContent: "center", alignItems: "center"}} />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="devider" style={{ paddingTop: 6, width: 12, height: "100%", display: "flex", justifyContent: "center" }}>
                                                <div style={{ width: 2, height: "99%", backgroundColor: "#eee" }}></div>
                                            </div>
                                            <div style={{ display: "flex", width: "calc(50% - 12px)", height: "100%" }}>
                                                <div style={{ width: "100%", height: "100%", paddingTop: 12 }}>
                                                    <div className='title' style={{ paddingBottom: 12, borderBottom: "solid 2px #eee", display: "flex" }}>
                                                        {/* <RobotOutlined /> */}
                                                        <div style={{ marginLeft: 8 }}>👩🏻‍🏫 Code Tutor</div>
                                                    </div>
                                                    {
                                                        <div className='resFromShell' style={{ paddingTop: 12, height: "calc(100% - 12px - 32px - 12px)", fontSize: 14 }}>
                                                        {
                                                            loading2 ?
                                                            <Spin style={{ height: "100%", width: "100%", textAlign: "center", background: "rgba(0,0,0,0.05)", display: "flex", justifyContent: "center", alignItems: "center"}} />
                                                            :        
                                                            // !extractedComment ?
                                                            //     <div style={{ paddingTop: 12, height: "calc(100% - 12px - 32px - 12px)", fontSize: 14 }}>
                                                            //         # Code tutor's assistance will be displayed here.
                                                            //     </div>
                                                            // :
                                                            <TextArea
                                                                className="fade-in"
                                                                style={{ resize: "none", height: "100%" }}
                                                                value={extractedComment}
                                                                readOnly
                                                            />
                                                        }                                               
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
                                {/* <Button style={{ backgroundColor: "#D7E2EB", fontWeight: 700 }}>Reset</Button> */}
                                <Button
                                    onClick={() => {
                                        const code = editorRef.current.getValue();
                                        if (codeValidation(code) === true) {
                                            modal.warning(configError);
                                        }
                                        if (codeValidation(code) === false) {
                                            codeAnswerCheck();
                                        }

                                    }}
                                    style={{ marginLeft: 6, fontWeight: 700, backgroundColor: "#D7E2EB" }}>Submit Code</Button>
                                <Button type="primary" style={{ marginLeft: 6, marginRight: 18, fontWeight: 700 }}
                                    onClick={() => {
                                        const code = editorRef.current.getValue();
                                        if (codeValidation(code) === true) {
                                            modal.warning(configError);
                                            setLoading1(false);
                                        }
                                        if (codeValidation(code) === false) {
                                            codeReviewRequest();
                                        }
                                    }}
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