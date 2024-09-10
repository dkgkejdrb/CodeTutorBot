'use client'

import Editor from "@monaco-editor/react";
import './page.css';
import Breadcrumb from './Breadcrumb';
import { ItemType } from '@/app/components/Breadcrumb';
import { useEffect, useState } from 'react';
import axios from "axios";
import { RobotOutlined } from '@ant-design/icons';
import { Button, Input } from "antd";

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
    description: string;
    difficulty: string;
    hint: string;
    input_output_ex: string;
    problem_id: string;
    restriction: string;
    title?: string;
    type: string;
    _id: string;
}

export default function Home({ params }: Props) {
    const [loading, isLoading] = useState(false);
    const [problemDetail, setProblemDetail] = useState<problemDetailType>();
    const [breadcrumbItems, setBreadcrumbItems] = useState<ItemType[]>([{
        href: '/',
        title: (<>
            홈
        </>)
    }])

    useEffect(() => {
        isLoading(true);
        axios.post('/api/problemDetail', { _id: params.id })
            // 로그인 성공
            .then(response => {
                // console.log(response.data);
                isLoading(false);

                setProblemDetail(response.data);
                // console.log('응답 데이터', response.data);
            })
            .catch(error => {
                isLoading(false);
                // console.error('에러 발생:', error);
            });
    }, [])

    // useEffect(() => {
    //     console.log(problemDetail);
    // }, [problemDetail])

    const [code, setCode] = useState<string | undefined>("");
    const [resFromShell, setResFromShell] = useState<string[] | string>(["# 실행 결과가 여기에 표시됩니다."]);
    // useEffect(()=>{
    //     console.log(code);
    // },[code])

    const submitCode = () => {
        isLoading(true);
        axios.post('/api/runPython', { code: code })
            .then(response => {
                isLoading(false);
                const responseType = response.data.type;
                const responseMessage = response.data.messages;

                if (responseType === 'syntaxError') {
                    if(!responseMessage) {
                        setResFromShell("실행할 수 없어요. 코드를 확인해 주세요. 😅");
                    } else {
                        setResFromShell(responseMessage);
                    }
                }
                else {
                    if (Array.isArray(responseMessage)) {
                        // 코드를 정상적으로 실행한 경우
                        const result = responseMessage.map((item: string, index: number) => index < compiledCode.length - 1 ? item + "\n" : item).join('');
                        setResFromShell(result);
                    } 
                }
            })
            .catch(error => {
                isLoading(false);
                console.error('에러 발생:', error);
            });
    }


    return (
        <div className='problemPage'>
            {
                !loading && problemDetail ?
                    <div className='_problemPage'>
                        <Breadcrumb items={items} afterItem={problemDetail.title} />
                        <div className='container_'>
                            <div className='_container'>
                                {/* {params.id} */}
                                <div className='left' style={{ overflow: "auto" }}>
                                    {
                                        problemDetail.description &&
                                        <div className='__container'>
                                            <div className='title'>문제 설명</div>
                                            <p>
                                                {problemDetail.description}
                                            </p>
                                        </div>
                                    }
                                    {
                                        problemDetail.restriction &&
                                        <div className='__container' style={{ marginTop: 16 }}>
                                            <div className='title'>제한 사항</div>
                                            <p>
                                                {problemDetail.restriction}
                                            </p>
                                        </div>
                                    }
                                    {
                                        problemDetail.input_output_ex &&
                                        <div className='__container' style={{ marginTop: 16 }}>
                                            <div className='title'>입출력 예</div>
                                            <div dangerouslySetInnerHTML={{ __html: problemDetail.input_output_ex }} style={{ margin: "16px 0px" }}></div>
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
                                </div>
                                <div className='right'>
                                    <div className='__container' style={{ marginLeft: 12 }}>
                                        <div className='title' style={{ paddingBottom: 12 }}>당신의 코드</div>
                                    </div>
                                    <div className="editorWrapper">
                                        <Editor
                                            // width="480px"
                                            height="100%"
                                            language="python"
                                            defaultValue="# 코드를 제출해주세요."
                                            value={code}
                                            // onMount={hadleEditorDidMount}
                                            options={{
                                                minimap: { enabled: false },
                                                // readOnly: true
                                            }}
                                            onChange={(e) => { setCode(e); }}
                                        />
                                    </div>
                                    <div style={{ paddingLeft: 12, backgroundColor: "#FBFBFD", display: "flex", justifyContent: "space-between", width: "100%", height: "calc(45% - 52px)" }}>
                                        <div style={{ borderTop: "solid 2px #eee", width: "100%", display: "flex" }}>
                                            <div style={{ display: "flex", width: "calc(50% - 6px)", height: "100%" }}>
                                                <div style={{ width: "100%", height: "100%", paddingTop: 12 }}>
                                                    <div className='title' style={{ paddingBottom: 12, borderBottom: "solid 2px #eee" }}>실행 결과</div>
                                                    <div className='resFromShell' style={{ paddingTop: 12, height: "calc(100% - 12px - 32px - 12px)", fontSize: 14 }}>
                                                        {/* # 실행 결과가 여기에 표시됩니다. */}
                                                        <TextArea
                                                            style={{ resize: "none", height: "100%" }}
                                                            value={resFromShell}
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
                                                        <div style={{ marginLeft: 8 }}>코드 튜터</div>
                                                    </div>
                                                    <div style={{ paddingTop: 12, height: "calc(100% - 12px - 32px - 12px)", fontSize: 14 }}>
                                                        # 코드 튜터의 도움말이 여기에 표시됩니다.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bottom' style={{ width: "100%", marginTop: 12, height: 58, borderTop: "solid 2px #eee", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button style={{ backgroundColor: "#D7E2EB", fontWeight: 700 }}>초기화</Button>
                                <Button style={{ marginLeft: 6, backgroundColor: "#D7E2EB", fontWeight: 700 }}>코드 실행</Button>
                                <Button
                                    onClick={submitCode}
                                    type="primary" style={{ marginLeft: 6, fontWeight: 700 }}>제출 후 채점</Button>
                                <Button type="primary" style={{ marginLeft: 6, fontWeight: 700 }}>코드 튜터에게 물어보기</Button>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }

        </div>
    )
}